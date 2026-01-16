const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');

module.exports = class NoPrevNextPostOutsidePostContext extends Rule {
    _checkForHelperOutsidePostContext(node) {
        const nodeName = getNodeName(node);
        const isPrevOrNextPostHelper = ['prev_post', 'next_post'].includes(nodeName);
        const isPostContext = this.scope.isContext('post');

        if (isPrevOrNextPostHelper && !isPostContext) {
            this.log({
                message: `${logNode(node)} can only be used in a post context`,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForHelperOutsidePostContext.bind(this)
        };
    }
};