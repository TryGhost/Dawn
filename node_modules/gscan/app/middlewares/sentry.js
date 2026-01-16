const sentryDSN = process.env.SENTRY_DSN;

if (sentryDSN) {
    const Sentry = require('@sentry/node');
    const version = require('../../package.json').version;
    Sentry.init({
        dsn: sentryDSN,
        release: 'gscan@' + version,
        environment: process.env.NODE_ENV
    });
}
