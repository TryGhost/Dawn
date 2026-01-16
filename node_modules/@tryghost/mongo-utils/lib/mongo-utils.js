/**
 * @fileoverview This file contains utility functions for working with MongoDB queries.
 * @module mongo-utils
 */
const _ = require('lodash');

const GROUPS = ['$and', '$or'];

/**
 * Maps over a mongo query, calling `fn` on each non-operator object
 * using the return value as the new query object at that level/layer
 * 
 * Maps the given query object using the provided mapping function.
 * If the query is an array, it recursively maps each object in the array.
 * If the query is an object, it maps each key-value pair using the mapping function.
 * If the key is in the GROUPS array, it maps the value recursively.
 * If the key is 'yg', it maps the value recursively.
 * Otherwise, it applies the mapping function to the value and key.
 *
 * @param {Object|Array} query - The query object to be mapped.
 * @param {Function} fn - The mapping function to be applied to each value and key.
 * @returns {Object|Array} - The mapped query object.
 */
const mapQuery = (query, fn) => {
    if (Array.isArray(query)) {
        return query.map(obj => mapQuery(obj, fn))
            // Allow removal of empty children from lists
            .filter(obj => !_.isEmpty(obj));
    }
    return _.reduce(query, (modifiedNQLMongoJSON, value, key) => {
        let mappedObject;
        if (GROUPS.includes(key)) {
            const mappedValue = mapQuery(value, fn);
            // Allow removal of parent with empty children
            mappedObject = _.isEmpty(mappedValue) ? null : {
                [key]: mappedValue
            };
        } else if (key === 'yg') {
            mappedObject = {
                [key]: mapQuery(value, fn)
            };
        } else {
            mappedObject = fn(value, key);
        }

        return _.assign({}, modifiedNQLMongoJSON, mappedObject);
    }, {});
};

/**
 * Combines two filters into a single filter with the $and conjuction.
 *
 * @param {object} primary - The primary filter.
 * @param {object} secondary - The secondary filter.
 * @returns {object} - The combined filter.
 */
const combineFilters = (primary, secondary) => {
    if (_.isEmpty(primary)) {
        return secondary;
    }

    if (_.isEmpty(secondary)) {
        return primary;
    }

    return {
        $and: [primary, secondary]
    };
};

/**
 * Finds a statement in an object recursively.
 *
 * @param {Object} statements - The object containing statements.
 * @param {string} match - The statement to match.
 * @returns {boolean} - Returns true if the statement is found, otherwise false.
 */
const findStatement = (statements, match) => {
    return _.some(statements, (value, key, obj) => {
        if (key === '$and') {
            return findStatement(obj.$and, match);
        } else if (key === '$or') {
            return findStatement(obj.$or, match);
        } else {
            if ((key !== match) && _.isObject(value)) {
                return findStatement(value, match);
            } else {
                return (key === match);
            }
        }
    });
};

/**
 * Filters out statements from an object based on a given condition.
 * 
 * Removes statements keys when matching `func` returns true
 * in the primary filter, e.g.:
 *
 * In NQL results equivalent to:
 * ('featured:true', 'featured:false') => ''
 * ('featured:true', 'featured:false,status:published') => 'status:published'
 *
 * @param {Object} statements - The object containing the statements to filter.
 * @param {Function} func - The condition function used to filter the statements.
 * @returns {Object} - The filtered object.
 */
const rejectStatements = (statements, func) => {
    if (!statements) {
        return statements;
    }

    return mapQuery(statements, function (value, key) {
        if (func(key)) {
            return;
        }
        return {
            [key]: value
        };
    });
};

/**
 * Merges multiple filters into a single filter object.
 * 
 * Util to combine multiple filters based on the priority how they are passed into the method.
 * For example: mergeFilter(overrides, custom, defaults);
 * would merge these three filters having overrides on highers priority
 * and defaults on the lowest priority
 *
 * @param {...Object} filters - The filters to be merged.
 * @returns {Object} The merged filter object.
 */
const mergeFilters = (...filters) => {
    let merged = {};

    filters
        .filter(filter => (!!filter)) // CASE: remove empty arguments if any
        .forEach((filter) => {
            if (filter && Object.keys(filter).length > 0) {
                filter = rejectStatements(filter, (statement) => {
                    return findStatement(merged, statement);
                });

                if (filter) {
                    merged = Object.keys(merged).length > 0 ? combineFilters(merged, filter) : filter;
                }
            }
        });

    return merged;
};

/**
 * Expands Mongo JSON statements with custom statements
 *
 * @param {Array} statements - The array of statements to be expanded.
 * @param {Array} expansions - The array of expansions to be applied to the statements.
 * @returns {Array} - The expanded statements array.
 */
const expandFilters = (statements, expansions) => {
    const expand = (primary, secondary) => {
        // CASE: we don't want to have separate $and groups when expanding
        //       all statements should be withing the same group
        if (secondary.$and) {
            return {$and: [
                primary,
                ...secondary.$and
            ]};
        }

        return {$and: [
            primary,
            secondary
        ]};
    };

    return mapQuery(statements, function (value, key) {
        const expansion = _.find(expansions, {key});

        if (!expansion) {
            return {
                [key]: value
            };
        }

        let replaced = {
            [expansion.replacement]: value
        };

        if (expansion.expansion) {
            return expand(replaced, expansion.expansion);
        }

        return replaced;
    });
};

/**
 * @typedef {object} Mapping
 *
 * @prop {any} from
 * @prop {any} to
 */

/**
 * @typedef {object} KeyValueMapping
 *
 * @prop {Mapping} key
 * @prop {Mapping[]} values
 */

/**
 * Returns the replace value for `input`, or just `input` if there is no replacement
 *
 * @param {any} input
 * @param {Mapping[]} valueMappings
 *
 * @returns {any}
 */
function replaceValue(input, valueMappings) {
    const replacer = valueMappings.find(({from}) => from === input);
    return replacer ? replacer.to : input;
}

/**
 * Returns the result of calling fn on an item or each item in an array
 */
function fmap(item, fn) {
    return Array.isArray(item) ? item.map(fn) : fn(item);
}

/**
 * @typedef {Object} Query
 */

/**
 * Returns a transformer which can be passed into nql
 *
 * @param {KeyValueMapping} mapping
 *
 * @returns {(input: Query) => Query}
 */
function mapKeyValues(mapping) {
    /**
     * @param {Query} input
     */
    return function transformer(input) {
        return mapQuery(input, function (value, key) {
            // Passthrough on anything that doesn't match our mapping
            if (key !== mapping.key.from) {
                return {
                    [key]: value
                };
            }

            // Primitive query of the form "key: value"
            if (typeof value !== 'object') {
                return {
                    [mapping.key.to]: replaceValue(value, mapping.values)
                };
            }

            // Complex query of the form "key: { $in: [value, value] }" or "key: { $ne: value }"
            return {
                [mapping.key.to]: _.reduce(value, (updatedQuery, objValue, objKey) => {
                    // objKey = $in | $ne | etc...
                    // objValue = vallue | [value, value] | etc...
                    return Object.assign(updatedQuery, {
                        [objKey]: fmap(objValue, item => replaceValue(item, mapping.values))
                    });
                }, {})
            };
        });
    };
}

/**
 * Replace all filters with a given key by a given filter
 */
/**
 * Replaces filters in the given statements with the corresponding replacements.
 *
 * @param {Object} statements - The statements to be processed.
 * @param {Object} replacements - The replacements to be applied.
 * @returns {Object} - The updated statements with filters replaced.
 */
const replaceFilters = (statements, replacements) => {
    return mapQuery(statements, function (value, key) {
        const replacement = Object.keys(replacements).includes(key); // we use this because the replacement can be undefined too

        if (!replacement) {
            return {
                [key]: value
            };
        }

        return replacements[key] ?? {};
    });
};

/**
 * Chains multiple transformers together to create a new transformer function.
 *
 * @param {...function} transformers - The transformer functions to be chained.
 * @returns {function} - The chained transformer function.
 */
function chainTransformers(...transformers) {
    return function (filter) {
        for (const transformer of transformers) {
            filter = transformer(filter);
        }
        return filter;
    };
}

/**
 * Retrieves all the keys used in the given filter object.
 *
 * @param {Object} filter - The filter object to analyze.
 * @returns {string[]} An array of keys used in the filter object.
 */
function getUsedKeys(filter) {
    if (!filter) {
        return [];
    }
    const usedKeys = [];
    if (filter.$and) {
        for (const subfilter of filter.$and) {
            for (const key of getUsedKeys(subfilter)) {
                if (!usedKeys.includes(key)) {
                    usedKeys.push(key);
                }
            }
        }
    } else if (filter.$or) {
        for (const subfilter of filter.$or) {
            for (const key of getUsedKeys(subfilter)) {
                if (!usedKeys.includes(key)) {
                    usedKeys.push(key);
                }
            }
        }
    } else if (filter.yg) {
        // Single filter grouped in brackets
        usedKeys.push(...getUsedKeys(filter.yg));
    } else {
        usedKeys.push(...Object.keys(filter));
    }

    return usedKeys;
}

/**
 * Split a mongo filter into two mongo filters that can be AND'ed together. The first returned filter will only contain the filtered keys, while the second filter only contains the leftover keys. It throws an error if this is not possible.
 * Both the first and second filter can be undefined if no keys are found for them.
 * 
 * @param {*} filter 
 * @param {string[]} keys A list of keys that should be returned in the first returned filter
 */
function splitFilter(filter, keys) {
    let withKeysFilter = undefined;
    let withoutKeysFilter = undefined;

    // If filter is not an object
    if (typeof filter !== 'object') {
        return [withKeysFilter, withoutKeysFilter];
    }

    if (filter.$and) {
        // And filter
        for (const subfilter of filter.$and) {
            const usedKeys = getUsedKeys(subfilter);

            // If this filter is using a combination of keys: not possible to split this filter
            let hasKeys = false;
            for (const key of usedKeys) {
                if (keys.includes(key)) {
                    hasKeys = true;
                } else {
                    if (hasKeys) {
                        //eslint-disable-next-line no-restricted-syntax
                        throw new Error(`This filter is not supported because you cannot combine ${keys.join(', ')} filters with other filters except at the root level in an AND.`);
                    }
                }
            }

            if (hasKeys) {
                if (withKeysFilter) {
                    withKeysFilter.$and.push(subfilter);
                } else {
                    withKeysFilter = {$and: [subfilter]};
                }
            } else {
                if (withoutKeysFilter) {
                    withoutKeysFilter.$and.push(subfilter);
                } else {
                    withoutKeysFilter = {$and: [subfilter]};
                }
            }
        }

        // Simplify $and with only one filter
        if (withKeysFilter && withKeysFilter.$and.length === 1) {
            withKeysFilter = withKeysFilter.$and[0];
        }
        if (withoutKeysFilter && withoutKeysFilter.$and.length === 1) {
            withoutKeysFilter = withoutKeysFilter.$and[0];
        }
    } else if (filter.$or) {
        // OR is only allowed if all the filters belong in one group (all in allowed keys or none in allowed keys)
        let hasKeys = false;

        for (const subfilter of filter.$or) {
            const usedKeys = getUsedKeys(subfilter);
            
            for (const key of usedKeys) {
                if (keys.includes(key)) {
                    hasKeys = true;
                    continue;
                } else {
                    if (hasKeys) {
                        //eslint-disable-next-line no-restricted-syntax
                        throw new Error(`This filter is not supported because you cannot combine ${keys.join(', ')} filters with other filters in an OR.`);
                    }
                }
            }
        }

        if (hasKeys) {
            withKeysFilter = filter;
        } else {
            withoutKeysFilter = filter;
        }
    } else if (filter.yg) {
        // Single filter grouped in brackets
        return this.splitFilter(filter.yg, keys);
    } else {
        const filterKeys = Object.keys(filter);

        for (const key of filterKeys) {
            if (keys.includes(key)) {
                if (withKeysFilter) {
                    withKeysFilter[key] = filter[key];
                } else {
                    withKeysFilter = {[key]: filter[key]};
                }
            } else {
                if (withoutKeysFilter) {
                    withoutKeysFilter[key] = filter[key];
                } else {
                    withoutKeysFilter = {[key]: filter[key]};
                }
            }
        }
    }

    return [withKeysFilter, withoutKeysFilter];
}

/**
 * Maps keys from an object to an array of key-value pairs.
 * 
 * Same as mapKeyValues, but with easier syntax and no support for value mapping.
 * Returns a list of transformers (one for every key). Use `chainTransformers` to merge multiple transformers into one.
 * 
 * Example usage:
 * mapKeys({
 *  'data.created_at': 'created_at',
 *  'data.member_id': 'member_id'
 * })
 * 
 * @param {Object} keys - The object containing the keys to be mapped.
 * @returns {Array} - An array of key-value pairs.
 */
function mapKeys(keys) {
    const mapping = [];
    for (const key of Object.keys(keys)) {
        if (keys[key]) {
            mapping.push({
                key: {
                    from: key,
                    to: keys[key]
                },
                values: [] // No mapping in values
            });
        }
    }
    return mapping.map(m => mapKeyValues(m));
}

module.exports = {
    mapKeyValues,
    combineFilters,
    findStatement,
    rejectStatements,
    mergeFilters,
    expandFilters,
    mapQuery,
    replaceFilters,
    chainTransformers,
    getUsedKeys,
    splitFilter,
    mapKeys
};
