const _ = require('lodash');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const previousSpec = require('./v3');
const ghostVersions = require('../utils').versions;
const docsBaseUrl = `https://ghost.org/docs/themes/`;
// TODO: we don't use versioned docs anymore and the previous rules should only contain
// correct links. The usage of replacing the previousBaseUrl can probably be removed
const prevDocsBaseUrl = `https://themes.ghost.org/v${ghostVersions.v3.docs}/docs/`;
const prevDocsBaseUrlRegEx = new RegExp(prevDocsBaseUrl, 'g');

const previousKnownHelpers = previousSpec.knownHelpers;
const previousTemplates = previousSpec.templates;
const previousRules = _.cloneDeep(previousSpec.rules);

function cssCardRule(cardName, className) {
    return {
        level: 'warning',
        rule: `The <code>.${className}</code> CSS class is required to appear styled in your theme`,
        details: oneLineTrim`The <code>.${className}</code> CSS class is required otherwise the ${cardName} card will appear unstyled.
        Find out more about required theme changes for the Koenig editor <a href="${docsBaseUrl}content/" target=_blank>here</a>.`,
        regex: new RegExp(`\\.${className}`, 'g'),
        className: `.${className}`,
        css: true,
        cardAsset: cardName
    };
}

// assign new or overwrite existing knownHelpers, templates, or rules here:
let knownHelpers = ['match', 'tiers'];
let templates = [];
let rules = {
    // New rules
    'GS010-PJ-GHOST-API-PRESENT': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is deprecated.',
        details: oneLineTrim`Remove <code>"ghost-api"</code> from your <code>package.json</code>.<br>
        The <code>ghost-api</code> support will be removed in next major version of Ghost and should not be used.
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-GHOST-API-V01': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is incompatible with current version of Ghost API and will fall back to "v4"',
        details: oneLineTrim`Change <code>"ghost-api"</code> in your <code>package.json</code> to higher version. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If <code>"ghost-api"</code> property is left at "v0.1", Ghost will use its default setting of "v4".<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-GHOST-API-V2': {
        level: 'warning',
        rule: '<code>package.json</code> property <code>"engines.ghost-api"</code> is using a deprecated version of Ghost API',
        details: oneLineTrim`Change <code>"ghost-api"</code> in your <code>package.json</code> to higher version. E.g. <code>{"engines": {"ghost-api": "v4"}}</code>.<br>
        If <code>"ghost-api"</code> property is left at "v2", it will stop working with next major version upgrade and default to v5.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-TOTAL-SETTINGS': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"config.custom"</code> contains too many settings',
        details: oneLineTrim`Remove key from <code>"config.custom"</code> in your <code>package.json</code> to have less than or exactly 20 settings.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-CASE': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"config.custom"</code> contains a property that isn\'t snake-cased',
        details: oneLineTrim`Rewrite all property in <code>"config.custom"</code> in your <code>package.json</code> in snake case.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-TYPE': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> should have a known <code>"type"</code>.',
        details: oneLineTrim`Only use the following types: <code>"select"</code>, <code>"boolean"</code>, <code>"color"</code>, <code>"image"</code>, <code>"text"</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-GROUP': {
        level: 'recommendation',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> should have a known <code>"group"</code>.',
        details: oneLineTrim`Only use the following groups: <code>"post"</code>, <code>"homepage"</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-OPTIONS': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"select"</code> need to have at least 2 <code>"options"</code>.',
        details: oneLineTrim`Make sure there is at least 2 <code>"options"</code> in each <code>"select"</code> custom theme property.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-SELECT-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"select"</code> need to have a valid <code>"default"</code>.',
        details: oneLineTrim`Make sure the <code>"default"</code> property matches a value in <code>"options"</code> of the same <code>"select"</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-BOOLEAN-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"boolean"</code> need to have a valid <code>"default"</code>.',
        details: oneLineTrim`Make sure the <code>"default"</code> property is either <code>true</code> or <code>false</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-COLOR-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"color"</code> need to have a valid <code>"default"</code>.',
        details: oneLineTrim`Make sure the <code>"default"</code> property is a valid 6-hexadecimal-digit color code like <code>#15171a</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CUST-THEME-SETTINGS-IMAGE-DEFAULT': {
        level: 'error',
        rule: '<code>package.json</code> objects defined in <code>"config.custom"</code> of type <code>"image"</code> can\'t have a <code>"default"</code> value.',
        details: oneLineTrim`Make sure the <code>"default"</code> property is either <code>null</code>, an empty string <code>''</code> or isn't present.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS001-DEPR-LABS-MEMBERS': {
        level: 'warning',
        rule: 'The <code>{{@labs.members}}</code> helper should not be used.',
        details: oneLineTrim`Remove <code>{{@labs.members}}</code> from the theme.<br>
        The <code>{{@labs.members}}</code> helper will always return <code>true</code> in Ghost v4 and will be removed from Ghost v5, at which point it will return <code>null</code> and evaluate to <code>false</code>.
        Find more information about the <code>@labs</code> property <a href="${docsBaseUrl}helpers/labs/" target=_blank>here</a>.`,
        regex: /@labs\.members/g,
        helper: '{{@labs.members}}'
    },
    'GS080-FEACH-POSTS': {
        level: 'warning',
        rule: 'The default visibility for posts in <code>{{#foreach}}</code> block helper changed in Ghost v4.',
        details: oneLineTrim`The default visibility for posts in <code>{{#foreach}}</code> block helper changed from <code>public</code> to <code>all</code>.<br>
        Find more information about the <code>{{foreach}}</code> helper <a href="${docsBaseUrl}helpers/foreach/" target=_blank>here</a>.`,
        regex: /{{\s*?#foreach\s*?\w*?\s*?}}/g,
        helper: '{{#foreach}}',
        validInAPI: ['v3']
    },
    'GS080-CARD-LAST4': {
        level: 'warning',
        rule: 'The <code>default_payment_card_last4</code> field now coalesces to <code>****</code> in Ghost 4.x instead of null.',
        details: oneLineTrim`The <code>default_payment_card_last4</code> field no longer outputs a falsy(null) value in case of missing card details starting from Ghost 4.x and instead coalesces to <code>****</code>
        Find more information about the <code>default_payment_card_last4</code> attribute <a href="${docsBaseUrl}members/#subscription-attributes" target=_blank>here</a>.`,
        regex: /default_payment_card_last4/g,
        helper: '{{default_payment_card_last4}}',
        validInAPI: ['v3']
    },
    'GS080-FEACH-PV': {
        level: 'recommendation',
        rule: 'The use of <code>visibility="all"</code> is no longer required for posts in <code>{{#foreach}}</code> helper.',
        details: oneLineTrim`The default visibility in <code>{{#foreach}}</code> helper for posts changed in v4 from <code>public</code> to <code>all</code> and is no longer required when looping over posts.<br>
        Check out the documentation for <code>{{#foreach}}</code> <a href="${docsBaseUrl}helpers/foreach/" target=_blank>here</a>.`,
        regex: /{{\s*?#foreach\b[\w\s='"]*?visibility=("|')all("|')[\w\s='"]*?}}/g,
        helper: '{{#foreach}}',
        validInAPI: ['v3']
    },
    'GS001-DEPR-CURR-SYM': {
        level: 'warning',
        rule: 'Replace <code>{{[#].currency_symbol}}</code> with <code>{{price currency=currency}}</code>.',
        details: oneLineTrim`The hardcoded <code>currency_symbol</code> attribute was removed in favour of passing the currency to updated <code>{{price}}</code> helper.
        Find more information about the updated <code>{{price}}</code> helper <a href="${docsBaseUrl}members/#the-price-helper" target=_blank>here</a>.`,
        helper: '{{[#].currency_symbol}}',
        regex: /currency_symbol/g
    },
    'GS001-DEPR-SITE-LANG': {
        level: 'warning',
        rule: 'Replace <code>{{@site.lang}}</code> with <code>{{@site.locale}}</code>',
        details: oneLineTrim`Replace <code>{{@site.lang}}</code> helper with <code>{{@site.locale}}</code>.<br>
        The <code>{{@site.lang}}</code> helper will be removed in next version of Ghost and should not be used.
        Find more information about the <code>@site</code> property <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /@site\.lang/g,
        helper: '{{@site.lang}}'
    },
    'GS070-VALID-TRANSLATIONS': {
        level: 'error',
        rule: 'Theme translations must be parsable',
        fatal: true, // overwritten from v3 to be fatal
        details: oneLineTrim`Theme translations (located in <code>locales/*.json</code>) need to be readable by the node JSON parser, or they will not be applied.`
    },
    'GS090-NO-IMG-URL-IN-CONDITIONALS': {
        level: 'warning',
        rule: 'The {{img_url}} helper should not be used as a parameter to {{#if}} or {{#unless}}',
        fatal: false,
        details: oneLineTrim`The {{img_url}} helper should not be used as a parameter to {{#if}} or {{#unless}}`
    },
    'GS090-NO-UNKNOWN-CUSTOM-THEME-SETTINGS': {
        level: 'error',
        rule: 'An unknown custom theme setting has been used.',
        fatal: false,
        details: oneLineTrim`The custom theme setting should all be defined in the package.json <code>config.custom</code> object.`
    },
    'GS090-NO-UNKNOWN-CUSTOM-THEME-SELECT-VALUE-IN-MATCH': {
        level: 'error',
        rule: 'A custom theme setting of type <code>select</code> has been compared to a value that isn\'t defined.',
        fatal: false,
        details: oneLineTrim`Custom theme settings of type <code>select</code> can only be compared to their defined <code>options</code> when used in a <code>match</code> block.`
    },
    'GS090-NO-PRODUCTS-HELPER': {
        level: 'warning',
        rule: 'Replace <code>{{products}}</code> with <code>{{tiers}}</code>',
        details: oneLineTrim`The <code>{{products}}</code> helper has been deprecated in favor of <code>{{tiers}}</code><br>
        The <code>{{products}}</code> helper will be removed in Ghost v5 and should not be used.
        Find more information about the <code>{{tiers}}</code> property <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{products}}'
    },
    'GS090-NO-PRODUCT-DATA-HELPER': {
        level: 'warning',
        rule: 'Replace <code>{{@product}}</code> with <code>{{#get "tiers"}}</code>',
        details: oneLineTrim`The <code>{{@product}}</code> data helper has been deprecated in favor of <code>{{#get "tiers"}}</code><br>
        The <code>{{@product}}</code> data helper will be removed in Ghost v5 and should not be used.
        Find more information about the <code>{{#get "tiers"}}</code> property <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{@product}}'
    },
    'GS090-NO-PRODUCTS-DATA-HELPER': {
        level: 'warning',
        rule: 'Replace <code>{{@products}}</code> with <code>{{#get "tiers"}}</code>',
        details: oneLineTrim`The <code>{{@products}}</code> data helper has been deprecated in favor of <code>{{#get "tiers"}}</code><br>
        The <code>{{@products}}</code> data helper will be removed in Ghost v5 and should not be used.
        Find more information about the <code>{{#get "tiers"}}</code> property <a href="${docsBaseUrl}helpers/tiers/" target=_blank>here</a>.`,
        helper: '{{@products}}'
    },

    'GS100-NO-UNUSED-CUSTOM-THEME-SETTING': {
        level: 'error',
        rule: 'A custom theme setting defined in <code>package.json</code> hasn\'t been used in any theme file.',
        details: oneLineTrim`Custom theme settings defined in <code>package.json</code> must be used at least once in the theme templates.`
    },

    'GS050-CSS-KGCO': cssCardRule('callout', 'kg-callout-card'),
    'GS050-CSS-KGCOE': cssCardRule('callout', 'kg-callout-card-emoji'),
    'GS050-CSS-KGCOT': cssCardRule('callout', 'kg-callout-card-text'),
    'GS050-CSS-KGCOBGGY': cssCardRule('callout', 'kg-callout-card-background-grey'),
    'GS050-CSS-KGCOBGW': cssCardRule('callout', 'kg-callout-card-background-white'),
    'GS050-CSS-KGCOBGB': cssCardRule('callout', 'kg-callout-card-background-blue'),
    'GS050-CSS-KGCOBGGN': cssCardRule('callout', 'kg-callout-card-background-green'),
    'GS050-CSS-KGCOBGY': cssCardRule('callout', 'kg-callout-card-background-yellow'),
    'GS050-CSS-KGCOBGR': cssCardRule('callout', 'kg-callout-card-background-red'),
    'GS050-CSS-KGCOBGPK': cssCardRule('callout', 'kg-callout-card-background-pink'),
    'GS050-CSS-KGCOBGPE': cssCardRule('callout', 'kg-callout-card-background-purple'),
    'GS050-CSS-KGCOBGA': cssCardRule('callout', 'kg-callout-card-background-accent'),

    'GS050-CSS-KG-NFT': cssCardRule('nft', 'kg-nft-card'),
    'GS050-CSS-KG-NFTCO': cssCardRule('nft', 'kg-nft-card-container'),
    'GS050-CSS-KG-NFTMD': cssCardRule('nft', 'kg-nft-metadata'),
    'GS050-CSS-KG-NFTIMG': cssCardRule('nft', 'kg-nft-image'),
    'GS050-CSS-KG-NFTHD': cssCardRule('nft', 'kg-nft-header'),
    'GS050-CSS-KG-NFTTIT': cssCardRule('nft', 'kg-nft-title'),
    'GS050-CSS-KG-NFTLG': cssCardRule('nft', 'kg-nft-logo'),
    'GS050-CSS-KG-NFTCTR': cssCardRule('nft', 'kg-nft-creator'),
    'GS050-CSS-KG-NFTDSC': cssCardRule('nft', 'kg-nft-description'),

    'GS050-CSS-KGTGL': cssCardRule('toggle', 'kg-toggle-card'),
    'GS050-CSS-KGTGLH': cssCardRule('toggle', 'kg-toggle-heading'),
    'GS050-CSS-KGTGLHT': cssCardRule('toggle', 'kg-toggle-heading-text'),
    'GS050-CSS-KGTGLIC': cssCardRule('toggle', 'kg-toggle-card-icon'),
    'GS050-CSS-KGTGLC': cssCardRule('toggle', 'kg-toggle-content'),

    'GS050-CSS-KGAUD': cssCardRule('audio', 'kg-audio-card'),
    'GS050-CSS-KGAUDTHUMB': cssCardRule('audio', 'kg-audio-thumbnail'),
    'GS050-CSS-KGAUDTHUMBPL': cssCardRule('audio', 'kg-audio-thumbnail.placeholder'),
    'GS050-CSS-KGAUDPLCNT': cssCardRule('audio', 'kg-audio-player-container'),
    'GS050-CSS-KGAUDTI': cssCardRule('audio', 'kg-audio-title'),
    'GS050-CSS-KGAUDPL': cssCardRule('audio', 'kg-audio-player'),
    'GS050-CSS-KGAUDCURRTM': cssCardRule('audio', 'kg-audio-current-time'),
    'GS050-CSS-KGAUDTM': cssCardRule('audio', 'kg-audio-time'),
    'GS050-CSS-KGAUDDUR': cssCardRule('audio', 'kg-audio-duration'),
    'GS050-CSS-KGAUDPLICO': cssCardRule('audio', 'kg-audio-play-icon'),
    'GS050-CSS-KGAUDPAUICO': cssCardRule('audio', 'kg-audio-pause-icon'),
    'GS050-CSS-KGAUDSKSL': cssCardRule('audio', 'kg-audio-seek-slider'),
    'GS050-CSS-KGAUDPLRT': cssCardRule('audio', 'kg-audio-playback-rate'),
    'GS050-CSS-KGAUDMTICO': cssCardRule('audio', 'kg-audio-mute-icon'),
    'GS050-CSS-KGAUDUNMTICO': cssCardRule('audio', 'kg-audio-unmute-icon'),
    'GS050-CSS-KGAUDVOLSL': cssCardRule('audio', 'kg-audio-volume-slider'),

    'GS050-CSS-KGVID': cssCardRule('video', 'kg-video-card'),
    'GS050-CSS-KGVIDHD': cssCardRule('video', 'kg-video-hide'),
    'GS050-CSS-KGVIDCNT': cssCardRule('video', 'kg-video-container'),
    'GS050-CSS-KGVIDOVL': cssCardRule('video', 'kg-video-overlay'),
    'GS050-CSS-KGVIDLGPLICO': cssCardRule('video', 'kg-video-large-play-icon'),
    'GS050-CSS-KGVIDTHUMB': cssCardRule('video', 'kg-video-thumbnail'),
    'GS050-CSS-KGVIDTHUMBPL': cssCardRule('video', 'kg-video-thumbnail.placeholder'),
    'GS050-CSS-KGVIDPLCNT': cssCardRule('video', 'kg-video-player-container'),
    'GS050-CSS-KGVIDTI': cssCardRule('video', 'kg-video-title'),
    'GS050-CSS-KGVIDPL': cssCardRule('video', 'kg-video-player'),
    'GS050-CSS-KGVIDCURRTM': cssCardRule('video', 'kg-video-current-time'),
    'GS050-CSS-KGVIDTM': cssCardRule('video', 'kg-video-time'),
    'GS050-CSS-KGVIDDUR': cssCardRule('video', 'kg-video-duration'),
    'GS050-CSS-KGVIDPLICO': cssCardRule('video', 'kg-video-play-icon'),
    'GS050-CSS-KGVIDPAUICO': cssCardRule('video', 'kg-video-pause-icon'),
    'GS050-CSS-KGVIDSKSL': cssCardRule('video', 'kg-video-seek-slider'),
    'GS050-CSS-KGVIDPLRT': cssCardRule('video', 'kg-video-playback-rate'),
    'GS050-CSS-KGVIDMTICO': cssCardRule('video', 'kg-video-mute-icon'),
    'GS050-CSS-KGVIDUNMTICO': cssCardRule('video', 'kg-video-unmute-icon'),
    'GS050-CSS-KGVIDVOLSL': cssCardRule('video', 'kg-video-volume-slider'),

    'GS050-CSS-KGBTN': cssCardRule('button', 'kg-button-card'),
    'GS050-CSS-KGBTNL': cssCardRule('button', 'kg-button-card.kg-align-left'),
    'GS050-CSS-KGBTNC': cssCardRule('button', 'kg-button-card.kg-align-center'),
    'GS050-CSS-KGBTNBTN': cssCardRule('button', 'kg-btn'),
    'GS050-CSS-KGBTNBTNA': cssCardRule('button', 'kg-btn-accent'),

    'GS050-CSS-KGPR': cssCardRule('product', 'kg-product-card'),
    'GS050-CSS-KGPRBTNA': cssCardRule('product', 'kg-product-card-btn-accent'),
    'GS050-CSS-KGPRBTN': cssCardRule('product', 'kg-product-card-button'),
    'GS050-CSS-KGPRCO': cssCardRule('product', 'kg-product-card-container'),
    'GS050-CSS-KGPRDE': cssCardRule('product', 'kg-product-card-description'),
    'GS050-CSS-KGPRIM': cssCardRule('product', 'kg-product-card-image'),
    'GS050-CSS-KGPRRA': cssCardRule('product', 'kg-product-card-rating'),
    'GS050-CSS-KGPRRAA': cssCardRule('product', 'kg-product-card-rating-active'),
    'GS050-CSS-KGPRRAS': cssCardRule('product', 'kg-product-card-rating-star'),
    'GS050-CSS-KGPRTI': cssCardRule('product', 'kg-product-card-title'),
    'GS050-CSS-KGPRTICO': cssCardRule('product', 'kg-product-card-title-container'),

    'GS050-CSS-KGBA': cssCardRule('before-after', 'kg-before-after-card'),
    'GS050-CSS-KGBAIA': cssCardRule('before-after', 'kg-before-after-card-image-before'),
    'GS050-CSS-KGBAIB': cssCardRule('before-after', 'kg-before-after-card-image-after'),

    'GS050-CSS-KGFL': cssCardRule('file', 'kg-file-card'),
    'GS050-CSS-KGFLCON': cssCardRule('file', 'kg-file-card-container'),
    'GS050-CSS-KGFLCNT': cssCardRule('file', 'kg-file-card-contents'),
    'GS050-CSS-KGFLTTL': cssCardRule('file', 'kg-file-card-title'),
    'GS050-CSS-KGFLCAP': cssCardRule('file', 'kg-file-card-caption'),
    'GS050-CSS-KGFLNM': cssCardRule('file', 'kg-file-card-filename'),
    'GS050-CSS-KGFLSZ': cssCardRule('file', 'kg-file-card-filesize'),
    'GS050-CSS-KGFLMD': cssCardRule('file', 'kg-file-card-medium'),
    'GS050-CSS-KGFLSM': cssCardRule('file', 'kg-file-card-small'),

    'GS050-CSS-KGBQALT': cssCardRule('blockquote', 'kg-blockquote-alt')
};

knownHelpers = _.union(previousKnownHelpers, knownHelpers);
templates = _.union(previousTemplates, templates);

// Merge the previous rules into the new rules, but overwrite any specified property,
// as well as adding any new rule to the spec.
// Furthermore, replace the usage of the old doc URLs that we're linking to, with the
// new version.
delete previousRules['GS002-DISQUS-ID'];
delete previousRules['GS002-ID-HELPER'];

rules = _.merge({}, previousRules, rules);
rules = _.each(rules, function replaceDocsUrl(value) {
    value.details = value.details.replace(prevDocsBaseUrlRegEx, docsBaseUrl);
});

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules,
    defaultPackageJSON: previousSpec.defaultPackageJSON
};
