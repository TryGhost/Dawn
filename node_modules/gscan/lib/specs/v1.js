/**
 * # Spec
 *
 * This file contains details of the theme API spec, in a format that can be used by GScan
 */
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const docsBaseUrl = `https://ghost.org/docs/themes/`;
let knownHelpers, templates, rules, ruleNext; // eslint-disable-line no-unused-vars

knownHelpers = [
    // Ghost
    'foreach', 'has', 'is', 'get', 'content', 'excerpt', 'title', 'tags', 'author', 'authors', 'img_url', 'navigation', 'pagination',
    'page_url', 'url', 'date', 'plural', 'encode', 'asset', 'body_class', 'post_class', 'ghost_head', 'ghost_foot',
    'lang', 'meta_title', 'meta_description', 'next_post', 'prev_post', 't', 'twitter_url', 'facebook_url', 'reading_time',
    // Ghost apps
    'input_email', 'input_password', 'amp_components', 'amp_content', 'amp_ghost_head', 'subscribe_form',
    // Handlebars and express handlebars
    'log', 'if', 'unless', 'with', 'block', 'contentFor', 'each', 'lookup'
    // Registering these will break template compile checks
    // 'blockHelperMissing', 'helperMissing',
];

templates = [
    {
        name: 'Page template',
        pattern: /^page\.hbs$/,
        version: '>=0.4.0'
    },
    {
        name: 'Error template',
        pattern: /^error\.hbs$/,
        version: '>=0.4.0'
    },
    {
        name: 'Tag template',
        pattern: /^tag\.hbs$/,
        version: '>=0.4.2'
    },
    {
        name: 'Custom page template',
        pattern: /^page-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.4.2'
    },
    {
        name: 'Author template',
        pattern: /^author\.hbs$/,
        version: '>=0.5.0'
    },
    {
        name: 'Home template',
        pattern: /^home\.hbs$/,
        version: '>=0.5.0'
    },
    {
        name: 'Custom tag template',
        pattern: /^tag-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.5.0'
    },
    {
        name: 'Custom author template',
        pattern: /^author-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.6.3'
    },
    {
        name: 'Private template',
        pattern: /^private\.hbs$/,
        version: '>=0.6.3'
    },
    {
        name: 'Custom post template',
        pattern: /^post-([a-z0-9\-_]+)\.hbs$/,
        version: '>=0.7.3'
    }
];

rules = {
    'GS001-DEPR-PURL': {
        level: 'error',
        rule: 'Replace <code>{{pageUrl}}</code> with <code>{{page_url}}</code>',
        fatal: true,
        details: oneLineTrim`The helper <code>{{pageUrl}}</code> was replaced with <code>{{page_url}}</code>.<br>
        Find more information about the <code>{{page_url}}</code> helper <a href="${docsBaseUrl}helpers/pagination/" target=_blank>here</a>.`,
        regex: /{{\s*?pageUrl\b[\w\s='"]*?}}/ig,
        helper: '{{pageUrl}}'
    },
    'GS001-DEPR-MD': {
        level: 'error',
        rule: 'The usage of <code>{{meta_description}}</code> in HTML <code>head</code> is no longer required',
        details: oneLineTrim`The usage of <code>{{meta_description}}</code> in the HTML <code>head</code> tag is no longer required because Ghost outputs this for you automatically in <code>{{ghost_head}}</code>.<br>
        Check out the documentation for <code>{{meta_description}}</code> <a href="${docsBaseUrl}helpers/meta_data/" target=_blank>here</a>.<br>
        To see, what else is rendered with the <code>{{ghost_head}}</code> helper, look <a href="${docsBaseUrl}helpers/ghost_head_foot/" target=_blank>here</a>.`,
        regex: /<meta name=("|')description("|') content=("|'){{meta_description}}("|')/ig,
        helper: '{{meta_description}}'
    },
    'GS001-DEPR-IMG': {
        level: 'error',
        rule: 'The <code>{{image}}</code> helper was replaced with the <code>{{img_url}}</code> helper.</code>.',
        fatal: true,
        details: oneLineTrim`The <code>{{image}}</code> helper was replaced with the <code>{{img_url}}</code> helper.<br>
        Depending on the context of the <code>{{img_url}}</code> helper you would need to use e. g. <br><br><code>{{#post}}<br>&nbsp;&nbsp;&nbsp;&nbsp;{{img_url feature_image}}<br>{{/post}}</code><br><br>to render the feature image of the blog post.<br>
        <br><b>If you are using <code>{{if image}}</code></b>, then you have to replace it with e.g. <code>{{if feature_image}}.</code>
        <br><br>Find more information about the <code>{{img_url}}</code> helper <a href="${docsBaseUrl}helpers/img_url/" target=_blank>here</a> and
        read more about Ghost's usage of contexts <a href="${docsBaseUrl}contexts/" target=_blank>here</a>.`,
        regex: /{{\s*?image\b[\w\s='"]*?}}/g,
        helper: '{{image}}'
    },
    'GS001-DEPR-COV': {
        level: 'error',
        rule: 'Replace <code>{{cover}}</code> with <code>{{cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>. To render the cover image in author context, you need to use<br><br>
        <code>{{#author}}<br>&nbsp;&nbsp;&nbsp;&nbsp;{{cover_image}}<br>{{/author}}</code><br><br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.<br>
        To render the cover image of your blog, just use <code>{{@site.cover_image}}</code>. See <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /{{\s*?cover\s*?}}/g,
        helper: '{{cover}}'
    },
    'GS001-DEPR-AIMG': {
        level: 'error',
        rule: 'Replace <code>{{author.image}}</code> with <code>{{author.profile_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in author context was replaced with <code>profile_image</code>.<br>
        Instead of <code>{{author.image}}</code> you need to use <code>{{author.profile_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?author\.image\s*?}}/g,
        helper: '{{author.image}}'
    },
    'GS001-DEPR-PIMG': {
        level: 'error',
        rule: 'Replace <code>{{post.image}}</code> with <code>{{post.feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in post context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{post.image}}</code> you need to use <code>{{post.feature_image}}</code>.<br>
        See the object attributes of <code>post</code> <a href="${docsBaseUrl}contexts/post/#post-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?post\.image\s*?}}/g,
        helper: '{{post.image}}'
    },
    'GS001-DEPR-BC': {
        level: 'error',
        rule: 'Replace <code>{{@blog.cover}}</code> with <code>{{@site.cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{@blog.cover}}</code> you need to use <code>{{@site.cover_image}}</code>.<br>
        See <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /{{\s*?@blog\.cover\s*?}}/g,
        helper: '{{@blog.cover}}'
    },
    'GS001-DEPR-AC': {
        level: 'error',
        rule: 'Replace <code>{{author.cover}}</code> with <code>{{author.cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{author.cover}}</code> you need to use <code>{{author.cover_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?author\.cover\s*?}}/g,
        helper: '{{author.cover}}'
    },
    'GS001-DEPR-TIMG': {
        level: 'error',
        rule: 'Replace <code>{{tag.image}}</code> with <code>{{tag.feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in tag context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{tag.image}}</code> you need to use <code>{{tag.feature_image}}</code>.<br>
        See the object attributes of <code>tags</code> <a href="${docsBaseUrl}contexts/tag/#tag-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?tag\.image\s*?}}/g,
        helper: '{{tag.image}}'
    },
    'GS001-DEPR-PAIMG': {
        level: 'error',
        rule: 'Replace <code>{{post.author.image}}</code> with <code>{{post.author.feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in author context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{post.author.image}}</code> you need to use <code>{{post.author.feature_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?post\.author\.image\s*?}}/g,
        helper: '{{post.author.image}}'
    },
    'GS001-DEPR-PAC': {
        level: 'error',
        rule: 'Replace <code>{{post.author.cover}}</code> with <code>{{post.author.cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute in author context was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{post.author.cover}}</code> you need to use <code>{{post.author.cover_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?post\.author\.cover\s*?}}/g,
        helper: '{{post.author.cover}}'
    },
    'GS001-DEPR-PTIMG': {
        level: 'error',
        rule: 'Replace <code>{{post.tags.[#].image}}</code> with <code>{{post.tags.[#].feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in tag context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{post.tags.[#].image}}</code> you need to use <code>{{post.tags.[#].feature_image}}</code>.<br>
        See the object attributes of <code>tags</code> <a href="${docsBaseUrl}contexts/tag/#tag-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?post\.tags\.\[[0-9]+\]\.image\s*?}}/g,
        helper: '{{post.tags.[#].image}}'
    },
    'GS001-DEPR-TSIMG': {
        level: 'error',
        rule: 'Replace <code>{{tags.[#].image}}</code> with <code>{{tags.[#].feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in tag context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{tags.[#].image}}</code> you need to use <code>{{tags.[#].feature_image}}</code>.<br>
        See the object attributes of <code>tags</code> <a href="${docsBaseUrl}contexts/tag/#tag-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?tags\.\[[0-9]+\]\.image\s*?}}/g,
        helper: '{{tags.[#].image}}'
    },
    'GS001-DEPR-CON-IMG': {
        level: 'error',
        rule: 'Replace <code>{{#if image}}</code> with <code>{{#if feature_image}}</code>, or <code>' +
        '{{#if profile_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute was replaced with <code>feature_image</code> and <code>profile_image</code>.<br>
        Depending on the <a href="${docsBaseUrl}contexts/" target=_blank>context</a> you will need to replace it like this:<br><br>
        <code>{{#author}}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;{{#if profile_image}}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{profile_image}}<br>&nbsp;&nbsp;&nbsp;&nbsp;{{/if}}<br>
        {{/author}}</code><br><br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.<br><br>
        <code>{{#post}}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;{{#if feature_image}}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{feature_image}}<br>&nbsp;&nbsp;&nbsp;&nbsp;{{/if}}<br>
        {{/post}}</code><br><br>
        See the object attributes of <code>post</code> <a href="${docsBaseUrl}contexts/post/#post-object-attributes" target=_blank>here</a>.<br><br>
        <code>{{#tag}}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;{{#if feature_image}}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{feature_image}}<br>&nbsp;&nbsp;&nbsp;&nbsp;{{/if}}<br>
        {{/tag}}</code><br><br>
        See the object attributes of <code>tags</code> <a href="${docsBaseUrl}contexts/tag/#tag-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?image\s*?}}/g,
        helper: '{{#if image}}'
    },
    'GS001-DEPR-CON-COV': {
        level: 'error',
        rule: 'Replace <code>{{#if cover}}</code> with <code>{{#if cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>. To check for the cover image in author context, you need to use<br><br>
        <code>{{#if cover_image}}<br>&nbsp;&nbsp;&nbsp;&nbsp;{{cover_image}}<br>{{/if}}</code><br><br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.<br>
        To check for the cover image of your blog, just use <code>{{#if @site.cover_image}}</code>. See <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?cover\s*?}}/g,
        helper: '{{#if cover}}'
    },
    'GS001-DEPR-CON-BC': {
        level: 'error',
        rule: 'Replace <code>{{#if @blog.cover}}</code> with <code>{{#if @site.cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{#if @blog.cover}}</code> you need to use <code>{{#if @site.cover_image}}</code>.<br>
        See <a href="${docsBaseUrl}helpers/site/" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?@blog\.cover\s*?}}/g,
        helper: '{{#if @blog.cover}}'
    },
    'GS001-DEPR-CON-AC': {
        level: 'error',
        rule: 'Replace <code>{{#if author.cover}}</code> with <code>{{#if author.cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{#if author.cover}}</code> you need to use <code>{{#if author.cover_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?author\.cover\s*?}}/g,
        helper: '{{#if author.cover}}'
    },
    'GS001-DEPR-CON-AIMG': {
        level: 'error',
        rule: 'Replace <code>{{#if author.image}}</code> with <code>{{#if author.profile_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in author context was replaced with <code>profile_image</code>.<br>
        Instead of <code>{{#if author.image}}</code> you need to use <code>{{#if author.profile_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?author\.image\s*?}}/g,
        helper: '{{#if author.image}}'
    },
    'GS001-DEPR-CON-PAC': {
        level: 'error',
        rule: 'Replace <code>{{#if post.author.cover}}</code> with <code>{{#if post.author.cover_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>cover</code> attribute was replaced with <code>cover_image</code>.<br>
        Instead of <code>{{#if post.author.cover}}</code> you need to use <code>{{#if post.author.cover_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?post\.author\.cover\s*?}}/g,
        helper: '{{#if post.author.cover}}'
    },
    'GS001-DEPR-CON-PAIMG': {
        level: 'error',
        rule: 'Replace <code>{{#if post.author.image}}</code> with <code>{{#if post.author.profile_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in author context was replaced with <code>profile_image</code>.<br>
        Instead of <code>{{#if post.author.image}}</code> you need to use <code>{{#if post.author.profile_image}}</code>.<br>
        See the object attributes of <code>author</code> <a href="${docsBaseUrl}contexts/author/#author-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?post\.author\.image\s*?}}/g,
        helper: '{{#if post.author.image}}'
    },
    'GS001-DEPR-CON-TIMG': {
        level: 'error',
        rule: 'Replace <code>{{#if tag.image}}</code> with <code>{{#if tag.feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in tag context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{#if tag.image}}</code> you need to use <code>{{#if tag.feature_image}}</code>.<br>
        See the object attributes of <code>tags</code> <a href="${docsBaseUrl}contexts/tag/#tag-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?tag\.image\s*?}}/g,
        helper: '{{#if tag.image}}'
    },
    'GS001-DEPR-CON-PTIMG': {
        level: 'error',
        rule: 'Replace <code>{{#if post.tags.[#].image}}</code> with <code>{{#if post.tags.[#].feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in tag context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{#if post.tags.[#].image}}</code> you need to use <code>{{#if post.tags.[#].feature_image}}</code>.<br>
        See the object attributes of <code>tags</code> <a href="${docsBaseUrl}contexts/tag/#tag-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?post\.tags\.\[[0-9]+\].image\s*?}}/g,
        helper: '{{#if posts.tags.[#].image}}'
    },
    'GS001-DEPR-CON-TSIMG': {
        level: 'error',
        rule: 'Replace <code>{{#if tags.[#].image}}</code> with <code>{{#if tags.[#].feature_image}}</code>',
        fatal: true,
        details: oneLineTrim`The <code>image</code> attribute in tag context was replaced with <code>feature_image</code>.<br>
        Instead of <code>{{#if tags.[#].image}}</code> you need to use <code>{{#if tags.[#].feature_image}}</code>.<br>
        See the object attributes of <code>tags</code> <a href="${docsBaseUrl}contexts/tag/#tag-object-attributes" target=_blank>here</a>.`,
        regex: /{{\s*?#if\s*?tags\.\[[0-9]+\].image\s*?}}/g,
        helper: '{{#if tags.[#].image}}'
    },
    'GS001-DEPR-PPP': {
        level: 'error',
        rule: 'Replace <code>{{@blog.posts_per_page}}</code> with <code>{{@config.posts_per_page}}</code>',
        details: oneLineTrim`The global <code>{{@blog.posts_per_page}}</code> property was replaced with <code>{{@config.posts_per_page}}</code>.<br>
        Read <a href="${docsBaseUrl}helpers/config/" target=_blank>here</a> about the attribute and
        check <a href="${docsBaseUrl}structure/#packagejson" target=_blank>here</a> where you can customise the posts per page setting, as this is now adjustable in your theme.`,
        regex: /{{\s*?@blog\.posts_per_page\s*?}}/g,
        helper: '{{@blog.posts_per_page}}'
    },
    'GS001-DEPR-C0H': {
        level: 'error',
        rule: 'Replace <code>{{content words="0"}}</code> with <code>&lt;img src="{{img_url feature_image}}"/></code>.',
        details: oneLineTrim`The <code>{{content words="0"}}</code> hack doesn't work anymore (and was never supported).<br>
        Find more information about the <code>{{img_url}}</code> helper <a href="${docsBaseUrl}helpers/img_url/" target=_blank>here</a>.`,
        regex: /{{\s*?content words=("|')0("|')\s*?}}/g,
        helper: '{{content words="0"}}'
    },
    'GS001-DEPR-CSS-AT': {
        level: 'error',
        rule: 'Replace <code>.archive-template</code> with the <code>.paged</code> CSS class',
        details: oneLineTrim`The <code>.archive-template</code> CSS class was replaced with the <code>.paged</code>. Please replace this in your stylesheet.<br>
        See the <a href="${docsBaseUrl}contexts/" target=_blank>context table</a> to check which classes Ghost uses for each context.`,
        regex: /\.archive-template[\s{]/g,
        className: '.archive-template',
        css: true
    },
    'GS001-DEPR-CSS-PATS': {
        level: 'error',
        rule: 'Replace <code>.page-template-slug</code> with the <code>.page-slug</code> css class',
        details: oneLineTrim`The <code>.page-template-slug</code> CSS class was replaced with the <code>.page-slug</code>. Please replace this in your stylesheet.<br>
        See the <a href="${docsBaseUrl}contexts/" target=_blank>context table</a> to check which classes Ghost uses for each context.`,
        regex: /\.page-template-\w+[\s{]/g,
        className: '.page-template-slug',
        css: true
    },
    'GS001-DEPR-EACH': {
        level: 'warning',
        rule: 'Replace <code>{{#each}}</code> with <code>{{#foreach}}</code>',
        fatal: false,
        details: oneLineTrim`The <code>{{#foreach}}</code> helper is context-aware and should always be used instead of Handlebars <code>{{#each}}</code> when working with Ghost themes.<br>
        See the description of <code>{{#foreach}}</code> helper <a href="${docsBaseUrl}helpers/foreach/" target=_blank>here</a>.`,
        regex: /{{\s*?#each\s*/g
    },
    'GS002-DISQUS-ID': {
        level: 'error',
        rule: 'Replace <code>{{id}}</code> with <code>{{comment_id}}</code> in Disqus embeds.',
        fatal: true,
        details: oneLineTrim`The output of <code>{{id}}</code> has changed in v1.0.0 from an incremental ID to an ObjectID.
        This results in Disqus comments not loading in Ghost v1.0.0 posts which were imported from earlier versions.
        To resolve this, we've added a <code>{{comment_id}}</code> helper that will output the old ID
        for posts that have been imported from earlier versions, and ID for new posts.
        The Disqus embed must be updated from <code>this.page.identifier = 'ghost-{{id}}';</code> to
        <code>this.page.identifier = 'ghost-{{comment_id}}';</code> to ensure Disqus continues to work.`,
        regex: /(page\.|disqus_)identifier\s?=\s?['"].*?({{\s*?id\s*?}}).*?['"];?/g
    },
    'GS002-ID-HELPER': {
        level: 'recommendation',
        rule: 'The output of <code>{{id}}</code> changed in Ghost v1.0.0, you may need to use <code>{{comment_id}}</code> instead.',
        details: oneLineTrim`The output of <code>{{id}}</code> has changed in v1.0.0 from an incremental ID to an ObjectID.
        In v1.0.0 we added a <code>{{comment_id}}</code> helper that will output the old ID
        for posts that have been imported from earlier versions, and ID for new posts.
        If you need the old ID to be output on imported posts, then you will need to use
        <code>{{comment_id}}</code> rather than <code>{{id}}</code>.`,
        regex: /({{\s*?id\s*?}})/g
    },
    'GS005-TPL-ERR': {
        level: 'error',
        rule: 'Templates must contain valid Handlebars',
        fatal: true,
        details: oneLineTrim`Oops! You seemed to have used invalid Handlebars syntax. This mostly happens when you use a helper that is not supported.<br>
        See the full list of available helpers <a href="${docsBaseUrl}helpers/" target=_blank>here</a>.`
    },
    'GS010-PJ-REQ': {
        level: 'error',
        rule: '<code>package.json</code> file should be present',
        details: oneLineTrim`You should provide a <code>package.json</code> file for your theme.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> to see which properties are required and which are recommended.`
    },
    'GS010-PJ-PARSE': {
        level: 'error',
        rule: '<code>package.json</code> file can be parsed',
        details: oneLineTrim`Your <code>package.json</code> file couldn't be parsed. This is mostly caused by a missing or unnecessary <code>','</code> or the wrong usage of <code>'""'</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.<br>
        A good reference for your <code>package.json</code> file is always the latest version of  <a href="https://github.com/TryGhost/Casper/blob/master/package.json" target=_blank>Casper</a>.`
    },
    'GS010-PJ-NAME-LC': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"name"</code> must be lowercase',
        details: oneLineTrim`The property <code>"name"</code> in your <code>package.json</code> file must be lowercase.<br>
        Good examples are: <code>"my-theme"</code> or <code>"theme"</code> rather than <code>"My Theme"</code> or <code>"Theme"</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-NAME-HY': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"name"</code> must be hyphenated',
        details: oneLineTrim`The property <code>"name"</code> in your <code>package.json</code> file must be hyphenated.<br>
        Please use <code>"my-theme"</code> rather than <code>"My Theme"</code> or <code>"my theme"</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-NAME-REQ': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"name"</code> is required',
        details: oneLineTrim`Please add the property <code>"name"</code> to your <code>package.json</code>. E.g. <code>{"name": "my-theme"}</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> to see which properties are required and which are recommended.`
    },
    'GS010-PJ-VERSION-SEM': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"version"</code> must be semver compliant',
        details: oneLineTrim`The property <code>"version"</code> in your <code>package.json</code> file must be semver compliant. E.g. <code>{"version": "1.0.0"}</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-VERSION-REQ': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"version"</code> is required',
        details: oneLineTrim`Please add the property <code>"version"</code> to your <code>package.json</code>. E.g. <code>{"version": "1.0.0"}</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> to see which properties are required and which are recommended.`
    },
    'GS010-PJ-AUT-EM-VAL': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"author.email"</code> must be valid',
        details: oneLineTrim`The property <code>"author.email"</code> in your <code>package.json</code> file must a valid email. E.g. <code>{"author": {"email": "hello@example.com"}}</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CONF-PPP': {
        level: 'recommendation',
        rule: '<code>package.json</code> property <code>"config.posts_per_page"</code> is recommended. Otherwise, it falls back to 5',
        details: oneLineTrim`Please add <code>"posts_per_page"</code> to your <code>package.json</code>. E.g. <code>{"config": { "posts_per_page": 5}}</code>.<br>
        If no <code>"posts_per_page"</code> property is provided, Ghost will use its default setting of 5 posts per page.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-CONF-PPP-INT': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"config.posts_per_page"</code> must be a number above 0',
        details: oneLineTrim`The property <code>"config.posts_per_page"</code> in your <code>package.json</code> file must be a number greater than zero. E.g. <code>{"config": { "posts_per_page": 5}}</code>.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> for further information.`
    },
    'GS010-PJ-AUT-EM-REQ': {
        level: 'error',
        rule: '<code>package.json</code> property <code>"author.email"</code> is required',
        details: oneLineTrim`Please add the property <code>"author.email"</code> to your <code>package.json</code>. E.g. <code>{"author": {"email": "hello@example.com"}}</code>.<br>
        The email is required so that themes which are distributed (either free or paid) have a method of contacting the author so users can get support and more importantly so that>
        Ghost can reach out about breaking changes and security updates.<br>
        The <code>package.json</code> file is <strong>NOT</strong> accessible when uploaded to a blog so if the theme is only uploaded to a single blog, no one will see this email address.<br>
        Check the <a href="${docsBaseUrl}structure/#packagejson" target=_blank><code>package.json</code> documentation</a> to see which properties are required and which are recommended.`
    },
    'GS020-INDEX-REQ': {
        level: 'error',
        rule: 'A template file called <code>index.hbs</code> must be present',
        fatal: true,
        details: oneLineTrim`Your theme must have a template file called <code>index.hbs</code>.<br>
        Read <a href="${docsBaseUrl}contexts/" target=_blank>here</a> more about the required template structure and <code>index.hbs</code> in <a href="${docsBaseUrl}contexts/index-context/" target=_blank>particular</a>.`,
        path: 'index.hbs'
    },
    'GS020-POST-REQ': {
        level: 'error',
        rule: 'A template file called <code>post.hbs</code> must be present',
        fatal: true,
        details: oneLineTrim`Your theme must have a template file called <code>index.hbs</code>.<br>
        Read <a href="${docsBaseUrl}structure/#templates" target=_blank>here</a> more about the required template structure and <code>post.hbs</code> in <a href="${docsBaseUrl}structure/#posthbs" target=_blank>particular</a>.`,
        path: 'post.hbs'
    },
    'GS020-DEF-REC': {
        level: 'recommendation',
        rule: 'Provide a default layout template called default.hbs',
        details: oneLineTrim`It is recommended that your theme has a template file called <code>default.hbs</code>.<br>
        Read <a href="${docsBaseUrl}structure/#templates" target=_blank>here</a> more about the recommended template structure and <code>default.hbs</code> in <a href="${docsBaseUrl}structure/#defaulthbs" target=_blank>particular</a>.`,
        path: 'default.hbs'
    },
    'GS030-ASSET-REQ': {
        level: 'warning',
        rule: 'Assets such as CSS & JS must use the <code>{{asset}}</code> helper',
        details: oneLineTrim`The listed files should be included using the <code>{{asset}}</code> helper.<br>
        For more information, please see the <a href="${docsBaseUrl}helpers/asset/" target=_blank><code>{{asset}}</code> helper documentation</a>.`,
        regex: /(src|href)=['"](.*?\/assets\/.*?)['"]/gmi
    },
    'GS030-ASSET-SYM': {
        level: 'error',
        rule: 'Symlinks in themes are not allowed',
        fatal: true,
        details: oneLineTrim`Symbolic links in themes are not allowed. Please use the <code>{{asset}}</code> helper.<br>
        For more information, please see the <a href="${docsBaseUrl}helpers/asset/" target=_blank><code>{{asset}}</code> helper documentation</a>.`
    },
    'GS040-GH-REQ': {
        level: 'warning',
        rule: 'The helper <code>{{ghost_head}}</code> should be present',
        details: oneLineTrim`The <code>{{ghost_head}}</code> helper should be present in your theme. It outputs many useful things, such as <a href="${docsBaseUrl}helpers/ghost_head_foot/" target=_blank>"code injection" scripts</a>, structured data, canonical links, meta description etc.<br>
        The helper belongs just before the <code>&lt;/head></code> tag in your <code>default.hbs</code> template.<br>
        For more details, please see the <a href="${docsBaseUrl}helpers/ghost_head_foot/" target=_blank><code>{{ghost_head}}</code> helper documentation</a>.`,
        helper: 'ghost_head'
    },
    'GS040-GF-REQ': {
        level: 'warning',
        rule: 'The helper <code>{{ghost_foot}}</code> should be present',
        details: oneLineTrim`The <code>{{ghost_foot}}</code> helper should be present in your theme. It outputs scripts as saved in <a href="${docsBaseUrl}helpers/ghost_head_foot/" target=_blank>"code injection" scripts</a>.<br>
        The helper belongs just before the <code>&lt;/body></code> tag in your <code>default.hbs</code> template.<br>
        For more details, please see the <a href="${docsBaseUrl}helpers/ghost_head_foot/" target=_blank><code>{{ghost_foot}}</code> helper documentation</a>.`,
        helper: 'ghost_foot'
    }
};

/**
 * These are rules that haven't been implemented yet, but should be!
 */
ruleNext = { //eslint-disable-line
    'GS030-CSS-CACHE': {
        level: 'warning',
        rule: 'CSS files should use cache bustable URLs'
    }
};

module.exports = {
    knownHelpers: knownHelpers,
    templates: templates,
    rules: rules
};
