const errors = require('@tryghost/errors');

const defaultOptions = {};

function throwOnSymlinks(entry) {
    // Check if symlink
    const mode = (entry.externalFileAttributes >> 16) & 0xFFFF;
    // check if it's a symlink or dir (using stat mode constants)
    const IFMT = 61440;
    const IFLNK = 40960;
    const symlink = (mode & IFMT) === IFLNK;

    if (symlink) {
        throw new errors.UnsupportedMediaTypeError({
            message: 'Symlinks are not allowed in the zip folder.'
        });
    }
}

function throwOnLargeFilenames(entry) {
    if (Buffer.byteLength(entry.fileName, 'utf8') >= 254) {
        throw new errors.UnsupportedMediaTypeError({
            message: 'File names in the zip folder must be shorter than 254 characters.'
        });
    }
}

/**
 * Extract
 *
 * - Unzip an archive to a folder
 *
 * @param {String} zipToExtract - full path to zip file that should be extracted
 * @param {String} destination - full path of the extraction target
 * @param {Object} [options]
 * @param {Integer} options.defaultDirMode - Directory Mode (permissions), defaults to 0o755
 * @param {Integer} options.defaultFileMode - File Mode (permissions), defaults to 0o644
 * @param {Function} options.onEntry - if present, will be called with (entry, zipfile) for every entry in the zip
 */
module.exports = (zipToExtract, destination, options) => {
    const opts = Object.assign({}, defaultOptions, options);

    const extract = require('extract-zip');

    opts.dir = destination;

    const originalOnEntry = opts.onEntry;
    opts.onEntry = (entry, zipfile) => {
        throwOnSymlinks(entry);
        throwOnLargeFilenames(entry);
        if (originalOnEntry) {
            originalOnEntry(entry, zipfile);
        }
    };

    return extract(zipToExtract, opts).then(() => {
        return {path: destination};
    });
};
