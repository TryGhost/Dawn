const dateFormat = require('date-format');
const Transform = require('stream').Transform;
const format = require('util').format;
const prettyjson = require('prettyjson');
const each = require('lodash/each');
const get = require('lodash/get');
const isArray = require('lodash/isArray');
const isEmpty = require('lodash/isEmpty');
const isObject = require('lodash/isObject');

const OMITTED_KEYS = ['time', 'level', 'name', 'hostname', 'pid', 'v', 'msg'];

const _private = {
    levelFromName: {
        10: 'trace',
        20: 'debug',
        30: 'info',
        40: 'warn',
        50: 'error',
        60: 'fatal'
    },
    colorForLevel: {
        10: 'grey',
        20: 'grey',
        30: 'cyan',
        40: 'magenta',
        50: 'red',
        60: 'inverse'
    },
    colors: {
        default: [39, 39],
        bold: [1, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        white: [37, 39],
        grey: [90, 39],
        black: [30, 39],
        blue: [34, 39],
        cyan: [36, 39],
        green: [32, 39],
        magenta: [35, 39],
        red: [31, 39],
        yellow: [33, 39]
    }
};

function colorize(colors, value) {
    if (isArray(colors)) {
        return colors.reduce((acc, color) => colorize(color, acc), value);
    } else {
        return '\x1B[' + _private.colors[colors][0] + 'm' + value + '\x1B[' + _private.colors[colors][1] + 'm';
    }
}

function statusCode(status) {
    /* eslint-disable indent */
    const color = status >= 500 ? 'red'
        : status >= 400 ? 'yellow'
        : status >= 300 ? 'cyan'
        : status >= 200 ? 'green'
        : 'default'; // no color
    /* eslint-enable indent */

    return colorize(color, status);
}

class PrettyStream extends Transform {
    constructor(options) {
        options = options || {};
        super(options);

        this.mode = options.mode || 'short';
    }

    write(data, enc, cb) {
        // Bunyan sometimes passes things as objects. Because of this, we need to make sure
        // the data is converted to JSON
        if (isObject(data) && !(data instanceof Buffer)) {
            data = JSON.stringify(data);
        }

        super.write(data, enc, cb);
    }

    _transform(data, enc, cb) {
        if (typeof data !== 'string') {
            data = data.toString();
        }

        // Remove trailing newline if any
        data = data.replace(/\\n$/, '');

        try {
            data = JSON.parse(data);
        } catch (err) {
            cb(err);
            // If data is not JSON we don't want to continue processing as if it is
            return;
        }

        let output = '';

        // Handle time formatting
        let time;

        if (data.time) {
            // If time is provided as a string in the expected format, use it directly
            if (typeof data.time === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(data.time)) {
                time = data.time;
            } else {
                // Otherwise, parse and format it
                const dataTime = new Date(data.time);
                time = dateFormat.asString('yyyy-MM-dd hh:mm:ss', dataTime);
            }
        } else {
            // No time provided, use current time
            const now = new Date();
            time = dateFormat.asString('yyyy-MM-dd hh:mm:ss', now);
        }

        let logLevel = _private.levelFromName[data.level].toUpperCase();
        const codes = _private.colors[_private.colorForLevel[data.level]];
        let bodyPretty = '';

        logLevel = '\x1B[' + codes[0] + 'm' + logLevel + '\x1B[' + codes[1] + 'm';

        if (data.req) {
            output += format('[%s] %s "%s %s" %s %s\n',
                time,
                logLevel,
                data.req.method.toUpperCase(),
                get(data, 'req.originalUrl'),
                statusCode(get(data, 'res.statusCode')),
                get(data, 'res.responseTime')
            );
        } else if (data.msg === undefined) {
            output += format('[%s] %s\n',
                time,
                logLevel
            );
        } else {
            bodyPretty += data.msg;
            output += format('[%s] %s %s\n', time, logLevel, bodyPretty);
        }

        each(Object.fromEntries(Object.entries(data).filter(([key]) => !OMITTED_KEYS.includes(key))), function (value, key) {
            // we always output errors for now
            if (isObject(value) && value.message && value.stack) {
                let error = '\n';

                if (value.errorType) {
                    error += colorize(_private.colorForLevel[data.level], 'Type: ' + value.errorType) + '\n';
                }

                error += colorize(_private.colorForLevel[data.level], value.message) + '\n\n';

                if (value.context) {
                    error += colorize('white', value.context) + '\n';
                }

                if (value.help) {
                    error += colorize('yellow', value.help) + '\n';
                }

                if (value.context || value.help) {
                    error += '\n';
                }

                if (value.id) {
                    error += colorize(['white', 'bold'], 'Error ID:') + '\n';
                    error += '    ' + colorize('grey', value.id) + '\n\n';
                }

                if (value.code) {
                    error += colorize(['white', 'bold'], 'Error Code: ') + '\n';
                    error += '    ' + colorize('grey', value.code) + '\n\n';
                }

                if (value.errorDetails) {
                    let details = value.errorDetails;

                    try {
                        const jsonDetails = JSON.parse(value.errorDetails);
                        details = isArray(jsonDetails) ? jsonDetails[0] : jsonDetails;
                    } catch (err) {
                        // no need for special handling as we default to unparsed 'errorDetails'
                    }

                    const pretty = prettyjson.render(details, {
                        noColor: true
                    }, 4);

                    error += colorize(['white', 'bold'], 'Details:') + '\n';
                    error += colorize('grey', pretty) + '\n\n';
                }

                if (value.stack && !value.hideStack) {
                    error += colorize('grey', '----------------------------------------') + '\n\n';
                    error += colorize('grey', value.stack) + '\n';
                }

                output += format('%s\n', colorize(_private.colorForLevel[data.level], error));
            } else if (isObject(value)) {
                bodyPretty += '\n' + colorize('yellow', key.toUpperCase()) + '\n';

                let sanitized = {};

                each(value, function (innerValue, innerKey) {
                    if (!isEmpty(innerValue)) {
                        sanitized[innerKey] = innerValue;
                    }
                });

                bodyPretty += prettyjson.render(sanitized, {}) + '\n';
            } else {
                bodyPretty += prettyjson.render(value, {}) + '\n';
            }
        });

        if (this.mode !== 'short' && (bodyPretty !== data.msg)) {
            output += format('%s\n', colorize('grey', bodyPretty));
        }

        cb(null, output);
    }
}

module.exports = PrettyStream;
