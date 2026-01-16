// NOTE: this middleware was extracted from Ghost core validation for theme uploads
//       might be useful to unify this logic in the future if it's extracted to separate module
const path = require('path');
const errors = require('@tryghost/errors');

const checkFileExists = function checkFileExists(fileData) {
    return !!(fileData.mimetype && fileData.path);
};

const checkFileIsValid = function checkFileIsValid(fileData, types, extensions) {
    const type = fileData.mimetype;

    if (types.includes(type) && extensions.includes(fileData.ext)) {
        return true;
    }

    return false;
};

module.exports = function uploadValidation(req, res, next) {
    const extensions = ['.zip'];
    const contentTypes = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];

    req.file = req.file || {};
    req.file.name = req.file.originalname;
    req.file.type = req.file.mimetype;

    if (!checkFileExists(req.file)) {
        return next(new errors.ValidationError({
            message: `"Please select a zip file.`
        }));
    }

    req.file.ext = path.extname(req.file.name).toLowerCase();

    if (!checkFileIsValid(req.file, contentTypes, extensions)) {
        return next(new errors.UnsupportedMediaTypeError({
            message: 'Please select a valid zip file.'
        }));
    }

    next();
};
