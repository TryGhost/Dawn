const request = require('@tryghost/request');
const debug = require('debug')('@tryghost/http-stream');
const GhostError = require('@tryghost/errors');

class HttpStream {
    constructor(config) {
        this.config = config;
    }

    async write(data) {
        try {
            if (typeof data !== 'object') {
                throw new GhostError.IncorrectUsageError({message: 'Type Error: Http transport requires log data to be an object'});
            }

            const options = {
                ...this.config,
                method: 'POST',
                json: data
            };
            const {url} = options;
            delete options.url;

            return await request(url, options);
        } catch (error) {
            debug('Failed to ship log', error.message);
            return false;
        }
    }
}

module.exports = HttpStream;
