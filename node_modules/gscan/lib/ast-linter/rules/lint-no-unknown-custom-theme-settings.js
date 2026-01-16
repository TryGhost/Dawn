const Rule = require('./base');

module.exports = class NoUnknownCustomThemeSettings extends Rule {
    _checkForCustomThemeSettings(node) {
        if (node.data && node.parts && node.parts.length === 2 && node.parts[0] === 'custom') {
            const name = node.parts[1];
            if (!this.isValidCustomThemeSettingReference(name)) {
                this.log({
                    message: `Missing Custom Theme Setting: "${name}"`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                });
            }
        }
    }

    visitor() {
        return {
            PathExpression: this._checkForCustomThemeSettings.bind(this)
        };
    }
};
