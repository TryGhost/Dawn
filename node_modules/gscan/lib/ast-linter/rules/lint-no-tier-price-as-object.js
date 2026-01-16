const _ = require('lodash');
const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');

module.exports = class NoMonthlyYearlyPriceObjects extends Rule {
    _checkForHelperName(node) {
        const nodeName = getNodeName(node);
        const isMatchingHelper = (nodeName.includes('monthly_price.')) || (nodeName.includes('yearly_price.'));
        const getNode = this.scope.getParentContextNode('get');
        const hasGetTiers = _.get(getNode, 'params[0].original') === 'tiers';

        if (isMatchingHelper && hasGetTiers) {
            this.log({
                message: `${logNode(node)} should not be used`,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        }
    }

    visitor() {
        return {
            MustacheStatement: this._checkForHelperName.bind(this)
        };
    }
};
