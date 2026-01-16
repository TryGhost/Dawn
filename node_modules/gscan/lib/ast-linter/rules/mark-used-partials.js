const Rule = require('./base');
const {getPartialName} = require('../helpers');
const {normalizePath} = require('../../utils');

module.exports = class MarkUsedPartials extends Rule {
    _markUsedPartials(node) {
        const nodeName = getPartialName(node);

        if (nodeName) {
            this.scanner.context.partials.push({
                node: nodeName,
                normalizedName: normalizePath(nodeName),
                type: node.type,
                loc: node.loc,
                parameters: node.params ? node.params.map(p => p.original) : null
            });
        }
    }

    visitor() {
        return {
            PartialStatement: this._markUsedPartials.bind(this),
            PartialBlockStatement: this._markUsedPartials.bind(this)
        };
    }
};
