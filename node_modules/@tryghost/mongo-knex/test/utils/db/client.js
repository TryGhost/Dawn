const debug = require('debug')('mongo-knex:test');
const config = require('../../config');

debug(config.get('database'));

module.exports = () => require('knex')(config.get('database'));
