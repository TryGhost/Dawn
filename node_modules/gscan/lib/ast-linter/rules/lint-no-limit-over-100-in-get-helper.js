const Rule = require('./base');
const {getNodeName} = require('../helpers');

module.exports = class NoLimitOver100InGetHelper extends Rule {
    _checkForLimitOver100(node) {
        const nodeName = getNodeName(node);

        if (nodeName === 'get' && node.hash && node.hash.pairs && node.hash.pairs.length > 0) {
            const limitPair = node.hash.pairs.find(pair => pair.key === 'limit');

            if (limitPair && limitPair.value) {
                // Handle both string literals and quoted values
                const limitValue = limitPair.value.value || limitPair.value.original;

                // Parse the limit value as a number
                const numericLimit = parseInt(limitValue, 10);

                if (!isNaN(numericLimit) && numericLimit > 100) {
                    this.log({
                        line: node.loc && node.loc.start.line,
                        column: node.loc && node.loc.start.column,
                        source: this.sourceForNode(node)
                    });
                }
            }
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForLimitOver100.bind(this)
        };
    }
};
