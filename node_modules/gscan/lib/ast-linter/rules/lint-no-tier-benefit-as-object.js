const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');
const _ = require('lodash');

module.exports = class NoTierBenefitAsObject extends Rule {
    _checkForHelperName(node) {
        const nodeName = getNodeName(node);
        const isMatchingHelper = (nodeName.includes('name'));
        const foreachNode = this.scope.getParentContextNode('foreach');
        const getNode = this.scope.getParentContextNode('get');

        const hasForeachBenefits = _.get(foreachNode, 'params[0].original') === 'benefits';
        const hasGetTiers = _.get(getNode, 'params[0].original') === 'tiers';

        if (hasForeachBenefits && hasGetTiers && isMatchingHelper) {
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
