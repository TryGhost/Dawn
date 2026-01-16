/**
 * A module for parsing and applying NQL (Normalized Query Language) queries.
 * @module nql
 */

const mingo = require('mingo');
const nql = require('@tryghost/nql-lang');
const mongoKnex = require('@tryghost/mongo-knex');
const utils = require('./utils');

/**
 * Creates an NQL API object.
 * @param {string} queryString - The NQL query string.
 * @param {Object} [options={}] - Additional options for the NQL API.
 * @returns {Object} The NQL API object.
 */
module.exports = (queryString, options = {}) => {
    const api = {};

    /**
     * Lexically analyzes the query string and returns an array of tokens.
     * @returns {Array} An array of tokens.
     */
    api.lex = () => nql.lex(queryString);

    /**
     * Parses the query string and converts it to a MongoDB JSON query.
     * @returns {Object} The MongoDB JSON query.
     */
    api.parse = function () {
        // set the filter if not present
        if (!this.filter && queryString) {
            this.filter = nql.parse(queryString);
            if (options.transformer) {
                this.filter = options.transformer(this.filter);
            }
        }

        let overrides;
        let defaults;

        if (options.overrides) {
            overrides = nql.parse(options.overrides);
        }

        if (options.defaults) {
            defaults = nql.parse(options.defaults);
        }

        let mongoJSON = utils.mergeFilters(overrides, this.filter, defaults);

        // this is a performance modification to combine multiple $ne filters into a single $nin filter (see de Morgan's laws)
        mongoJSON = utils.combineNeFilters(mongoJSON);

        if (options.expansions) {
            mongoJSON = utils.expandFilters(mongoJSON, options.expansions);
        }

        return mongoJSON;
    };

    /**
     * Applies the query to a JSON object using Mingo.
     * @param {Object} obj - The JSON object to apply the query to.
     * @returns {boolean} True if the object matches the query, false otherwise.
     */
    api.queryJSON = function (obj) {
        this.query = this.query || new mingo.Query(api.parse());
        return this.query.test(obj);
    };

    /**
     * Applies the query to a query builder object using MongoKnex.
     * @param {Object} qb - The query builder object.
     * @returns {Object} The modified query builder object.
     */
    api.querySQL = qb => mongoKnex(qb, api.parse(), options);

    /**
     * Returns the original query string.
     * @returns {string} The original query string.
     */
    api.toString = () => queryString;

    /**
     * Alias for the `parse` method.
     * @returns {Object} The MongoDB JSON query.
     */
    api.toJSON = api.parse;

    return api;
};

/**
 * Utility functions for NQL.
 * @namespace utils
 */
module.exports.utils = {
    mapQuery: require('@tryghost/mongo-utils').mapQuery,
    mapKeyValues: require('@tryghost/mongo-utils').mapKeyValues
};
