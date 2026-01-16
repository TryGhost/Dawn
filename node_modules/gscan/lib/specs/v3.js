const _ = require('lodash');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const previousSpec = require('./v2');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://ghost.org/docs/themes/`;
// TODO: we don't use versioned docs anymore and the previous rules should only contain
// correct links. The usage of replacing the previousBaseUrl can probably be removed
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v2.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = ['cancel_link', 'price'];
let templates = [];
let rules = {
    // New rules
    'GS010-PJ-GHOST-API': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is recommended. Otherwise, it falls back to "v3"',
        details: oneLineTrim`Please add <code>"ghost-api"</code> to your <code>package.json</code>. E.g. <code>{"engines": {"ghost-api": "v3"}}</code>.<br>
        If no <code>"ghost-api"</code> property is provided, Ghost will use its default setting of "v3" Ghost API.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-GHOST-API-V01': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is incompatible with current version of Ghost API and will fall back to "v3"',
        details: oneLineTrim`Please change <code>"ghost-api"</code> in your <code>package.json</code> to higher version. E.g. <code>{"engines": {"ghost-api": "v3"}}</code>.<br>
        If <code>"ghost-api"</code> property is left at "v0.1", Ghost will use its default setting of "v3".<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS001-DEPR-ESC': {
        level: 'error',
        rule: 'Replace <code>{{error.code}}</code> with <code>{{error.statusCode}}</code>',
        details: oneLineTrim`The usage of <code>{{error.code}}</code> is deprecated and should be replaced with <code>{{error.statusCode}}</code>.<br>
        When in <code>error</code> context, e. g. in the <code>error.hbs</code> template, replace <code>{{code}}</code> with <code>{{statusCode}}</code>.<br>
        Find more information about the <code>error.hbs</code> template <a href="${docsBaseUrl}structure/#errorhbs" target=_blank>here</a>.`,
        regex: /{{\s*?(?:error\.)?(code)\s*?}}/g,
        helper: '{{error.code}}'
    },
    'GS060-JS-GUA': {
        level: 'error',
        rule: 'The v0.1 API and <code>ghost.url.api()</code> JavaScript helper have been removed.',
        details: oneLineTrim`The v0.1 API & Public API Beta have been removed, along with the <code>public/ghost-sdk.min.js</code> file & the <code>ghost.url.api()</code> helper.<br>
        All code relying on the v0.1 API must be upgraded to use the <a href="https://ghost.org/docs/changes/" target=_blank>new API</a>.`,
        regex: /ghost\.url\.api/g
    },
    'GS070-VALID-TRANSLATIONS': {
        level: 'error',
        rule: 'Theme translations must be parsable',
        fatal: false,
        details: oneLineTrim`Theme translations (located in <code>locales/*.json</code>) need to be readable by the node JSON parser, or they will not be applied.`
    }
};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules, but overwrite any specified property,
// as well as adding any new rule to the spec.
// Furthermore, replace the usage of the old doc URLs that we're linking to, with the
// new version.
rules = _.each(_.merge({}, previousRules, rules), function replaceDocsUrl(value) {
    value.details = value.details.replace(prevDocsBaseUrlRegEx, docsBaseUrl);
});

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules,
    defaultPackageJSON: previousSpec.defaultPackageJSON
};
