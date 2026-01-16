const Rule = require('./base');
const {logNode} = require('../helpers');

module.exports = class NoUnknownPageProperties extends Rule {
    _checkForUnknownPageProperty(node) {
        if (node.data && node.parts && node.parts[0] === 'page' && (node.parts.length > 2 || !this.isValidPageBuilderProperty(node.parts[1]))) {
            this.log({
                message: `${logNode(node)} is not a known @page property`,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        }
    }

    visitor() {
        return {
            PathExpression: this._checkForUnknownPageProperty.bind(this)
        };
    }
};
