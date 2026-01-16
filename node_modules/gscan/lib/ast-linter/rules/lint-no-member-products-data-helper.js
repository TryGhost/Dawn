const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');

module.exports = class NoMemberProductsHelper extends Rule {
    _checkForHelperName(node) {
        const nodeName = getNodeName(node);
        const isMatchingHelper = (nodeName === '@member.products');

        if (isMatchingHelper) {
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
