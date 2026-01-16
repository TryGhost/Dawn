// https://github.com/TryGhost/gscan/issues/85

const Rule = require('./base');
const message = 'Multiple params are not supported in an {{if}} or {{unless}} statement.';

// valid:
// {{#if foo}}
// {{#unless foo}}

// invalid:
// {{#if foo bar}}
// {{#unless foo bar}}

module.exports = class NoMultiParamConditionals extends Rule {
    _checkForMultipleParams(node) {
        const isConditional = node.path.original === 'if' || node.path.original === 'unless';
        const hasTooManyParams = node.params.length > 1;

        if (isConditional && hasTooManyParams) {
            this.log({
                message,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            });
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForMultipleParams.bind(this)
        };
    }
};
