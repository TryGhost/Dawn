const _ = require('lodash');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const previousSpec = require('./v4');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://ghost.org/docs/themes/`;
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v5.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = _.cloneDeep(previousSpec.rules);

const multiAuthorDesc = `Ghost allows multiple authors to be assigned to a post, so all helpers have been reworked to account for this.`;
const authorHelperDocs = `Find more information about the <code>{{authors}}</code> helper <a href="${docsBaseUrl}helpers/authors/" target=_blank>here</a>`;
const tierDesc = `Ghost now supports multiple tiers and subscriptions. All product and price related helpers have been reworked to account for this.`;

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = ['total_members', 'total_paid_members', 'comment_count', 'comments', 'recommendations', 'readable_url', 'content_api_url', 'content_api_key', 'social_url'];
let templates = [];
let rules = {
    // New rules
    'GS010-PJ-GHOST-API-PRESENT': {
        level: 'warning',
        rule: 'Remove <code>"engines.ghost-api"</code> from <code>package.json</code>',
        details: oneLineTrim`The <code>"ghost-api"</code> version is no longer used and can be removed.<br>
        Find more information about the <code>package.json</code> file <a href="${docsBaseUrl}structure/#packagejson" target=_blank>here</a>.`
    },
    'GS010-PJ-GHOST-CARD-ASSETS-NOT-PRESENT': {
        level: 'warning',
        rule: '<code>"card_assets"</code> will now be included by default, including bookmark and gallery cards.',
        details: oneLineTrim`The <code>"card_assets"</code> property is enabled by default and set to <code>true</code> (include all) if not explicitly set.<br>
        Find more information about the <code>card_assets</code> property <a href="${docsBaseUrl}content/#editor-cards" target=_blank>here</a>.`
    },
    'GS090-NO-AUTHOR-HELPER-IN-POST-CONTEXT': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author}}</code> with <code>{{authors}}</code>',
        details: oneLineTrim`The <code>{{author}}</code> helper was removed in favor of <code>{{<authors>}}</code><br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        helper: '{{author}}'
    },
    'GS090-NO-PRODUCTS-HELPER': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{products}}</code> with <code>{{tiers}}</code>',
        details: oneLineTrim`The <code>{{products}}</code> helper was removed in favor of <code>{{tiers}}</code><br>
        ${tierDesc}<br>
        Find more information about the <code>{{tiers}}</code> property <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{products}}'
    },
    'GS090-NO-PRODUCT-DATA-HELPER': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{@product}}</code> with <code>{{#get "tiers"}}</code>',
        details: oneLineTrim`The <code>{{@product}}</code> data helper was removed in favor of <code>{{#get "tiers"}}</code><br>
        ${tierDesc}<br>
        Find more information about the <code>{{#get "tiers"}}</code> property <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{@product}}'
    },
    'GS090-NO-PRODUCTS-DATA-HELPER': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{@products}}</code> with <code>{{#get "tiers"}}</code>',
        details: oneLineTrim`The <code>{{@products}}</code> data helper was removed in favor of <code>{{#get "tiers"}}</code><br>
        ${tierDesc}<br>
        Find more information about the <code>{{#get "tiers"}}</code> property <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{@products}}'
    },
    'GS090-NO-MEMBER-PRODUCTS-DATA-HELPER': {
        level: 'error',
        rule: 'Replace <code>{{@member.products}}</code> with <code>{{@member.subscriptions}}</code>',
        details: oneLineTrim`The <code>{{@member.products}}</code> helper was removed in favor of <code>{{@member.subscriptions}}</code><br>
        ${tierDesc}<br>
        Find more information about the <code>{{@member.subscriptions}}</code> property <a href="${docsBaseUrl}members/#member-subscriptions" target=_blank>here</a>.`,
        helper: '{{@member.products}}'
    },
    'GS090-NO-PRICE-DATA-CURRENCY-GLOBAL': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{@price.currency}}</code> with <code>{{#get "tiers"}}</code> and <code>{{currency}}</code> or <code>{{#foreach @member.subscriptions}}</code> and <code>{{plan.currency}}</code>',
        details: oneLineTrim`There is no longer a global <code>@price</code> object. You need to use either <code>{{#get "tiers"}}</code> to fetch all tiers and use the <code>{{currency}}</code> property of a tier<br>
        or use <code>{{#foreach @member.subscriptions}}</code> to fetch an individual member's subscriptions, and use the <code>{{plan.currency}}</code> property from the subscription.<br>
        Find more information about the <code>{{price}}</code> helper <a href="${docsBaseUrl}helpers/price/" target=_blank>here</a>.`
    },
    'GS090-NO-PRICE-DATA-CURRENCY-CONTEXT': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{@price.currency}}</code> with <code>{{currency}}</code> or <code>{{plan.currency}}</code>',
        details: oneLineTrim`There is no longer a global <code>@price</code> object. Instead the <code>{{currency}}</code> property can be used inside <code>{{#get "tiers"}}</code><br>
        or <code>{{plan.currency}}</code> can be used inside <code>{{#foreach @member.subscriptions}}</code><br>
        Find more information about the <code>{{price}}</code> helper <a href="${docsBaseUrl}helpers/price/" target=_blank>here</a>.`
    },
    'GS090-NO-PRICE-DATA-MONTHLY-YEARLY': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{@price.monthly}}</code> and <code>{{@price.yearly}}</code> with <code>{{price monthly_price currency=currency}}</code> and <code>{{price yearly_price currency=currency}}</code> after fetching tier data with <code>{{#get "tiers"}}</code>',
        details: oneLineTrim`There is no longer a global <code>@price</code> object. You need to use <code>{{#get "tiers"}}</code> to fetch all the tiers and get access to the <code>{{price monthly_price currency=currency}}</code> or <code>{{price yearly_price currency=currency}}</code> for each tier<br>
        Find more information about the <code>{{price}}</code> helper <a href="${docsBaseUrl}helpers/price/" target=_blank>here</a>.`
    },
    'GS090-NO-TIER-PRICE-AS-OBJECT': {
        level: 'error',
        fatal: false,
        rule: 'Remove usage of <code>{{monthly_price.*}}</code> and <code>{{yearly_price.*}}.</code>',
        details: oneLineTrim`The usage of <code>{{monthly_price.*}}</code> and <code>{{yearly_price.*}} is no longer supported.</code><br>
        ${tierDesc}<br>
        Find more information about the <code>{{#get "tiers"}}</code> <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{#get "tiers"}}'
    },
    'GS090-NO-TIER-BENEFIT-AS-OBJECT': {
        level: 'error',
        fatal: true,
        rule: 'Remove usage of <code>{{name}}</code> for tier benefits.</code>',
        details: oneLineTrim`The usage of <code>{{name}}</code> for tier benefits is no longer supported.</code><br>
        ${tierDesc}<br>
        Find more information about the <code>{{#get "tiers"}}</code> <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{#get "tiers"}}'
    },

    'GS001-DEPR-AUTH-ID': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.id}}</code> with <code>{{primary_author.id}}</code> or <code>{{authors.[#].id}}</code>',
        details: oneLineTrim`The usage of <code>{{author.id}}</code> is no longer supported and should be replaced with either <code>{{primary_author.id}}</code>
        or <code>{{authors.[#].id}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.id\s*?}}/g,
        helper: '{{author.id}}'
    },
    'GS001-DEPR-AUTH-SLUG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.slug}}</code> with <code>{{primary_author.slug}}</code> or <code>{{authors.[#].slug}}</code>',
        details: oneLineTrim`The usage of <code>{{author.slug}}</code> is no longer supported and should be replaced with either <code>{{primary_author.slug}}</code>
        or <code>{{authors.[#].slug}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.slug\s*?}}/g,
        helper: '{{author.slug}}'
    },
    'GS001-DEPR-AUTH-MAIL': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.email}}</code> with <code>{{primary_author.email}}</code> or <code>{{authors.[#].email}}</code>',
        details: oneLineTrim`The usage of <code>{{author.email}}</code> is no longer supported and should be replaced with either <code>{{primary_author.email}}</code>
        or <code>{{authors.[#].email}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.email\s*?}}/g,
        helper: '{{author.email}}'
    },
    'GS001-DEPR-AUTH-MT': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.meta_title}}</code> with <code>{{primary_author.meta_title}}</code> or <code>{{authors.[#].meta_title}}</code>',
        details: oneLineTrim`The usage of <code>{{author.meta_title}}</code> is no longer supported and should be replaced with either <code>{{primary_author.meta_title}}</code>
        or <code>{{authors.[#].meta_title}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.meta_title\s*?}}/g,
        helper: '{{author.meta_title}}'
    },
    'GS001-DEPR-AUTH-MD': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.meta_description}}</code> with <code>{{primary_author.meta_description}}</code> or <code>{{authors.[#].meta_description}}</code>',
        details: oneLineTrim`The usage of <code>{{author.meta_description}}</code> is no longer supported and should be replaced with either <code>{{primary_author.meta_description}}</code>
        or <code>{{authors.[#].meta_description}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.meta_description\s*?}}/g,
        helper: '{{author.meta_description}}'
    },
    'GS001-DEPR-AUTH-NAME': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.name}}</code> with <code>{{primary_author.name}}</code> or <code>{{authors.[#].name}}</code>',
        details: oneLineTrim`The usage of <code>{{author.name}}</code> is no longer supported and should be replaced with either <code>{{primary_author.name}}</code>
        or <code>{{authors.[#].name}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.name\s*?}}/g,
        helper: '{{author.name}}'
    },
    'GS001-DEPR-AUTH-BIO': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.bio}}</code> with <code>{{primary_author.bio}}</code> or <code>{{authors.[#].bio}}</code>',
        details: oneLineTrim`The usage of <code>{{author.bio}}</code> is no longer supported and should be replaced with either <code>{{primary_author.bio}}</code>
        or <code>{{authors.[#].bio}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.bio\s*?}}/g,
        helper: '{{author.bio}}'
    },
    'GS001-DEPR-AUTH-LOC': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.location}}</code> with <code>{{primary_author.location}}</code> or <code>{{authors.[#].location}}</code>',
        details: oneLineTrim`The usage of <code>{{author.location}}</code> is no longer supported and should be replaced with either <code>{{primary_author.location}}</code>
        or <code>{{authors.[#].location}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.location\s*?}}/g,
        helper: '{{author.location}}'
    },
    'GS001-DEPR-AUTH-WEB': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.website}}</code> with <code>{{primary_author.website}}</code> or <code>{{authors.[#].website}}</code>',
        details: oneLineTrim`The usage of <code>{{author.website}}</code> is no longer supported and should be replaced with either <code>{{primary_author.website}}</code>
        or <code>{{authors.[#].website}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.website\s*?}}/g,
        helper: '{{author.website}}'
    },
    'GS001-DEPR-AUTH-TW': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.twitter}}</code> with <code>{{primary_author.twitter}}</code> or <code>{{authors.[#].twitter}}</code>',
        details: oneLineTrim`The usage of <code>{{author.twitter}}</code> is no longer supported and should be replaced with either <code>{{primary_author.twitter}}</code>
        or <code>{{authors.[#].twitter}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.twitter\s*?}}/g,
        helper: '{{author.twitter}}'
    },
    'GS001-DEPR-AUTH-FB': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.facebook}}</code> with <code>{{primary_author.facebook}}</code> or <code>{{authors.[#].facebook}}</code>',
        details: oneLineTrim`The usage of <code>{{author.facebook}}</code> is no longer supported and should be replaced with either <code>{{primary_author.facebook}}</code>
        or <code>{{authors.[#].facebook}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.facebook\s*?}}/g,
        helper: '{{author.facebook}}'
    },
    'GS001-DEPR-AUTH-PIMG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.profile_image}}</code> with <code>{{primary_author.profile_image}}</code> or <code>{{authors.[#].profile_image}}</code>',
        details: oneLineTrim`The usage of <code>{{author.profile_image}}</code> is no longer supported and should be replaced with either <code>{{primary_author.profile_image}}</code>
        or <code>{{authors.[#].profile_image}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.profile_image\s*?}}/g,
        helper: '{{author.profile_image}}'
    },
    'GS001-DEPR-AUTH-CIMG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.cover_image}}</code> with <code>{{primary_author.cover_image}}</code> or <code>{{authors.[#].cover_image}}</code>',
        details: oneLineTrim`The usage of <code>{{author.cover_image}}</code> is no longer supported and should be replaced with either <code>{{primary_author.cover_image}}</code>
        or <code>{{authors.[#].cover_image}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.cover_image\s*?}}/g,
        helper: '{{author.cover_image}}'
    },
    'GS001-DEPR-AUTH-URL': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.url}}</code> with <code>{{primary_author.url}}</code> or <code>{{authors.[#].url}}</code>',
        details: oneLineTrim`The usage of <code>{{author.url}}</code> is no longer supported and should be replaced with either <code>{{primary_author.url}}</code>
        or <code>{{authors.[#].url}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?author\.url\s*?}}/g,
        helper: '{{author.url}}'
    },
    'GS001-DEPR-PAUTH': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author}}</code> with <code>{{post.primary_author}}</code> or <code>{{authors.[#]}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author}}</code>
        or <code>{{post.authors.[#]}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\s*?}}/g,
        helper: '{{post.author}}'
    },
    'GS001-DEPR-PAUTH-ID': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.id}}</code> with <code>{{post.primary_author.id}}</code> or <code>{{authors.[#].id}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.id}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.id}}</code>
        or <code>{{post.authors.[#].id}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.id\s*?}}/g,
        helper: '{{post.author.id}}'
    },
    'GS001-DEPR-PAUTH-SLUG': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.slug}}</code> with <code>{{post.primary_author.slug}}</code> or <code>{{post.authors.[#].slug}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.slug}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.slug}}</code>
        or <code>{{post.authors.[#].slug}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.slug\s*?}}/g,
        helper: '{{post.author.slug}}'
    },
    'GS001-DEPR-PAUTH-MAIL': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.email}}</code> with <code>{{post.primary_author.email}}</code> or <code>{{post.authors.[#].email}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.email}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.email}}</code>
        or <code>{{post.authors.[#].email}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.email\s*?}}/g,
        helper: '{{post.author.email}}'
    },
    'GS001-DEPR-PAUTH-MT': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.meta_title}}</code> with <code>{{post.primary_author.meta_title}}</code> or <code>{{post.authors.[#].meta_title}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.meta_title}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.meta_title}}</code>
        or <code>{{post.authors.[#].meta_title}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.meta_title\s*?}}/g,
        helper: '{{post.author.meta_title}}'
    },
    'GS001-DEPR-PAUTH-MD': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.meta_description}}</code> with <code>{{post.primary_author.meta_description}}</code> or <code>{{post.authors.[#].meta_description}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.meta_description}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.meta_description}}</code>
        or <code>{{post.authors.[#].meta_description}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.meta_description\s*?}}/g,
        helper: '{{post.author.meta_description}}'
    },
    'GS001-DEPR-PAUTH-NAME': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.name}}</code> with <code>{{post.primary_author.name}}</code> or <code>{{post.authors.[#].name}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.name}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.name}}</code>
        or <code>{{post.authors.[#].name}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.name\s*?}}/g,
        helper: '{{post.author.name}}'
    },
    'GS001-DEPR-PAUTH-BIO': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.bio}}</code> with <code>{{post.primary_author.bio}}</code> or <code>{{post.authors.[#].bio}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.bio}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.bio}}</code>
        or <code>{{post.authors.[#].bio}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.bio\s*?}}/g,
        helper: '{{post.author.bio}}'
    },
    'GS001-DEPR-PAUTH-LOC': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.location}}</code> with <code>{{post.primary_author.location}}</code> or <code>{{post.authors.[#].location}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.location}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.location}}</code>
        or <code>{{post.authors.[#].location}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.location\s*?}}/g,
        helper: '{{post.author.location}}'
    },
    'GS001-DEPR-PAUTH-WEB': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.website}}</code> with <code>{{post.primary_author.website}}</code> or <code>{{post.authors.[#].website}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.website}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.website}}</code>
        or <code>{{post.authors.[#].website}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.website\s*?}}/g,
        helper: '{{post.author.website}}'
    },
    'GS001-DEPR-PAUTH-TW': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.twitter}}</code> with <code>{{post.primary_author.twitter}}</code> or <code>{{post.authors.[#].twitter}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.twitter}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.twitter}}</code>
        or <code>{{post.authors.[#].twitter}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.twitter\s*?}}/g,
        helper: '{{post.author.twitter}}'
    },
    'GS001-DEPR-PAUTH-FB': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.facebook}}</code> with <code>{{post.primary_author.facebook}}</code> or <code>{{post.authors.[#].facebook}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.facebook}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.facebook}}</code>
        or <code>{{post.authors.[#].facebook}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.facebook\s*?}}/g,
        helper: '{{post.author.facebook}}'
    },
    'GS001-DEPR-PAUTH-PIMG': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.profile_image}}</code> with <code>{{post.primary_author.profile_image}}</code> or <code>{{post.authors.[#].profile_image}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.profile_image}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.profile_image}}</code>
        or <code>{{post.authors.[#].profile_image}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.profile_image\s*?}}/g,
        helper: '{{post.author.profile_image}}'
    },
    'GS001-DEPR-PAUTH-CIMG': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.cover_image}}</code> with <code>{{post.primary_author.cover_image}}</code> or <code>{{post.authors.[#].cover_image}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.cover_image}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.cover_image}}</code>
        or <code>{{post.authors.[#].cover_image}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.cover_image\s*?}}/g,
        helper: '{{post.author.cover_image}}'
    },
    'GS001-DEPR-PAUTH-URL': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author.url}}</code> with <code>{{post.primary_author.url}}</code> or <code>{{post.authors.[#].url}}</code>',
        details: oneLineTrim`The usage of <code>{{post.author.url}}</code> is no longer supported and should be replaced with either <code>{{post.primary_author.url}}</code>
        or <code>{{post.authors.[#].url}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?post\.author\.url\s*?}}/g,
        helper: '{{post.author.url}}'
    },
    'GS001-DEPR-PAID': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{post.author_id}}</code> code with <code>{{post.primary_author.id}}</code>',
        details: oneLineTrim`The <code>{{post.author_id}}</code> attribute in post context was removed<br>
        Instead of <code>{{post.author_id}}</code> you need to use <code>{{post.primary_author.id}}</code>.<br>
        Find more information about the object attributes of <code>post</code> <a href="${docsBaseUrl}contexts/post/#post-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?post\.author_id\s*?}}/g,
        helper: '{{post.author_id}}'
    },
    'GS001-DEPR-NAUTH': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>../author</code> with <code>../primary_author</code> or <code>../authors.[#]</code>',
        details: oneLineTrim`The usage of <code>../author</code> is no longer supported and should be replaced with either <code>../primary_author</code>
        or <code>../authors.[#]</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?(?:#|#if)?\s*?\.\.\/author(?:\.\S*?)?\s*?}}/g,
        helper: '{{../author}}'
    },
    'GS001-DEPR-IUA': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{img_url author.*}}</code> with <code>{{img_url primary_author.*}}</code> or <code>.{img_url author.[#].*}}</code>',
        details: oneLineTrim`The usage of <code>{{img_url author.*}}</code> is no longer supported and should be replaced with either <code>{{img_url primary_author.*}}</code>
        or <code>{{img_url author.[#].*}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?img_url\s*?(author.).*}}/g,
        helper: '{{img_url author.*}}'
    },
    'GS001-DEPR-AC': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.cover}}</code> with <code>{{primary_author.cover_image}}</code>',
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{author.cover}}</code> you need to use
        <code>{{primary_author.cover_image}}</code> or <code>{{authors.[#].cover_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?author\.cover\s*?}}/g,
        helper: '{{author.cover}}'
    },
    'GS001-DEPR-AIMG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{author.image}}</code> with <code>{{primary_author.profile_image}}</code> or <code>{{authors.[#].profile_image}}</code>',
        details: oneLineTrim`The <code>image</code> attribute was replaced with <code>profile_image</code>.<br>
        Instead of <code>{{author.image}}</code>, you need to use
        <code>{{primary_author.profile_image}}</code> or <code>{{authors.[#].profile_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?author\.image\s*?}}/g,
        helper: '{{author.image}}'
    },
    'GS001-DEPR-PAC': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{post.author.cover}}</code> with <code>{{post.primary_author.cover_image}}</code> or <code>{{post.authors.[#].cover_image}}</code>',
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{post.author.cover}}</code>, you need to use
        <code>{{post.primary_author.cover_image}}</code> or <code>{{post.authors.[#].cover_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?post\.author\.cover\s*?}}/g,
        helper: '{{post.author.cover}}'
    },
    'GS001-DEPR-AUTH-INCL': {
        level: 'error',
        fatal: false,
        rule: `Replace <code>include="author"</code> with <code>include="authors"</code>`,
        details: oneLineTrim`The usage of <code>{{#get "posts" include="author"}}</code> is no longer supported and should be replaced with <code>{{#get "posts" include="authors"}}</code>.<br>
        Find more information about the <code>{{get}}</code> helper <a href="${docsBaseUrl}helpers/get/" target=_blank>here</a>.`,
        // This regex seems only to work properly with the escaped characters. Removing them resulted
        // in not detecting the wrong usage.
        regex: /{{\s*?#get.+include=("|')\s*?([\w\[\]]+,{1}\s*?)*?(\s*?author\s*?)(\s*,{1}\s?[\w\[\]]+)*?\s*?("|')(.*)}}/g, // eslint-disable-line no-useless-escape
        helper: 'include="author"'
    },
    'GS001-DEPR-AUTH-FIELD': {
        level: 'error',
        fatal: false,
        rule: `<code>fields="author"</code> should be replaced with <code>fields="authors"</code>`,
        details: oneLineTrim`The usage of <code>{{#get "posts" fields="author"}}</code> is no longer supported and should be replaced with
        <code>{{#get "posts" fields="primary_author"}}</code> or <code>{{#get "posts" fields="authors.[#]"}}</code>.<br>
        Find more information about the <code>{{get}}</code> helper <a href="${docsBaseUrl}helpers/get/" target=_blank>here</a>.`,
        // This regex seems only to work properly with the escaped characters. Removing them resulted
        // in not detecting the wrong usage.
        regex: /{{\s*?#get.+fields=("|')\s*?([\w\[\]]+,{1}\s*?)*?(\s*?author\s*?)(\s*,{1}\s?[\w\[\]]+)*?\s*?("|')(.*)}}/g, // eslint-disable-line no-useless-escape
        helper: 'fields="author"'
    },
    'GS001-DEPR-AUTH-FILT': {
        level: 'error',
        fatal: false,
        rule: `<code>filter="author:[...]"</code> should be replaced with <code>filter="authors:[...]"</code>`,
        details: oneLineTrim`The usage of <code>{{#get "posts" filter="author:[...]"}}</code> is no longer supported and should be replaced with <code>{{#get "posts" filter="authors:[...]"}}</code>.<br>
        Find more information about the <code>{{get}}</code> helper <a href="${docsBaseUrl}helpers/get/" target=_blank>here</a>.`,
        // This regex seems only to work properly with the escaped characters. Removing them resulted
        // in not detecting the wrong usage.
        regex: /{{\s*?#get.+filter=("|')\s*?([\w\[\]]+,{1}\s*?)*?(\s*?author:).*("|')(.*)}}/g, // eslint-disable-line no-useless-escape
        helper: 'filter="author:[...]"'
    },
    'GS001-DEPR-AUTHBL': {
        level: 'error',
        fatal: false,
        rule: 'The <code>{{#author}}</code> block helper should be replaced with <code>{{#primary_author}}</code> or <code>{{#foreach authors}}...{{/foreach}}</code>',
        details: oneLineTrim`The usage of <code>{{#author}}</code> block helper outside of <code>author.hbs</code> is no longer supported and
        should be replaced with <code>{{#primary_author}}</code> or <code>{{#foreach authors}}...{{/foreach}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?#author\s*?}}/g,
        notValidIn: 'author.hbs',
        helper: '{{#author}}'
    },
    'GS001-DEPR-PAIMG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{post.author.image}}</code> with <code>{{post.primary_author.profile_image}}</code> or <code>{{post.authors.[#].profile_image}}</code>',
        details: oneLineTrim`The <code>image</code> attribute was replaced with <code>profile_image</code>.<br>
        Instead of <code>{{post.author.image}}</code>, you need to use
        <code>{{post.primary_author.profile_image}}</code> or <code>{{post.authors.[#].profile_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?post\.author\.image\s*?}}/g,
        helper: '{{post.author.image}}'
    },
    'GS001-DEPR-CON-AUTH': {
        level: 'error',
        fatal: false,
        rule: `The <code>{{#if author.*}}</code> block helper should be replaced with <code>{{#if primary_author.*}}</code>
        or <code>{{#if authors.[#].*}}</code>`,
        details: oneLineTrim`The usage of <code>{{#if author.*}}</code> is no longer supported and should be replaced with <code>{{#if primary_author.*}}</code>
        or <code>{{#if authors.[#].*}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?#if\s*?(author)(?:\.\w+)*?\s*?}}/g,
        helper: '{{#if author.*}}'
    },
    'GS001-DEPR-CON-PAUTH': {
        level: 'error',
        fatal: false,
        rule: `The <code>{{#if post.author.*}}</code> block helper should be replaced with <code>{{#if post.primary_author.*}}</code>
        or <code>{{#if post.authors.[#].*}}</code>`,
        details: oneLineTrim`The usage of <code>{{#if post.author.*}}</code> is no longer supported and should be replaced with <code>{{#if post.primary_author.*}}</code>
        or <code>{{#if post.authors.[#].*}}</code>.<br>
        ${multiAuthorDesc}<br>
        ${authorHelperDocs}`,
        regex: /{{\s*?#if\s*?(?:post\.)(author)(?:\.\w+)*?\s*?}}/g,
        helper: '{{#if post.author.*}}'
    },
    'GS001-DEPR-CON-AC': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{#if author.cover}}</code> with <code>{{#if primary_author.cover_image}}</code> or <code>{{#if authors.[#].cover_image}}</code>',
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{#if author.cover}}</code>, you need to use
        <code>{{#if primary_author.cover_image}}</code> or <code>{{#if authors.[#].cover_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?author\.cover\s*?}}/g,
        helper: '{{#if author.cover}}'
    },
    'GS001-DEPR-CON-AIMG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{#if author.image}}</code> with <code>{{#if primary_author.profile_image}}</code> or <code>{{#if authors.[#].profile_image}}</code>',
        details: oneLineTrim`The <code>image</code> attribute was replaced with <code>profile_image</code>.<br>
        Instead of <code>{{#if author.image}}</code>, you need to use
        <code>{{#if primary_author.profile_image}}</code> or <code>{{#if authors.[#].profile_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?author\.image\s*?}}/g,
        helper: '{{#if author.image}}'
    },
    'GS001-DEPR-CON-PAC': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{#if post.author.cover}}</code> with <code>{{#if post.primary_author.cover_image}}</code> or <code>{{#if post.authors.[#].cover_image}}</code>',
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{#if post.author.cover}}</code>, you need to use
        <code>{{#if post.primary_author.cover_image}}</code> or <code>{{#if post.authors.[#].cover_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?post\.author\.cover\s*?}}/g,
        helper: '{{#if post.author.cover}}'
    },
    'GS001-DEPR-CON-PAIMG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{#if post.author.image}}</code> with <code>{{#if post.primary_author.profile_image}}</code> or <code>{{#if post.authors.[#].profile_image}}</code>',
        details: oneLineTrim`The <code>image</code> attribute was replaced with <code>profile_image</code>.<br>
        Instead of <code>{{#if post.author.image}}</code>, you need to use
        <code>{{#if post.primary_author.profile_image}}</code> or <code>{{#if post.authors.[#].profile_image}}</code>.<br>
        Find more information about the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?post\.author\.image\s*?}}/g,
        helper: '{{#if post.author.image}}'
    },
    'GS001-DEPR-LABS-MEMBERS': {
        level: 'error',
        rule: 'Replace <code>{{@labs.members}}</code> with <code>{{@site.members_enabled}}</code>',
        details: oneLineTrim`Usage of <code>{{@labs.members}}</code> is no longer supported and should be replaced with <code>{{@site.members_enabled}}</code><br>
        Find more information about the <code>@site</code> property <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /@labs\.members/g,
        helper: '{{@labs.members}}'
    },
    'GS001-DEPR-SPL': {
        level: 'error',
        fatal: true,
        rule: 'Remove uses of <code>{{@site.permalinks}}</code>',
        details: oneLineTrim`With the introduction of Dynamic Routing, you can define multiple permalinks.<br>
        The <code>{{@site.permalinks}}</code> property will therefore no longer be used and should be removed from the theme.
        Find more information about the <code>@site</code> property <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /{{\s*?@site\.permalinks\s*?}}/g,
        helper: '{{@site.permalinks}}'
    },
    'GS001-DEPR-BPL': {
        level: 'error',
        fatal: true,
        rule: 'Remove uses of <code>{{@blog.permalinks}}</code>',
        details: oneLineTrim`With the introduction of Dynamic Routing, you can define multiple permalinks.<br>
        The <code>{{@blog.permalinks}}</code> property will therefore no longer be used and should be removed from the theme.
        Find more information about Ghost data helpers <a href="${docsBaseUrl}/helpers/#data-helpers" target=_blank>here</a>.`,
        regex: /{{\s*?@blog\.permalinks\s*?}}/g,
        helper: '{{@blog.permalinks}}'
    },
    'GS001-DEPR-SGF': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{@site.ghost_foot}}</code> with <code>{{ghost_foot}}</code>',
        details: oneLineTrim`The usage of <code>{{@site.ghost_foot}}</code> is no longer supported and should be replaced with <code>{{ghost_foot}}</code>.<br>
        Find more information about the <code>{{ghost_foot}}</code> property <a href="${docsBaseUrl}helpers/ghost_head_foot/" target=_blank>here</a>.`,
        regex: /{{\s*?@site\.ghost_foot\s*?}}/g,
        helper: '{{@site.ghost_foot}}'
    },
    'GS001-DEPR-SGH': {
        level: 'error',
        fatal: true,
        rule: 'Replace <code>{{@site.ghost_head}}</code> with <code>{{ghost_head}}</code>',
        details: oneLineTrim`The usage of <code>{{@site.ghost_head}}</code> is no longer supported and should be replaced with <code>{{ghost_head}}</code>.<br>
        Find more information about the <code>{{ghost_head}}</code> property <a href="${docsBaseUrl}helpers/ghost_head_foot/" target=_blank>here</a>.`,
        regex: /{{\s*?@site\.ghost_head\s*?}}/g,
        helper: '{{@site.ghost_head}}'
    },
    'GS001-DEPR-LANG': {
        level: 'error',
        rule: 'Replace <code>{{lang}}</code> with <code>{{@site.locale}}</code>',
        details: oneLineTrim`The usage of <code>{{lang}}</code> is no longer supported and should be replaced with <code>{{@site.locale}}</code>.<br>
        Find more information about the <code>@site.locale</code> property <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /{{\s*?lang\s*?}}/g,
        helper: '{{lang}}'
    },
    'GS001-DEPR-SITE-LANG': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{@site.lang}}</code> with <code>{{@site.locale}}</code>',
        details: oneLineTrim`The usage of <code>{{@site.lang}}</code> is no longer supported and shoud be replaced with <code>{{@site.locale}}</code>.<br>
        Find more information about the <code>@site.locale</code> property <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /@site\.lang/g,
        helper: '{{@site.lang}}'
    },
    'GS001-DEPR-USER-GET': {
        level: 'error',
        fatal: false,
        rule: `Replace <code>{{#get "users"}}</code> with <code>{{#get "authors"}}</code>`,
        details: oneLineTrim`The usage of <code>{{#get "users"}}</code> is no longer supported and should be replaced with <code>{{#get "authors"}}</code>.<br>
        Find more information about the <code>{{get}}</code> helper <a href="${docsBaseUrl}helpers/get/" target=_blank>here</a>.`,
        regex: /{{\s*?#get ("|')\s*users("|')\s*/g,
        helper: '{{#get "users"}}'
    },
    'GS001-DEPR-CURR-SYM': {
        level: 'error',
        fatal: false,
        rule: 'Replace <code>{{[#].currency_symbol}}</code> with <code>{{price currency=currency}}</code>.',
        details: oneLineTrim`The <code>currency_symbol</code> attribute is no longer supported in favour of passing the currency to updated <code>{{price}}</code> helper.<br>
        Find more information about the updated <code>{{price}}</code> helper <a href="${docsBaseUrl}helpers/price/" target=_blank>here</a>.`,
        helper: '{{[#].currency_symbol}}',
        regex: /currency_symbol/g
    },
    'GS010-PJ-CUST-THEME-SETTINGS-DESCRIPTION-LENGTH': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>config.custom</code> contains an entry with a <code>description</code> that is too long',
        details: oneLineTrim`<code>config.custom</code> entry <code>description</code> should be less than <code>100</code> characters so that it is displayed correctly.<br />
        Check the <a href="${docsBaseUrl}custom-settings" target=_blank><code>config.custom</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-SYNTAX': {
        level: 'error',
        rule: '<code>package.json</code> property <code>config.custom</code> contains an entry with <code>visibility</code> that contains invalid syntax',
        details: oneLineTrim`<code>config.custom</code> entry <code>visibility</code> should be valid <code>nql</code>.<br />
        Check the <a href="${docsBaseUrl}custom-settings" target=_blank><code>config.custom</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-VISIBILITY-VALUE': {
        level: 'error',
        rule: '<code>package.json</code> property <code>config.custom</code> contains an entry with <code>visibility</code> that references a custom setting that does not exist',
        details: oneLineTrim`<code>config.custom</code> entry <code>visibility</code> should be only reference other custom settings.<br />
        Check the <a href="${docsBaseUrl}custom-settings" target=_blank><code>config.custom</code> documentation</a> for further information.`
    },
    'GS110-NO-MISSING-PAGE-BUILDER-USAGE': {
        level: 'error',
        rule: 'Not all page features are being used',
        details: oneLineTrim`<b>This error only applies to pages created with the Beta editor.</b> Some page features used by Ghost via the <code>{{@page}}</code> global are not implemented in this theme.&nbsp;
        Find more information about the <code>{{@page}}</code> global <a href="${docsBaseUrl}helpers/page/" target=_blank>here</a>.`
    },
    'GS110-NO-UNKNOWN-PAGE-BUILDER-USAGE': {
        level: 'error',
        fatal: true,
        rule: 'Unsupported page builder feature used',
        details: oneLineTrim`A page feature used via the <code>{{@page}}</code> global was detected but is not supported by this version of Ghost. Please upgrade to the latest version for full access.&nbsp;
        You can find more information about the <code>{{@page}}</code> global <a href="${docsBaseUrl}helpers/page/" target=_blank>here</a>.`
    },
    'GS120-NO-UNKNOWN-GLOBALS': {
        level: 'error',
        rule: 'No unknown global helper used',
        details: oneLineTrim`A global helper was detected that is not supported by this version of Ghost. Check the
        <a href="${docsBaseUrl}helpers/" target=_blank>helpers documentation</a> for further information.`
    },
    'GS080-NO-EMPTY-TRANSLATIONS': {
        level: 'error',
        fatal: false,
        rule: 'Add a string to translate to the <code>{{t}}</code> helper',
        regex: /{{\s*t\s*(["'“”]?)\s*\1?\s*}}/g,
        details: oneLineTrim`Translate helper <code>{{t}}</code> expects a string. Example: <code>{{ t "Hello world" }}</code>. Find more information about the translate helper <a href="${docsBaseUrl}helpers/translate" target=_blank>here</a>.`
    },
    'GS051-CUSTOM-FONTS': {
        level: 'warning',
        rule: `Missing support for custom fonts`,
        details: oneLineTrim`CSS variables for Ghost font settings are not present: <code>--gh-font-heading</code>, <code>--gh-font-body</code>`,
        regex: /^(?=[\s\S]*--gh-font-heading)(?=[\s\S]*--gh-font-body)/
    }
};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules, but overwrite any specified property,
// as well as adding any new rule to the spec.
// Furthermore, replace the usage of the old doc URLs that we're linking to, with the
// new version.
delete previousRules['GS010-PJ-GHOST-API-V01'];

rules = _.each(_.merge({}, previousRules, rules), function replaceDocsUrl(value) {
    value.details = value.details.replace(prevDocsBaseUrlRegEx, docsBaseUrl);
});

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules,
    /**
     * Copy of Ghost defaults for https://github.com/TryGhost/Ghost/blob/e25f1df0ae551c447da0d319bae06eadf9665444/core/frontend/services/theme-engine/config/defaults.json
     */
    defaultPackageJSON: {
        posts_per_page: 5,
        card_assets: true
    }
};
