const path = require('path');
const {isMainThread} = require('worker_threads');
const {getProcessRoot} = require('@tryghost/root-utils');
const GhostLogger = require('./GhostLogger');

let loggingConfig;
try {
    loggingConfig = require(path.join(getProcessRoot(), 'loggingrc'));
} catch (err) {
    loggingConfig = {};
}

if (!isMainThread) {
    loggingConfig.transports = ['parent'];
}

module.exports = new GhostLogger(loggingConfig);
module.exports.GhostLogger = GhostLogger;
