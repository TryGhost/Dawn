var path = require('path');
var globby = require('globby');
var addPrefix = require('./add-prefix');
var hasPrefix = require('./has-prefix');
var hasExtensions = require('./has-extensions');
var reduce = require('lodash/fp/reduce');
var findIndex = require('lodash/fp/findIndex');
var map = require('lodash/fp/map');
var flow = require('lodash/fp/flow');
var filter = require('lodash/fp/filter');

function checkPrefixedVersionExists(fileToCheck, paths, prefix) {
    var index = findIndex(p => {
        const currentFile = path.basename(p);
        return currentFile === prefix + fileToCheck;
    }, paths);
    return index === -1;
}

module.exports = function resolveGlob(id, base, opts) {
    var prefix = opts.prefix;
    var extensions = opts.extensions;
    var paths = [base].concat(opts.path);
    // search in modules if non-relative filepath given
    if (id[0] !== '.') {
        paths = paths.concat([
            'node_modules',
            'web_modules'
        ]);
    }
    var prefixedId = prefix ? addPrefix(id, prefix) : null;

    var patterns = reduce((acc, p) => {
        [''].concat(extensions).forEach(ext => {
            if (prefix) {
                acc.push(path.resolve(p, prefixedId + ext));
            }
            acc.push(path.resolve(p, id + ext));
        });
        return acc;
    }, [], paths);

    return globby(patterns)
        .then(files => {
            return flow(
                // Allows a file through if it has a prefix. If it doesn't have
                // a prefix the current list of files are checked to see if a
                // prefix version exists and if not it is added.
                reduce((acc, item) => {
                    var fileName = path.basename(item);
                    if (hasPrefix(item, prefix) || checkPrefixedVersionExists(fileName, acc, prefix)) { // eslint-disable-line max-len
                        acc.push(item);
                    }
                    return acc;
                }, []),
                filter(file => hasExtensions(file, extensions)),
                map(file => path.normalize(file))
            )(files);
        });
};
