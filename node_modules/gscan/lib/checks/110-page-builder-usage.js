const _ = require('lodash');
const spec = require('../specs');
const {versions} = require('../utils');
const ASTLinter = require('../ast-linter');

function getRules(id, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);

    const ruleRegex = new RegExp('^' + id + '-.*', 'g');
    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    return ruleSet;
}

function getLogger({theme, rule, file = null}) {
    return {
        failure: (content) => {
            if (!theme.results.fail[rule.code]) {
                theme.results.fail[rule.code] = {failures: []};
            }
            const failure = {
                ...content,
                rule: rule.code
            };
            if (file) {
                failure.ref = file.file;
            }
            theme.results.fail[rule.code].failures.push(failure);
        }
    };
}

function applyRule(rule, theme) {
    const partialVerificationCache = new Map();

    // The result variable is passed around to keep a state through the full lifecycle
    const result = {};
    try {
        // Check if the rule is enabled (optional)
        if (typeof rule.isEnabled === 'function') {
            if (!rule.isEnabled({theme, log: getLogger({theme, rule}), result, options: rule.options})) {
                return;
            }
        } else if (typeof rule.isEnabled === 'boolean' && !rule.isEnabled) {
            return;
        }

        // Initialize the rule (optional)
        if (typeof rule.init === 'function') {
            rule.init({theme, log: getLogger({theme, rule}), result});
        }

        // Run the main function on each theme file (optional)
        if (typeof rule.eachFile === 'function') {
            _.each(theme.files, function (themeFile) {
                rule.eachFile({file: themeFile, theme, log: getLogger({theme, rule}), result, partialVerificationCache});
            });
        }

        // Run the final function
        if (typeof rule.done === 'function') {
            rule.done({theme, log: getLogger({theme, rule}), result});
        }
    } catch (e) {
        // Output something instead of failing silently (should never happen)
        // eslint-disable-next-line
        console.error('gscan failure', e);
    }
}

function parseWithAST({theme, log, file, rules, callback, partialVerificationCache}) {
    const linter = new ASTLinter();

    // This rule is needed to find partials
    // Partials are needed for a full parsing
    if (!rules['mark-used-partials']) {
        rules['mark-used-partials'] = require(`../ast-linter/rules/mark-used-partials`);
    }

    function processFile(themeFile) {
        if (themeFile.parsed.error) {
            // Ignore parsing errors, they are handled in 005
            return;
        }

        const fileName = themeFile.file;
        // Check if the file is a partial
        const isPartial = fileName.startsWith('partials/');
        // Skip if already cached (for partials only)
        if (isPartial && partialVerificationCache.has(fileName)) {
            return;
        }

        const astResults = linter.verify({
            parsed: themeFile.parsed,
            rules,
            source: themeFile.content,
            moduleId: themeFile.file
        });

        // Cache the result for this partial
        if (isPartial) {
            partialVerificationCache.set(fileName, astResults);
        }

        if (astResults.length) {
            log.failure({
                message: astResults[0].message,
                ref: themeFile.file
            });
        }

        if (typeof callback === 'function') {
            callback(linter);
        }

        linter.partials.forEach(({normalizedName}) => {
            const partialFile = theme.files.find(f => f.normalizedFile === `partials/${normalizedName}.hbs`);
            if (partialFile) {
                processFile(partialFile);
            }
        });
    }

    return processFile(file);
}

const ruleImplementations = {
    'GS110-NO-MISSING-PAGE-BUILDER-USAGE': {
        isEnabled: true,
        init: ({result}) => {
            result.pageBuilderProperties = new Set();
        },
        eachFile: ({file, theme, log, result, partialVerificationCache}) => {
            const templateTest = file.file.match(/(?<!partials\/.+?)\.hbs$/);

            if (templateTest) {
                parseWithAST({file, theme, rules: {
                    'mark-used-page-properties': require(`../ast-linter/rules/mark-used-page-properties`)
                }, log, partialVerificationCache, callback: (linter) => {
                    linter.usedPageProperties.forEach((variable) => {
                        result.pageBuilderProperties.add(variable);
                    });
                }});
            }
        },
        done: ({log, result}) => {
            // TODO: get this from the spec rather than hard-coding to account for version changes
            const knownPageBuilderProperties = ['show_title_and_feature_image'];
            const notUsedProperties = knownPageBuilderProperties.filter(x => !result.pageBuilderProperties.has(x));

            notUsedProperties.forEach((property) => {
                log.failure({
                    ref: `page.hbs`,
                    message: `@page.${property} is not used`
                });
            });
        }
    },
    'GS110-NO-UNKNOWN-PAGE-BUILDER-USAGE': {
        isEnabled: true,
        eachFile: ({file, theme, log, partialVerificationCache}) => {
            const templateTest = file.file.match(/(?<!partials\/.+?)\.hbs$/);

            if (templateTest) {
                parseWithAST({
                    file, theme, rules: {
                        'no-unknown-page-properties': require(`../ast-linter/rules/lint-no-unknown-page-properties`)
                    }, log, partialVerificationCache, callback: () => {}
                });
            }
        }
    }
};

function checkUsage(theme, options) {
    const rules = getRules('GS110', options);

    _.each(rules, function (check, ruleCode) {
        applyRule({
            code: ruleCode,
            ...check,
            ...ruleImplementations[ruleCode],
            options
        }, theme);
    });

    return theme;
}

module.exports = checkUsage;
