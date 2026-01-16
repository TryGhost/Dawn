const {getNodeName} = require('../../helpers');
const _ = require('lodash');

// TODO: the allowlist should include all properties of these top-level globals
const ghostGlobals = {
    site: true,
    member: true,
    setting: true, // TODO: we should remove this but the Journal theme is using it atm
    config: true,
    labs: true,
    custom: true,
    page: true
};

// unless we update AST to check that we're within a foreach block, we need to allowlist all of these as they look the same as globals
const dataVars = {
    index: true,
    number: true,
    key: true,
    first: true,
    last: true,
    odd: true,
    even: true,
    rowStart: true,
    rowEnd: true
};

// unless we move from lodash to a glob match, we just need to handle all custom since we can't allowlist those
function isOnAllowlist(parts) {
    const variable = parts && parts[0];
    return ghostGlobals[variable] || dataVars[variable] || false;
}

// true = property exists
// 'context' = has context's shape
// ['context] = array of context's shape
// TODO: use JSON schema?
const contexts = {
    post: {
        // attrs
        id: true,
        primary_author: 'author',
        authors: ['author'],
        primary_tag: 'tag',
        tags: ['tag']
        // data helpers
    },
    page: {},
    author: {},
    tag: {},
    pagination: {}
};

const helpers = { // eslint-disable-line no-unused-vars
    // {{get}} can return multiple different contexts depending on params
    get(node) {
        const type = node.params[0].value.replace(/s$/, '');

        // ignore unknown types - the invalid usage should be picked up by a rule
        if (!contexts[type]) {
            return;
        }

        const isSingular = node.hash.pairs.any(pair => ['id', 'slug'].includes(pair.key));
        const typeContext = isSingular ? contexts[type] : [contexts[type]];

        return {
            locals: {
                pagination: contexts.pagination
            },
            blockParams: [
                typeContext,
                contexts.pagination
            ]
        };
    },
    next_post() {
        return {
            context: 'post',
            locals: contexts.post,
            // TODO, do we need to handle `{{#next_post as |myPost|}}`?
            blockParams: []
        };
    },
    prev_post() {
        return {
            context: 'post',
            locals: contexts.post,
            // TODO, do we need to handle `{{#prev_post as |myPost|}}`?
            blockParams: []
        };
    }
};

function getTemplateContext(fileName) {
    if (fileName.match(/^post(-.*)?\.hbs/)) {
        return {post: contexts.post};
    }

    if (fileName.match(/^page(-.*)?\.hbs/)) {
        return {page: contexts.page};
    }

    if (fileName.match(/^custom-.*\.hbs/)) {
        // we can't know for sure if this is a post or page so attach both
        return {
            post: contexts.post,
            page: contexts.page
        };
    }

    // default
    // could be anything? dynamic routing allows any template to be specified
    // along with custom data names
    // TODO: how to handle this case?
}

// TODO: use our knowledge of Ghost's helpers and JSON schemas to fully populate
// the locals array so we can detect incorrect usage
function getContext(node) {
    if (node.type !== 'BlockStatement') {
        throw new Error(`${node.type} cannot be used to generate a context`);
    }

    return {
        context: 'str',
        locals: {},
        blockParams: {}
    };
}

// NOTE:
// need to determine if the BlockStatement is referencing a helper or a local
// if it's a local then we need to create a frame using the local's contents

class Frame {
    constructor(node, options = {}) {
        this.node = node;
        this.nodeName = getNodeName(node);

        // Program statements are only used to create frames for template-level
        // contexts, otherwise we always create frames with BlockStatements
        if (node.type === 'Program') {
            if (!options.fileName) {
                throw new Error('fileName must be passed as an option when constructing a template-level Frame');
            }

            const {context, locals} = getTemplateContext(options.fileName);
            this.context = context;
            this.locals = locals; // eg. {post: {...postContext}}
            return;
        }

        if (node.type !== 'BlockStatement') {
            throw new Error(`${node.type} cannot be used to construct a Frame`);
        }

        // block-level context
        const {context, locals, blockParams} = getContext(node);
        this.context = context;
        this.locals = locals;
        // TODO: are blockParams just locals in this case?
        this.blockParams = blockParams;
    }

    isLocal(name) {
        return _.get(this.context, name);
    }
}

class Scope {
    constructor({templateFileName} = {}) {
        this.frames = [];

        if (templateFileName) {
            this.frames.push(new Frame);
        }
    }

    get currentFrame() {
        return this.frames[this.frames.length - 1];
    }

    pushTemplateFrame(fileName, node) {
        this.frames.push(new Frame(node, {fileName}));
    }

    pushFrame(node) {
        this.frames.push(new Frame(node));
    }

    popFrame() {
        this.frames.pop();
    }

    isContext(context) {
        return this.currentFrame && this.currentFrame.context === context || false;
    }

    hasParentContext(context) {
        let found = false;

        if (this.frames && this.frames.length) {
            this.frames.forEach((frame) => {
                if (frame.nodeName === context) {
                    found = true;
                }
            });
        }

        return found;
    }

    getParentContextNode(context) {
        let matchedFrame = null;

        if (this.frames && this.frames.length) {
            matchedFrame = this.frames.find((frame) => {
                if (frame.nodeName === context) {
                    return true;
                }
            });
        }

        return matchedFrame && matchedFrame.node;
    }

    isKnownVariable(node) {
        // @foo statements are referencing globals rather than locals
        //  and can be detected with the data: true attribute (???)

        // they can be direct [Mustache] statements {{@foo}}...
        if (node.type === 'MustacheStatement' && node.path.data) {
            return isOnAllowlist(node.path.parts);
        }

        // ... or indirect using helpers, e.g. {{#match @foo.bar}}{{/match}}
        if (node.type === 'PathExpression') {
            return isOnAllowlist(node.parts);
        }

        let name = getNodeName(node);

        // use node.path.depth to skip leaf frames, equates to {{../foo}}
        for (let i = this.frames.length - 1 - node.path.depth; i >= 0; i--) {
            if (this.frames[i].isLocal(name)) {
                return true;
            }
        }
    }
}

module.exports = Scope;
