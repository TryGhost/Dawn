/**
 * Makes sure the paths are forward-slash-separated `/`
 * This is needed because the partial are only referenced with forward-slashes
 * in Handlebars templates.
 * @param {string} path filesystem path
 * @returns {string} the linux-normalized path
 */
function normalizePath(path) {
    return path && path.replace(/\\/g, '/');
}

module.exports = {
    // versions.json returns the latest version and previous defined versions, e.g. v1
    // Each version returns two properties: `major` and `docs`
    // `major` is used for the select box on gscan.ghost.org, as well as the output in the cli and is user facing
    // `docs` is used to generate the URLs that link to documentation and needs to be updated whenever
    // we release a new version on ghost.org/docs/api/
    versions: require('./versions.json'),
    normalizePath,
    getPackageJSON: require('./package-json')
};
