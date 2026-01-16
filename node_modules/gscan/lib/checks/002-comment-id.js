const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;

const checkCommentID = function checkCommentID(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);

    // CASE: 002-comment-id checks only needs `rules` that start with `GS002`
    const ruleRegex = /GS002-.*/g;

    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });
    _.each(ruleSet, function (check, ruleCode) {
        _.each(theme.files, function (themeFile) {
            var template = themeFile.file.match(/\.hbs$/);

            if (template) {
                if (themeFile.content.match(check.regex)) {
                    if (!Object.prototype.hasOwnProperty.call(theme.results.fail, (ruleCode))) {
                        theme.results.fail[ruleCode] = {failures: []};
                    }

                    theme.results.fail[ruleCode].failures.push(
                        {
                            ref: themeFile.file
                        }
                    );
                }
            }
        });

        if (theme.results.pass.indexOf(ruleCode) === -1 && !Object.prototype.hasOwnProperty.call(theme.results.fail, ruleCode)) {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkCommentID;
