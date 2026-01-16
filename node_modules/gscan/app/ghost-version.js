const debug = require('@tryghost/debug')('ghost-version');
const exec = require('child_process').exec;
const config = require('@tryghost/config');

let ttl;
let ghostVersion;

const fetchGhostVersion = function fetchGhostVersion() {
    debug('Ghost version not set or ttl expired');
    exec('npm show ghost version', function (err, stdout, stderr) {
        if (err) {
            debug('fetchGhostVersion err', err);
        }

        if (stderr) {
            debug('fetchGhostVersion stderr', stderr);
        }

        if (stdout) {
            debug('fetchGhostVersion stdout', stdout);
            ghostVersion = stdout;
            ttl = new Date(Date.now() + config.get('ghostVersionTTL')).valueOf();
        }
    });
};

const middleware = function middleware(req, res, next) {
    if (!ghostVersion || ttl && ttl < Date.now()) {
        fetchGhostVersion();
    }

    debug('res.locals.ghostVersion: ' + ghostVersion);
    res.locals.ghostVersion = ghostVersion;
    next();
};

fetchGhostVersion();

module.exports = middleware;
