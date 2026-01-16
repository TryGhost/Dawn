const _ = require('lodash');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const previousSpec = require('./v5');
const docsBaseUrl = `https://docs.ghost.org/themes/`;

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = previousSpec.rules;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = ['split'];
let templates = [];
let rules = {
    'GS090-NO-LIMIT-ALL-IN-GET-HELPER': {
        level: 'warning',
        rule: 'Using <code>limit="all"</code> in <code>{{#get}}</code> helper is not supported',
        details: oneLineTrim`In Ghost 6.0 and later, <code>limit="all"</code> will return at most 100 results. Consider using a specific limit number or implementing pagination instead.<br>
        Find more information about the <code>{{#get}}</code> helper <a href="${docsBaseUrl}helpers/functional/get/" target=_blank>here</a>.`,
        helper: '{{#get}}'
    },
    'GS090-NO-LIMIT-OVER-100-IN-GET-HELPER': {
        level: 'warning',
        rule: 'Using <code>limit</code> values greater than 100 in <code>{{#get}}</code> helper is not supported',
        details: oneLineTrim`Ghost automatically caps <code>limit</code> values at 100, so using higher values will not return more results.
        Consider using pagination or setting the limit to 100 or lower.<br>
        Find more information about the <code>{{#get}}</code> helper <a href="${docsBaseUrl}helpers/functional/get/" target=_blank>here</a>.`,
        helper: '{{#get}}'
    },
    'GS001-DEPR-TWITTER-URL': {
        level: 'warning',
        rule: 'Replace <code>{{twitter_url}}</code> with <code>{{social_url type="twitter"}}</code>',
        details: oneLineTrim`The <code>{{twitter_url}}</code> helper is no longer supported and should be replaced with <code>{{social_url type="twitter"}}</code>.<br>
        Find more information about the <code>{{social_url}}</code> helper <a href="${docsBaseUrl}helpers/data/social_url/" target=_blank>here</a>.`,
        regex: /{{\s*?twitter_url(\s+[^}]*)?\s*?}}/g,
        helper: '{{twitter_url}}'
    },
    'GS001-DEPR-FACEBOOK-URL': {
        level: 'warning',
        rule: 'Replace <code>{{facebook_url}}</code> with <code>{{social_url type="facebook"}}</code>',
        details: oneLineTrim`The <code>{{facebook_url}}</code> helper is no longer supported and should be replaced with <code>{{social_url type="facebook"}}</code>.<br>
        Find more information about the <code>{{social_url}}</code> helper <a href="${docsBaseUrl}helpers/data/social_url/" target=_blank>here</a>.`,
        regex: /{{\s*?facebook_url(\s+[^}]*)?\s*?}}/g,
        helper: '{{facebook_url}}'
    },
    'GS001-DEPR-AMP-TEMPLATE': {
        level: 'warning',
        rule: 'AMP templates are no longer supported in Ghost 6.0',
        details: 'AMP support was removed in Ghost 6.0. Remove AMP templates and use responsive design instead.',
        // Matches <html amp> or <html ⚡>, with or without other attributes mixed in
        regex: /<html\s+(?:amp|⚡)(?:\s|>)|<html\s+[^>]*\s(?:amp|⚡)(?:\s|>)/i
    }
};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules
rules = _.merge({}, previousRules, rules);

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules,
    defaultPackageJSON: previousSpec.defaultPackageJSON
};
