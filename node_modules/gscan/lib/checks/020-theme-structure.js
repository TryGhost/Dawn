const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;

// TODO: template inspection
//_.each(spec.templates, function (template) {
//    var match = _.find(theme.files, function (themeFile) {
//        return themeFile.file.match(template.pattern);
//    });
//
//    if (match) {
//        out.push({
//            level: 'feature',
//            ref: template.name,
//            message: 'template is provided'
//        });
//    }
//});

const checkThemeStructure = function checkThemeStructure(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);

    // CASE: 020-theme-structure checks only needs `rules` that start with `GS020-`
    const ruleRegex = /GS020-.*/g;

    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    _.each(ruleSet, function (check, ruleCode) {
        if (!_.some(theme.files, {file: check.path})) {
            // file doesn't exist
            theme.results.fail[ruleCode] = {
                failures: [
                    {
                        ref: check.path
                    }
                ]
            };
        } else {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkThemeStructure;
