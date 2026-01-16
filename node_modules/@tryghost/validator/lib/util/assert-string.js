const errors = require('@tryghost/errors');

/**
 * This file is a copy of validator.js assertString util - v13.7.0:
 * https://github.com/validatorjs/validator.js/blob/531dc7f1f75613bec75c6d888b46480455e78dc7/src/lib/util/assertString.js
 */
module.exports = function assertString(input) {
    const isString = typeof input === 'string' || input instanceof String;

    if (!isString) {
        let invalidType = typeof input;
        if (input === null) {
            invalidType = 'null';
        } else if (invalidType === 'object') {
            invalidType = input.constructor.name;
        }

        throw new errors.ValidationError({
            message: `Expected a string but received a ${invalidType}`
        });
    }
};
