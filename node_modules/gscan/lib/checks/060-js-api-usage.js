const _ = require('lodash');
const spec = require('../specs');
const versions = require('../utils').versions;

module.exports = function checkGhostUrlAPI(theme, options) {
    const checkVersion = _.get(options, 'checkVersion', versions.default);
    let ruleSet = spec.get([checkVersion]);

    // CASE: 060 only has one check so far
    const ruleCode = 'GS060-JS-GUA';
    const failures = [];

    let check = ruleSet.rules[ruleCode];

    // This check only exists from v3 onwards
    if (check) {
        if (theme.files) {
            // Check JS files and HBS files for presence of the classes
            _.each(theme.files, function (themeFile) {
                if (!['.js', '.hbs'].includes(themeFile.ext)) {
                    return;
                }

                try {
                    if (themeFile.content.match(check.regex)) {
                        failures.push({ref: themeFile.file});
                    }
                } catch (err) {
                    // ignore for now
                }
            });
        }

        if (failures.length > 0) {
            theme.results.fail[ruleCode] = {failures};
        } else {
            theme.results.pass.push(ruleCode);
        }
    }

    return theme;
};
