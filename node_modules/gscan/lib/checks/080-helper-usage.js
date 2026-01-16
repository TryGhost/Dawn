const _ = require('lodash');
const spec = require('../specs');
const {versions, getPackageJSON} = require('../utils');

module.exports = function checkUsage(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);
    const packageJSON = getPackageJSON(theme);
    let targetApiVersion = (packageJSON && packageJSON.engines && packageJSON.engines['ghost-api']) || versions.default;

    // CASE: 080-helper-usage checks only needs `rules` that start with `GS080-`
    const ruleRegex = /GS080-.*/g;
    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });
    _.each(ruleSet, function (check, ruleCode) {
        _.each(theme.files, function (themeFile) {
            var template = themeFile.file.match(/\.hbs$/);
            const validApi = check.validInAPI ? check.validInAPI.includes(targetApiVersion) : true;
            if (template) {
                if (validApi && themeFile.content.match(check.regex)) {
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
