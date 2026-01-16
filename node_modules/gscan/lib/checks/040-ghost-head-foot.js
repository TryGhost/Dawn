const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;

const checkGhostHeadFoot = function checkGhostHeadFoot(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);

    // CASE: 040-ghost-head-foot checks only needs `rules` that start with `GS040-`
    const ruleRegex = /GS040-.*/g;

    ruleSet = _.pickBy(ruleSet.rules, function (rule, ruleCode) {
        if (ruleCode.match(ruleRegex)) {
            return rule;
        }
    });

    _.each(ruleSet, function (check, ruleCode) {
        if (!theme.helpers || !Object.prototype.hasOwnProperty.call(theme.helpers, check.helper)) {
            theme.results.fail[ruleCode] = {
                failures: [{
                    ref: 'default.hbs'
                }]
            };
        } else {
            theme.results.pass.push(ruleCode);
        }
    });

    return theme;
};

module.exports = checkGhostHeadFoot;
