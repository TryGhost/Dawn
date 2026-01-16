const _ = require('lodash');
const spec = require('./specs');
const versions = require('./utils').versions;
const calcScore = require('./utils/score-calculator');

const formatCLI = (theme) => {
    _.each(theme.results, (results) => {
        if (results.length) {
            results.forEach((result) => {
                ['rule', 'details'].forEach((key) => {
                    // blue highlight instead of <code></code> block
                    result[key] = result[key].replace(/<code>/g, '\x1B[36m');
                    result[key] = result[key].replace(/<\/code>/g, '\x1B[39m');

                    // new line instead of <br>
                    result[key] = result[key].replace(/<br>/g, '\n');

                    // transforms '<a href=link>text</a>' -> 'text (link)'
                    result[key] = result[key].replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, '$2 ($1)');
                });
            });
        }
    });
};

/**
 * TODO: This needs cleaning up, a lot
 */
const format = function format(theme, options = {}) {
    options = _.extend({onlyFatalErrors: false, sortByFiles: false}, options);
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    const ruleSet = spec.get([checkVersion]);

    var processedCodes = [],
        hasFatalErrors = false,
        stats = {
            error: 0,
            warning: 0,
            recommendation: 0
        };

    theme.results.error = [];
    theme.results.warning = [];
    theme.results.recommendation = [];
    theme.results.missing = [];

    _.each(theme.results.fail, function (info, code) {
        const rule = ruleSet.rules[code];

        if (rule.fatal && options.onlyFatalErrors || options.onlyFatalErrors === false) {
            if (rule.fatal) {
                hasFatalErrors = true;
            }

            theme.results[rule.level].push(_.extend({}, _.merge({}, {fatal: false}, rule), info, {code: code}));
            stats[rule.level] += 1;
            processedCodes.push(code);
        }
    });

    delete theme.results.fail;

    _.each(theme.results.pass, function (code, index) {
        const rule = ruleSet.rules[code];
        theme.results.pass[index] = _.extend({}, rule, {code: code});
        stats[rule.level] += 1;
        processedCodes.push(code);
    });

    _.each(_.difference(_.keys(ruleSet.rules), processedCodes), function (code) {
        theme.results.missing.push(ruleSet.rules[code]);
    });

    theme.results.score = calcScore(theme.results, stats);
    theme.results.hasFatalErrors = hasFatalErrors;

    // CASE 1: sort by files (@TODO: sort by passed rules is not possible, because we don't push the file reference)
    // CASE 2: (default): sort by rules
    if (options.sortByFiles) {
        const recommendationsByFile = {};
        const errorsByFile = {};
        const warningsByFile = {};

        theme.results.error.forEach((error) => {
            const failures = error.failures;

            if (!failures || !failures.length) {
                return;
            }

            failures.forEach((failure) => {
                if (!Object.prototype.hasOwnProperty.call(errorsByFile, failure.ref)) {
                    errorsByFile[failure.ref] = [];
                }

                errorsByFile[failure.ref].push(error);
            });
        });

        theme.results.warning.forEach((warning) => {
            const failures = warning.failures;

            if (!failures || !failures.length) {
                return;
            }

            failures.forEach((failure) => {
                if (!Object.prototype.hasOwnProperty.call(warningsByFile, failure.ref)) {
                    warningsByFile[failure.ref] = [];
                }

                warningsByFile[failure.ref].push(warning);
            });
        });

        theme.results.recommendation.forEach((passed) => {
            const failures = passed.failures;

            if (!failures || !failures.length) {
                return;
            }

            failures.forEach((failure) => {
                if (!Object.prototype.hasOwnProperty.call(recommendationsByFile, failure.ref)) {
                    recommendationsByFile[failure.ref] = [];
                }

                recommendationsByFile[failure.ref].push(passed);
            });
        });

        theme.results.recommendation = {
            all: theme.results.recommendation,
            byFiles: recommendationsByFile
        };

        theme.results.error = {
            all: theme.results.error,
            byFiles: errorsByFile
        };

        theme.results.warning = {
            all: theme.results.warning,
            byFiles: warningsByFile
        };
    } else {
        theme.results.error = _.orderBy(theme.results.error, 'fatal', 'desc');
    }

    if (options.format) {
        if (options.format === 'cli') {
            formatCLI(theme);
        }
    }

    return theme;
};

module.exports = format;
