/**
 * Extracts the package.json JSON content. Note that this function never throws,
 * even when there is a JSON parsing error.
 * This function uses the default `config` property to match Ghost implementation.
 * @param {Object} theme The theme to extract package.json from.
 * @param {Object} defaultConfig JSON matching the default theme configuration for the checked Ghost version
 * @returns {Object} The content of the package.json file, or `null` if
 * something happened (no file, JSON parsing error...).
 */
function getJSON(theme, defaultConfig) {
    let packageJSON = theme.files.find(item => item.file === 'package.json');
    if (packageJSON && packageJSON.content) {
        try {
            const json = JSON.parse(packageJSON.content);

            // Use the default .config and allow it to be overwritten
            const content = Object.assign({}, json, {
                config: Object.assign({}, defaultConfig, json.config)
            });

            return content;
        } catch (e) {
            // Do nothing here
        }
    }
    return {
        config: defaultConfig
    };
}

module.exports = getJSON;
