const _ = require('lodash');

const levelWeights = {
    error: 10,
    warning: 3,
    recommendation: 1
};

/**
 *
 * @param {Object} results
 * @param {Object} results.error
 * @param {Object} results.warning
 * @param {Object} results.recommendation
 * @param {Object} stats
 * @param {Object} stats.error
 * @param {Object} stats.warning
 * @param {Object} stats.recommendation
* @returns {Object}
 */
const calcScore = function calcScore(results, stats) {
    var maxScore, actualScore, balancedScore;

    maxScore = _.reduce(levelWeights, function (max, weight, level) {
        return max + (weight * stats[level]);
    }, 0);

    actualScore = _.reduce(levelWeights, function (max, weight, level) {
        return max - (weight * _.size(results[level]));
    }, maxScore);

    balancedScore = _.floor((100 / maxScore) * actualScore);

    return {
        value: balancedScore,
        level: _.size(results.error) > 0 ? 'error' : balancedScore < 60 ? 'warning' : 'passing'
    };
};

module.exports = calcScore;
