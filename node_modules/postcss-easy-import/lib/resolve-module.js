var fs = require('fs');
var pify = require('pify');
var resolve_ = require('resolve');
var resolve = pify(resolve_);
var addPrefix = require('./add-prefix');
var hasExtensions = require('./has-extensions');

module.exports = function (id, base, opts) {
    var prefix = opts.prefix;
    var prefixedId = prefix ? addPrefix(id, prefix) : id;
    var extensions = opts.extensions;
    var resolveOpts = {
        basedir: base,
        extensions: opts.extensions,
        moduleDirectory: [
            'node_modules',
            'web_modules'
        ],
        paths: opts.path,
        isFile: function (file, cb) {
            fs.stat(file, function (err, stat) {
                if (err && err.code === 'ENOENT') {
                    cb(null, false);
                } else if (err) {
                    cb(err);
                } else {
                    cb(null, stat.isFile());
                }
            });
        },
        packageFilter: function (pkg) {
            if (pkg.style) {
                pkg.main = pkg.style;
            } else if (
                !pkg.main ||
                !hasExtensions(pkg.main, extensions)
            ) {
                pkg.main = 'index' + extensions[0];
            }
            return pkg;
        }
    };

    return resolve('./' + prefixedId, resolveOpts)
        .catch(() => {
            if (!prefix) {
                throw Error();
            }
            return resolve(prefixedId, resolveOpts);
        })
        .catch(() => resolve('./' + id, resolveOpts))
        .catch(() => resolve(id, resolveOpts));
};
