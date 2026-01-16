const Rule = require('./base');

module.exports = class MarkUsedPageProperties extends Rule {
    _markUsedPageProperties(node) {
        if (node.data && node.parts && node.parts.length === 2 && node.parts[0] === 'page') {
            this.scanner.context.usedPageProperties.push(node.parts[1]);
        }
    }

    visitor() {
        return {
            PathExpression: this._markUsedPageProperties.bind(this)
        };
    }
};
