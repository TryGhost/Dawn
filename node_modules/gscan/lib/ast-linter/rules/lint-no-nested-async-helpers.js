const Rule = require('./base');
const {getNodeName, logNode} = require('../helpers');

const asyncHelpers = [
    'ghost_head',
    'get',
    'prev_post',
    'next_post'
];

module.exports = class NoNestedAsyncHelpers extends Rule {
    _checkForInvalidNesting(node) {
        const nodeName = getNodeName(node);
        const isAsyncHelper = asyncHelpers.includes(nodeName);

        if (isAsyncHelper) {
            for (let i = this.scope.frames.length - 1; i >= 0; i--) {
                let frame = this.scope.frames[i];
                if (frame && asyncHelpers.includes(frame.nodeName)) {
                    this.log({
                        message: `${logNode(node)} cannot be used inside ${logNode(frame.node)}`,
                        line: node.loc && node.loc.start.line,
                        column: node.loc && node.loc.start.column,
                        source: this.sourceForNode(frame.node)
                    });
                    break;
                }
            }
        }
    }

    visitor() {
        return {
            MustacheStatement: this._checkForInvalidNesting.bind(this),
            BlockStatement: this._checkForInvalidNesting.bind(this)
        };
    }
};