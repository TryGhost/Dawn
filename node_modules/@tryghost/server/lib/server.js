const debug = require('@tryghost/debug')('server');
const logging = require('@tryghost/logging');
const http = require('http');

let server;
let normalizedPort;

/**
 * Get port from nconf
 */

/**
 * @description Create a Node HTTP server.
 *
 * @param {Express} app
 * @param {any} port
 * @return {Object}
 */
const start = function start(app, port) {
    normalizedPort = normalizePort(port);
    server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    app.set('port', normalizedPort);
    server.listen(normalizedPort);
    server.on('error', onError);
    server.on('listening', onListening);

    return server;
};

/**
 * @description Stop Node HTTP server.
 * @param {Function} done
 */
const stop = function stop(done) {
    try {
        server.close(done);
    } catch (e) {
        /*jshint unused:false*/
    }
};

/**
 * Normalize a port into a number, string, or false.
 */

/**
 * @description Normalize a port.
 * @param {any} val
 * @return {Number|String|Boolean}
 */
function normalizePort(val) {
    const portVal = parseInt(val, 10);

    if (isNaN(portVal)) {
        // CASE: Named pipe
        return val;
    }

    if (portVal >= 0) {
        // port number
        return portVal;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

/**
 * @description Event handler for HTTP server "error" event.
 * @param {Error} error
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof normalizedPort === 'string'
        ? `Pipe ${normalizedPort}`
        : `Port ${normalizedPort}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        logging.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        logging.error(`${bind} is already in use`);
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * @description Event handler for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Server ready');
    logging.info(`Listening on ${bind} \n`);
}

module.exports.start = start;
module.exports.stop = stop;