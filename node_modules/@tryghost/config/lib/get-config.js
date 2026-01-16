const nconf = require('nconf');
const fs = require('fs');
const path = require('path');
const rootUtils = require('@tryghost/root-utils');

const env = process.env.NODE_ENV || 'development';

module.exports = function getConfig() {
    const defaults = {};
    const parentPath = rootUtils.getProcessRoot();

    const config = new nconf.Provider();

    if (parentPath && fs.existsSync(path.join(parentPath, 'config.example.json'))) {
        Object.assign(defaults, require(path.join(parentPath, 'config.example.json')));
    }

    config.argv()
        .env({
            separator: '__'
        })
        .file({
            file: path.join(parentPath, 'config.' + env + '.json')
        });

    config.set('env', env);

    config.defaults(defaults);

    return config;
};