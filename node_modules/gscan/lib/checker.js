const _ = require('lodash');
const requireDir = require('require-dir');
const debug = require('@tryghost/debug')('checker');

const errors = require('@tryghost/errors');
const versions = require('./utils').versions;

// An object containing helpers as keys and their labs flag as values
// E.g. match:  'matchHelper'
const labsEnabledHelpers = {
};

/**
 * Check theme
 *
 * Takes a theme path, reads the theme, and checks it for issues.
 * Returns a theme object.
 * @param {string} themePath
 * @param {Object} options
 * @param {string} [options.checkVersion] version to check the theme against
 * @param {string} [options.themeName] name of the checked theme
 * @param {Object=} [options.labs] object containing boolean flags for enabled labs features
 * @param {boolean} [options.skipChecks] flag to allow reading theme without incurring check costs
 * @returns {Promise<Object>}
 */
const check = async function checkAll(themePath, options = {}) {
    // Require checks late to avoid loading all until used
    const checks = options.skipChecks === true ? [] : requireDir('./checks');
    const passedVersion = _.get(options, 'checkVersion', versions.default);
    let version = passedVersion;

    if (passedVersion === 'canary') {
        version = versions.canary;
        options.checkVersion = versions.canary;
    }

    _.each(labsEnabledHelpers, (flag, helper) => {
        if (_.has(options.labs, flag)) {
            const spec = require('./specs').get([version]);
            if (!spec.knownHelpers.includes(helper)) {
                spec.knownHelpers.push(helper);
            }
        }
    });

    // Require readTheme late to avoid loading entire AST parser until used
    const readTheme = require('./read-theme');

    try {
        const theme = await readTheme(themePath);

        // set the major version to check
        theme.checkedVersion = versions[version].major;

        const timeBeforeChecks = Date.now();

        for (const checkName in checks) {
            const now = Date.now();
            await checks[checkName](theme, options, themePath);
            debug(checkName, 'took', Date.now() - now, 'ms');
        }

        debug('All checks took', Date.now() - timeBeforeChecks, 'ms');

        return theme;
    } catch (err) {
        throw new errors.ValidationError({
            message: 'Failed theme files check',
            help: 'Your theme file structure is corrupted or contains errors',
            errorDetails: err.message,
            context: options.themeName,
            err
        });
    }
};

const checkZip = async function checkZip(path, options) {
    options = Object.assign({}, {
        keepExtractedDir: false
    }, options);

    let zip;

    if (_.isString(path)) {
        zip = {
            path,
            name: path.match(/(.*\/)?(.*).zip$/)[2]
        };
    } else {
        zip = _.clone(path);
    }

    try {
        const readZip = require('./read-zip');
        const {path: extractedZipPath} = await readZip(zip);
        const theme = await check(extractedZipPath, Object.assign({themeName: zip.name}, options));

        if (options.keepExtractedDir) {
            return theme;
        } else {
            const fs = require('fs-extra');
            await fs.remove(zip.origPath);
            return theme;
        }
    } catch (error) {
        if (!errors.utils.isGhostError(error)) {
            throw new errors.ValidationError({
                message: 'Failed to check zip file',
                help: 'Your zip file might be corrupted, try unzipping and zipping again.',
                errorDetails: error.message,
                context: zip.name,
                err: error
            });
        }

        throw error;
    }
};

module.exports = {
    check,
    checkZip
};
