const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');

module.exports = class NoProductsHelper extends Rule {
    _checkForHelperName(node) {
        const nodeName = getNodeName(node);
        const isProductsHelper = (nodeName === 'products');

        if (isProductsHelper) {
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
