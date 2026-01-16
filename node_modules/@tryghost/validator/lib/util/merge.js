/**
 * This file is a copy of validator.js merge util - v13.7.0:
 * https://github.com/validatorjs/validator.js/blob/531dc7f1f75613bec75c6d888b46480455e78dc7/src/lib/util/merge.js
 */

module.exports = function merge(obj = {}, defaults) {
    for (const key in defaults) {
        if (typeof obj[key] === 'undefined') {
            obj[key] = defaults[key];
        }
    }
    return obj;
};
