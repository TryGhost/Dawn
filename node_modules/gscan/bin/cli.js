#!/usr/bin/env node

// Remove all Node warnings before doing anything else
process.removeAllListeners('warning');

const prettyCLI = require('@tryghost/pretty-cli');
const ui = require('@tryghost/pretty-cli').ui;
const _ = require('lodash');
const chalk = require('chalk');
const gscan = require('../lib');
const ghostVersions = require('../lib/utils').versions;

const levels = {
    error: chalk.red,
    warning: chalk.yellow,
    recommendation: chalk.yellow,
    feature: chalk.green
};

const cliOptions = {
    format: 'cli'
};

prettyCLI
    .configure({
        name: 'gscan'
    })
    .groupOrder([
        'Sources:',
        'Utilities:',
        'Commands:',
        'Arguments:',
        'Required Options:',
        'Options:',
        'Global Options:'
    ])
    .positional('<themePath>', {
        paramsDesc: 'Theme folder or .zip file path',
        mustExist: true
    })
    .boolean('-z, --zip', {
        desc: 'Theme path points to a zip file'
    })
    .boolean('-1, --v1', {
        desc: 'Check theme for Ghost 1.0 compatibility'
    })
    .boolean('-2, --v2', {
        desc: 'Check theme for Ghost 2.0 compatibility'
    })
    .boolean('-3, --v3', {
        desc: 'Check theme for Ghost 3.0 compatibility'
    })
    .boolean('-4, --v4', {
        desc: 'Check theme for Ghost 4.0 compatibility'
    })
    .boolean('-5, --v5', {
        desc: 'Check theme for Ghost 5.0 compatibility'
    })
    .boolean('-6, --v6', {
        desc: 'Check theme for Ghost 6.0 compatibility'
    })
    .boolean('-c, --canary', {
        desc: 'Check theme for Ghost 6.0 compatibility (alias for --v6)'
    })
    .boolean('-f, --fatal', {
        desc: 'Only show fatal errors that prevent upgrading Ghost'
    })
    .boolean('--verbose', {
        desc: 'Output check details'
    })
    .array('--labs', {
        desc: 'a list of labs flags'
    })
    .parseAndExit()
    .then((argv) => {
        if (argv.v1) {
            cliOptions.checkVersion = 'v1';
        } else if (argv.v2) {
            cliOptions.checkVersion = 'v2';
        } else if (argv.v3) {
            cliOptions.checkVersion = 'v3';
        } else if (argv.v4) {
            cliOptions.checkVersion = 'v4';
        } else if (argv.v5) {
            cliOptions.checkVersion = 'v5';
        } else if (argv.v6) {
            cliOptions.checkVersion = 'v6';
        } else if (argv.canary) {
            cliOptions.checkVersion = ghostVersions.canary;
        } else {
            cliOptions.checkVersion = ghostVersions.default;
        }

        cliOptions.verbose = argv.verbose;
        cliOptions.onlyFatalErrors = argv.fatal;

        if (argv.labs) {
            cliOptions.labs = {};

            argv.labs.forEach((flag) => {
                cliOptions.labs[flag] = true;
            });
        }

        if (cliOptions.onlyFatalErrors) {
            ui.log(chalk.bold('\nChecking theme compatibility (fatal issues only)...'));
        } else {
            ui.log(chalk.bold('\nChecking theme compatibility...'));
        }

        if (argv.zip) {
            gscan.checkZip(argv.themePath, cliOptions)
                .then(theme => outputResults(theme, cliOptions))
                .catch((error) => {
                    ui.log(error);
                });
        } else {
            gscan.check(argv.themePath, cliOptions)
                .then(theme => outputResults(theme, cliOptions))
                .catch((err) => {
                    ui.log(err.message);
                    if (err.code === 'ENOTDIR') {
                        ui.log('Did you mean to add the -z flag to read a zip file?');
                    }
                });
        }
    });

function outputResult(result, options) {
    ui.log(levels[result.level](`- ${_.capitalize(result.level)}:`), result.rule);

    if (options.verbose) {
        ui.log(`${chalk.bold('\nDetails:')} ${result.details}`);
    }

    if (result.failures && result.failures.length) {
        if (options.verbose) {
            ui.log(''); // extra line-break
            ui.log(`${chalk.bold('Affected Files:')}`);
            result.failures.forEach((failure) => {
                let message = failure.ref;

                if (failure.message) {
                    message += ` - ${failure.message}`;
                }
                ui.log(message);
            });
        } else {
            ui.log(`${chalk.bold('Affected Files:')} ${_.map(result.failures, 'ref')}`);
        }
    }

    ui.log(''); // extra line-break
}

function getSummary(theme, options) {
    let summaryText = '';
    const errorCount = theme.results.error.length;
    const warnCount = theme.results.warning.length;
    const pluralize = require('pluralize');
    const checkSymbol = '\u2713';

    if (errorCount === 0 && warnCount === 0) {
        if (options.onlyFatalErrors) {
            summaryText = `${chalk.green(checkSymbol)} Your theme has no fatal compatibility issues with Ghost ${theme.checkedVersion}`;
        } else {
            summaryText = `${chalk.green(checkSymbol)} Your theme is compatible with Ghost ${theme.checkedVersion}`;
        }
    } else {
        summaryText = `Your theme has`;

        if (!_.isEmpty(theme.results.error)) {
            summaryText += chalk.red.bold(` ${pluralize('error', theme.results.error.length, true)}`);
        }

        if (!_.isEmpty(theme.results.error) && !_.isEmpty(theme.results.warning)) {
            summaryText += ' and';
        }

        if (!_.isEmpty(theme.results.warning)) {
            summaryText += chalk.yellow.bold(` ${pluralize('warning', theme.results.warning.length, true)}`);
        }

        summaryText += '!';

        // NOTE: had to subtract the number of 'invisible' formating symbols
        //       needs update if formatting above changes
        const hiddenSymbols = 38;
        summaryText += '\n' + _.repeat('-', (summaryText.length - hiddenSymbols));
    }

    return summaryText;
}

function outputResults(theme, options) {
    try {
        theme = gscan.format(theme, options);
    } catch (err) {
        ui.log.error('Error formating result, some results may be missing.');
        ui.log.error(err);
    }

    let errorCount = theme.results.error.length;

    ui.log('\n' + getSummary(theme, options));

    if (!_.isEmpty(theme.results.error)) {
        ui.log(chalk.red.bold('\nErrors'));
        ui.log(chalk.red.bold('------'));
        ui.log(chalk.red('Important to fix, functionality may be degraded.\n'));

        _.each(theme.results.error, rule => outputResult(rule, options));
    }

    if (!_.isEmpty(theme.results.warning)) {
        ui.log(chalk.yellow.bold('\nWarnings'));
        ui.log(chalk.yellow.bold('--------'));

        _.each(theme.results.warning, rule => outputResult(rule, options));
    }

    if (!_.isEmpty(theme.results.recommendation)) {
        ui.log(chalk.yellow.bold('\nRecommendations'));
        ui.log(chalk.yellow.bold('---------------'));

        _.each(theme.results.recommendation, rule => outputResult(rule, options));
    }

    ui.log(`\nGet more help at ${chalk.cyan.underline('https://ghost.org/docs/themes/')}`);
    ui.log(`You can also check theme compatibility at ${chalk.cyan.underline('https://gscan.ghost.org/')}`);

    // The CLI feature is mainly used to run gscan programatically in tests within themes.
    // Exiting with error code for warnings, causes the test to fail, even tho a theme
    // upload via Ghost Admin would be possible without showing errors/warning.
    // See also here: https://github.com/TryGhost/Blog/pull/41#issuecomment-484525754
    // TODO: make failing for warnings configurable by e. g. passing an option, so we can
    // disable it for the usage with tests
    if (errorCount > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}
