/**
 * Test Utilities
 *
 * Shared utils for writing tests
 */

// DEFAULT env is sqlite3
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'testing';
}

// Require overrides - these add globals for tests
require('./overrides');

// "should" overrides
require('./assertions');

module.exports.db = require('./db');
