const _ = require('lodash');
const Promise = require('bluebird');
const debug = require('debug')('mongo-knex:test');
const client = require('./client')();

// export our instance of client & schema
module.exports.client = client;

/**
 * Utility function
 * Manipulate incoming fixture JSON format into Array:
 *
 * [
 *    {table: 'tableName', entry: {rowData},
 *    {table: 'tableName', entry: {rowData},
 *    ...
 * ]
 *
 * @param {Object} fixtureJson
 * @returns {Array}
 */
const flatten = (fixtureJson) => {
    const ops = [];
    _.each(fixtureJson, (entries, table) => {
        _.each(entries, (entry) => {
            ops.push({table, entry});
        });
    });

    return ops;
};

/**
 * Default behaviour:
 *
 * - create tables
 * - insert base fixtures
 *
 * e.g. `setup('suite1')`
 */
module.exports.setup = name => function innerSetup() {
    const suite = name ? name : 'suite1';
    debug('Running setup for', suite);

    const schema = require(`../../integration/${suite}/schema`);

    return schema.down(client)
        .then(() => schema.up(client))
        .then(() => {
            const base = require(`../../integration/${suite}/fixtures/base`);
            return Promise.each(flatten(base), op => client(op.table).insert(op.entry));
        });
};

/**
 * Load more fixtures, prior to a group of tests
 *
 * `init('suite1', 'fixtures.json'`
 * `init('fixtures.json')`
 */
module.exports.init = (suiteName, fixtureFileName) => {
    if (!fixtureFileName) {
        fixtureFileName = suiteName;
        suiteName = null;
    }

    return function innerInit() {
        const suite = suiteName ? suiteName : 'suite1';
        debug('Running setup for', suite);

        let fixturesJSON = require(`../../integration/${suite}/fixtures/${fixtureFileName}.json`);
        debug('Loading fixtures for', fixtureFileName);

        return Promise.each(flatten(fixturesJSON), op => client(op.table).insert(op.entry));
    };
};

/**
 * Teardown the DB ready for the next suite, or the end of the tests
 *
 * Can be skipped
 */
module.exports.teardown = suiteName => function innerTeardown() {
    if (_.includes(process.argv, '--skip-teardown')) {
        debug('Skipping teardown for');
        return;
    }

    const suite = suiteName ? suiteName : 'suite1';
    const schema = require(`../../integration/${suite}/schema`);

    debug('Running teardown for');
    return schema.down(client);
};

/**
 * Truncate tables instead of removing tables.
 * Helpful if you want to re-insert a different test fixture.
 */
module.exports.reset = (suiteName) => {
    const suite = suiteName ? suiteName : 'suite1';
    const schema = require(`../../integration/${suite}/schema`);
    debug('Unloading fixtures for', suite);

    return Promise.each(schema.tables, (table) => {
        return client.schema.hasTable(table)
            .then((exists) => {
                if (!exists) {
                    return;
                }

                return client(table).truncate();
            });
    });
};
