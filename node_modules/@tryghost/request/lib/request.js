const _ = require('lodash');
const validator = require('@tryghost/validator');
const errors = require('@tryghost/errors');
const ghostVersion = require('@tryghost/version');

const gotPromise = import('got');
const cacheableLookupPromise = import('cacheable-lookup');

let got;
let cacheableLookup;

const defaultOptions = {
    headers: {
        'user-agent': 'Ghost/' + ghostVersion.safe + ' (https://github.com/TryGhost/Ghost)'
    },
    method: 'GET'
};

module.exports = async function request(url, options = {}) {
    // Initialise ES6 imports
    if (!got) {
        got = (await gotPromise).default;
    }
    if (!defaultOptions.dnsLookup) {
        // Ensure OS-level name resolution is not used
        const CacheableLookup = (await cacheableLookupPromise).default;
        cacheableLookup = new CacheableLookup({
            lookup: false
        });
        defaultOptions.dnsLookup = cacheableLookup.lookup;
    }

    if (_.isEmpty(url) || !validator.isURL(url)) {
        return Promise.reject(new errors.InternalServerError({
            message: 'URL empty or invalid.',
            code: 'URL_MISSING_INVALID',
            context: url
        }));
    }

    if (process.env.NODE_ENV?.startsWith('test') && !Object.prototype.hasOwnProperty.call(options, 'retry')) {
        options.retry = {
            limit: 0
        };
    }

    if (!options.method && (options.body || options.json)) {
        options.method = 'POST';
    }

    const mergedOptions = _.merge({}, defaultOptions, options);

    try {
        const response = await got(url, mergedOptions);
        return response;
    } catch (error) {
        if (error.options) {
            Object.assign(error, error.options);
            delete error.options;
        }
        if (error.response) {
            Object.assign(error, error.response);
            delete error.reponse;
        }
        throw error;
    }
};
