const debug = require('@tryghost/debug')('zip');
const path = require('path');
const os = require('os');
const glob = require('glob');
const {extract} = require('@tryghost/zip');
const errors = require('@tryghost/errors');
const uuid = require('uuid');
const _ = require('lodash');

const resolveBaseDir = (zipPath) => {
    return new Promise((resolve) => {
        glob('**/index.hbs', {cwd: zipPath, nosort: true}, function (err, matches) {
            var matchedPath;

            if (!err && !_.isEmpty(matches)) {
                debug('Found matches', matches);
                matchedPath = matches[0].replace(/index\.hbs$/, '');
                zipPath = path.join(zipPath, matchedPath).replace(/\/$/, '');
            }

            return resolve(zipPath);
        });
    });
};

const readZip = (zip) => {
    const tempUuid = uuid.v4();
    const tempPath = os.tmpdir() + '/' + tempUuid;

    debug('Reading Zip', zip.path, 'into', tempPath);
    return extract(zip.path, tempPath)
        .then(async () => {
            let resolvedPath = await resolveBaseDir(tempPath);
            zip.origPath = tempPath;
            zip.origName = zip.name.replace(/\.zip$/, '');
            zip.path = resolvedPath;

            return zip;
        }).catch((err) => {
            debug('Zip extraction error', err);

            throw new errors.ValidationError({
                message: 'Failed to read zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: err.message,
                context: zip.name,
                err: err
            });
        });
};

module.exports = readZip;
