var loggly = require('node-loggly-bulk');
var stringifySafe = require('json-stringify-safe');
var noop = function() {};

function Bunyan2Loggly(logglyConfig, bufferLength, bufferTimeout, callback) {
    if (!logglyConfig || !logglyConfig.token || !logglyConfig.subdomain) {
        throw new Error('bunyan-loggly requires a config object with token and subdomain');
    }

    this.callback = callback || noop;
    this.bufferLength = bufferLength || 1;
    this.bufferTimeout = bufferTimeout || 30 * 1000;

    logglyConfig.json = logglyConfig.json !== false;
    logglyConfig.isBulk = logglyConfig.isBulk !== false;

    if (logglyConfig.isBulk) {
        logglyConfig.bufferOptions = {
            size: this.bufferLength,
            retriesInMilliSeconds: this.bufferTimeout,
        };
    }

    this.logglyClient = loggly.createClient(logglyConfig);
}

Bunyan2Loggly.prototype.write = function(originalData) {
    if (typeof originalData !== 'object') {
        throw new Error('bunyan-loggly requires a raw stream. Please define the type as raw when setting up the bunyan stream.');
    }

    var data = originalData;
    var bunyan2Loggly = this;

    // loggly prefers timestamp over time
    if (data.time) {
        data = JSON.parse(stringifySafe(data, null, null, noop));
        data.timestamp = data.time;
        delete data.time;
    }

    bunyan2Loggly.logglyClient.log(data, function(error, result) {
        bunyan2Loggly.callback(error, result, data);
    });
};

module.exports = Bunyan2Loggly;
