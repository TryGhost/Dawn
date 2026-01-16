const getConfig = require('./get-config');

let config;
function initConfig() {
    if (!config) {
        config = getConfig();
    }

    return config;
}

/**
 * @description Initialise nconf config object.
 *
 * The config object is cached, once it has been setup with the parent
 */
module.exports = initConfig();
