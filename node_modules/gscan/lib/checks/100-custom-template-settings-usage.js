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
            if (!rule.isEnabled({theme, log: getLogger({theme, rule}), result})) {
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
            _.each(theme.files , function (themeFile) {
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

function parseWithAST({theme, log, file, rules, callback, partialVerificationCache}){
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
                message: astResults[0].message
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
    'GS100-NO-UNUSED-CUSTOM-THEME-SETTING': {
        isEnabled: ({theme}) => {
            return !!theme.customSettings;
        },
        init: ({result}) => {
            result.customThemeSettings = new Set();
        },
        eachFile: ({file, theme, log, result, partialVerificationCache}) => {
            let templateTest = file.file.match(/(?<!partials\/.+?)\.hbs$/);

            if (templateTest) {
                parseWithAST({file, theme, rules: {
                    'mark-used-custom-theme-setting': require(`../ast-linter/rules/mark-used-custom-theme-settings`)
                }, log, partialVerificationCache, callback: (linter) => {
                    linter.customThemeSettings.forEach((variable) => {
                        result.customThemeSettings.add(variable);
                    });
                }});
            }
        },
        done: ({log, theme, result}) => {
            const config = Object.keys(theme.customSettings);
            const notUsedVariable = config.filter(x => !result.customThemeSettings.has(x));

            if (notUsedVariable.length > 0) {
                log.failure({
                    message: `Found unused variables: ${notUsedVariable.map(x => '@custom.' + x).join(', ')}`,
                    ref: 'package.json'
                });
            }
        }
    }
};

function checkUsage(theme, options) {
    const rules = getRules('GS100', options);

    _.each(rules, function (check, ruleCode) {
        applyRule({
            code: ruleCode,
            ...check,
            ...ruleImplementations[ruleCode]
        }, theme);
    });

    return theme;
}

module.exports = checkUsage;
