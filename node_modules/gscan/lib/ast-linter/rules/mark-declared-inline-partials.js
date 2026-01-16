const Rule = require('./base');
const get = require('lodash/get');

module.exports = class MarkDeclaredInlinePartials extends Rule {
    _markDeclaredInlinePartials(node, visitor) {
        if (get(node, 'path.original') === 'inline' && get(node, 'params.length') > 0) {
            const nodeName = get(node, 'params[0].original');
            this.scanner.context.inlinePartials.push({
                node: nodeName,
                parents: visitor.parents.map(p => ({
                    type: p.type,
                    loc: p.loc
                })),
                type: node.type,
                loc: node.loc,
                parameters: node.params ? node.params.map(p => p.original) : null
            });
        }
    }

    visitor() {
        return {
            DecoratorBlock: this._markDeclaredInlinePartials.bind(this)
        };
    }
};
