const debug = require('debug')('nql:test');
const config = require('../../config');

debug(config.get('database'));

module.exports = () => require('knex')(config.get('database'));
