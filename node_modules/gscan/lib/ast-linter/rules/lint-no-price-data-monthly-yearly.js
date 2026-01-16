const Rule = require('./base');

module.exports = class NoPriceDataMonthlyYearly extends Rule {
    _findPriceData(node) {
        if (node.data && node.parts && node.parts.length === 2 && node.parts[0] === 'price' && ['monthly', 'yearly'].includes(node.parts[1])) {
            this.log(({
                message: `{{@price.monthly}} and {{@price.yearly}} should be replaced with {{#get "tiers"}}`,
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node)
            }));
        }
    }

    visitor() {
        return {
            PathExpression: this._findPriceData.bind(this)
        };
    }
};
