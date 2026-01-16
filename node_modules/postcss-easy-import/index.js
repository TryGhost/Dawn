var assign = require('object-assign');
var postcssImport = require('postcss-import');
var isGlob = require('is-glob');
var resolveGlob = require('./lib/resolve-glob');
var resolveModule = require('./lib/resolve-module');

function resolve(id) {
    var resolver = isGlob(id) ? resolveGlob : resolveModule;
    return resolver.apply(null, arguments);
}

var plugin = opts => {
    opts = assign({
        prefix: false,
        extensions: '.css'
    }, opts);

    opts.resolve = resolve;

    if (opts.prefix && typeof opts.prefix !== 'string') {
        throw Error(
            'postcss-easy-import: ' +
            '\'prefix\' option should be a string or false'
        );
    }

    if (typeof opts.extensions === 'string') {
        opts.extensions = [opts.extensions];
    }

    var extensions = opts.extensions;
    if (
        !Array.isArray(extensions) ||
        !extensions.length ||
        extensions.filter(function (ext) {
            return ext && typeof ext === 'string';
        }).length !== extensions.length
    ) {
        throw Error(
            'postcss-easy-import: ' +
            '\'extensions\' option should be string or array of strings'
        );
    }

    return {
        postcssPlugin: 'postcss-easy-import',
        Once(root, options) {
            // eslint-disable-next-line new-cap
            return postcssImport(opts).Once(root, options);
        }
    };
};

plugin.postcss = true;

module.exports = plugin;
