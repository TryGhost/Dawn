const Rule = require('./base');
const _ = require('lodash');

module.exports = class NoPriceDataCurrencyGlobal extends Rule {
    _findPriceData(node) {
        if (node.data && node.parts && node.parts.length === 2 && node.parts[0] === 'price' && node.parts[1] === 'currency') {
            const foreachNode = this.scope.getParentContextNode('foreach');
            const foreachObject = _.get(foreachNode, 'params[0].original');

            if (!['@member.subscriptions', 'tiers'].includes(foreachObject)) {
                this.log(({
                    message: `{{@price.currency}} should be replaced with {{currency}} and a context`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                }));
            }
        }
    }

    visitor() {
        return {
            PathExpression: this._findPriceData.bind(this)
        };
    }
};
