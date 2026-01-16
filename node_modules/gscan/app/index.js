// Init Sentry middleware
require('./middlewares/sentry');
const sentry = require('@sentry/node');

// Require rest of the modules
const express = require('express');
const debug = require('@tryghost/debug')('app');
const hbs = require('express-hbs');
const multer = require('multer');
const server = require('@tryghost/server');
const config = require('@tryghost/config');
const errors = require('@tryghost/errors');
const gscan = require('../lib');
const fs = require('fs-extra');
const logRequest = require('./middlewares/log-request');
const uploadValidation = require('./middlewares/upload-validation');
const ghostVer = require('./ghost-version');
const pkgJson = require('../package.json');
const ghostVersions = require('../lib/utils').versions;
const upload = multer({dest: __dirname + '/uploads/'});
const app = express();
const scanHbs = hbs.create();

// Configure express
app.set('x-powered-by', false);
app.set('query parser', false);

app.engine('hbs', scanHbs.express4({
    partialsDir: __dirname + '/tpl/partials',
    layoutsDir: __dirname + '/tpl/layouts',
    defaultLayout: __dirname + '/tpl/layouts/default',
    templateOptions: {data: {version: pkgJson.version}}
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/tpl');

app.use(logRequest);
app.use(express.static(__dirname + '/public'));
app.use(ghostVer);

app.get('/', function (req, res) {
    res.render('index', {ghostVersions});
});

app.post('/',
    upload.single('theme'),
    uploadValidation,
    function (req, res, next) {
        const zip = {
            path: req.file.path,
            name: req.file.originalname
        };
        const options = {
            checkVersion: req.body.version || ghostVersions.default
        };

        debug('Uploaded: ' + zip.name + ' to ' + zip.path);
        debug('Version to check: ' + options.checkVersion);

        gscan.checkZip(zip, options)
            .then(function processResult(theme) {
                debug('Checked: ' + zip.name);
                res.theme = theme;

                debug('attempting to remove: ' + req.file.path);
                fs.remove(req.file.path)
                    .then(function () {
                        debug('Calling next');
                        return next();
                    })
                    .catch(function () {
                        // NOTE: transform to `.finally(...) once package is compatible with node >=10
                        debug('Calling next');
                        return next();
                    });
            }).catch(function (error) {
                debug('Calling next with error');
                return next(error);
            });
    },
    function doRender(req, res) {
        const options = {
            checkVersion: req.body.version || ghostVersions.default
        };
        debug('Formatting result');
        const result = gscan.format(res.theme, options);
        debug('Rendering result');
        scanHbs.handlebars.logger.level = 0;
        res.render('result', result);
    }
);

app.use(function (req, res, next) {
    next(new errors.NotFoundError({message: 'Page not found'}));
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    let template = 'error';
    req.err = err;

    let statusCode = err.statusCode || 500;
    res.status(statusCode);

    if (res.statusCode === 404) {
        template = 'error-404';
    }

    res.render(template, {message: err.message, stack: err.stack, details: err.errorDetails, context: err.context});
});

sentry.setupExpressErrorHandler(app);

server.start(app, config.get('port'));
