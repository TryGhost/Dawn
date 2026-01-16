const Rule = require('./base');
const {logNode} = require('../helpers');

module.exports = class NoUnknownGlobals extends Rule {
    _checkMustacheForUnknownGlobal(node) {
        if (node.path.data && !this.scope.isKnownVariable(node)) {
            this.log({
                message: `${logNode(node)} is not a known global`,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        }
    }

    _checkBlockForUnknownGlobal(node) {
        if (node.path.type === 'PathExpression') {
            node.params.forEach((param) => {
                if (param.data && !this.scope.isKnownVariable(param)) {
                    this.log({
                        message: `${logNode(param)} is not a known global`,
                        line: param.loc && param.loc.start.line,
                        column: param.loc && param.loc.start.column,
                        source: this.sourceForNode(param)
                    });
                }
            });
        }
    }

    visitor() {
        return {
            MustacheStatement: this._checkMustacheForUnknownGlobal.bind(this),
            BlockStatement: this._checkBlockForUnknownGlobal.bind(this)
        };
    }
};