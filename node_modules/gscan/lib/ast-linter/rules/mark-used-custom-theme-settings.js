const Rule = require('./base');

module.exports = class MarkUsedCustomThemeSettings extends Rule {
    _markUsedCustomThemeSettings(node) {
        if (node.data && node.parts && node.parts.length === 2 && node.parts[0] === 'custom') {
            this.scanner.context.customThemeSettings.push(node.parts[1]);
        }
    }

    // `get` helpers support using handlebars expressions in their filter attribute
    // Handlebars does not parse these expressions within StringLiterals itself,
    // so we need to manually check for them here.
    _checkGetHelperAttributes(node) {
        // Only check 'get' helpers
        if (node.path && node.path.original !== 'get') {
            return;
        }

        // Check hash parameters (named attributes like filter="...")
        if (node.hash && node.hash.pairs) {
            node.hash.pairs.forEach((pair) => {
                // Only check the 'filter' attribute
                if (pair.key === 'filter' && pair.value.type === 'StringLiteral') {
                    // Search for @custom.* references in the string value
                    const customThemeSettingRegex = /@custom\.([a-z0-9_]+)/g;
                    let match;
                    while ((match = customThemeSettingRegex.exec(pair.value.value)) !== null) {
                        this.scanner.context.customThemeSettings.push(match[1]);
                    }
                }
            });
        }
    }

    visitor() {
        return {
            PathExpression: this._markUsedCustomThemeSettings.bind(this),
            SubExpression: this._checkGetHelperAttributes.bind(this),
            BlockStatement: this._checkGetHelperAttributes.bind(this)
        };
    }
};
