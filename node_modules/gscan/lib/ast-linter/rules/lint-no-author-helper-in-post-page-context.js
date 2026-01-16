const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');

module.exports = class NoAuthorHelperInPostContext extends Rule {
    _checkForHelerInPostContext(node) {
        const nodeName = getNodeName(node);
        const isAuthorHelper = (nodeName === 'author');
        const isPostContext = this.scope.hasParentContext('post');

        if (isAuthorHelper && isPostContext) {
            this.log({
                message: `${logNode(node)} should not be used in ${this.scope.currentFrame.context} context`,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        }
    }

    visitor() {
        return {
            MustacheStatement: this._checkForHelerInPostContext.bind(this)
        };
    }
};
