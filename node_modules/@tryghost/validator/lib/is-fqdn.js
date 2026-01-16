/**
 * This file is a copy of validator.js isFQDN method - v13.7.0:
 * https://github.com/validatorjs/validator.js/blob/531dc7f1f75613bec75c6d888b46480455e78dc7/src/lib/isFQDN.js
 */
/* eslint-disable camelcase */
const assertString = require('./util/assert-string');
const merge = require('./util/merge');

const default_fqdn_options = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_numeric_tld: false,
    allow_wildcard: false
};

module.exports = function isFQDN(str, options) {
    assertString(str);
    options = merge(options, default_fqdn_options);

    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1);
    }

    /* Remove the optional wildcard before checking validity */
    if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
        str = str.substring(2);
    }

    const parts = str.split('.');
    const tld = parts[parts.length - 1];

    if (options.require_tld) {
    // disallow fqdns without tld
        if (parts.length < 2) {
            return false;
        }

        if (!options.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
            return false;
        }

        // disallow spaces
        if (/\s/.test(tld)) {
            return false;
        }
    }

    // reject numeric TLDs
    if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
        return false;
    }

    return parts.every((part) => {
        if (part.length > 63) {
            return false;
        }

        if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
            return false;
        }

        // disallow full-width chars
        if (/[\uff01-\uff5e]/.test(part)) {
            return false;
        }

        // disallow parts starting or ending with hyphen
        if (/^-|-$/.test(part)) {
            return false;
        }

        if (!options.allow_underscores && /_/.test(part)) {
            return false;
        }

        return true;
    });
};
