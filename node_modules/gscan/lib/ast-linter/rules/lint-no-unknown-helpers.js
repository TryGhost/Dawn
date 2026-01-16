const Rule = require('./base');
const {getNodeName, classifyNode, transformLiteralToPath} = require('../helpers');

module.exports = class NoUnknownHelpers extends Rule {
    _checkForUnknownHelpers(node) {
        transformLiteralToPath(node); // Prevents issue when the helper name is double-quoted
        const nodeName = getNodeName(node);
        const helperType = classifyNode(node);

        // Restrict to `helper` nodes to avoid handling `ambiguous` nodes
        if (nodeName && helperType === 'helper') {
            if (!this.isValidHelperReference(nodeName)) {
                this.log({
                    message: `Missing helper: "${nodeName}"`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                });
            }
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForUnknownHelpers.bind(this),
            MustacheStatement: this._checkForUnknownHelpers.bind(this),
            SubExpression: this._checkForUnknownHelpers.bind(this)
        };
    }
};
