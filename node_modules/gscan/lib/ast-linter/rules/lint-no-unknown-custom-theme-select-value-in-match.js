const Rule = require('./base');

function getCustomSettingName(node) {
    if (node.data && node.type === 'PathExpression' && node.parts[0] === 'custom') {
        return node.parts[1];
    }
    return null;
}

function getCustomSettingValue(node) {
    if (node.type === 'StringLiteral') {
        return node.value;
    }
    return null;
}

module.exports = class NoUnknownCustomThemeSelectValueInMatch extends Rule {
    _checkForCustomThemeSelectValueInMatch(node) {
        if (node.path.original === 'match' && node.params.length === 3) {
            if (node.params.length < 2 || node.params.length > 3) {
                return;
            }

            let indexSecondParameter = 1; // Case {{match @custom.example "123"}}
            if (node.params.length === 3) {
                indexSecondParameter = 2; // Case {{match @custom.example "!=" "123"}}
            }
            const setting = getCustomSettingName(node.params[0]) || getCustomSettingName(node.params[indexSecondParameter]);
            const value = getCustomSettingValue(node.params[0]) || getCustomSettingValue(node.params[indexSecondParameter]);

            if (!setting || !value || !this.isSelectCustomTheme(setting)) {
                return;
            }

            if (!this.isValidCustomThemeSettingSelectValue(setting, value)) {
                this.log({
                    message: `Invalid custom theme select value: "${value}"`,
                    line: node.loc && node.loc.start.line,
                    column: node.loc && node.loc.start.column,
                    source: this.sourceForNode(node)
                });
            }
        }
    }

    visitor() {
        return {
            BlockStatement: this._checkForCustomThemeSelectValueInMatch.bind(this)
        };
    }
};
