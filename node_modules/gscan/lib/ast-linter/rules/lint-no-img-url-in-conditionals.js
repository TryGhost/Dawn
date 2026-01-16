// https://github.com/TryGhost/gscan/issues/85

const Rule = require('./base');
const message = 'The {{img_url}} helper should not be used as a parameter to {{#if}} or {{#unless}}';

// invalid:
// {{#if img_url feature_image}}

module.exports = class NoMultiParamConditionals extends Rule {
    _checkForImgUrlParam(node) {
        const isConditional = node.path.original === 'if' || node.path.original === 'unless';
        const hasImgUrlParam = isConditional && node.params[0].original === 'img_url';
        let fix;

        if (isConditional && hasImgUrlParam) {
            if (node.params[1]) {
                fix = `Remove the 'img_url' so your conditional looks like {{#${node.path.original} ${node.params[1].original}}}`;
            }

            this.log({
                message,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node),
                fix
            });
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForImgUrlParam.bind(this)
        };
    }
};
