const {AST} = require('handlebars');

function getPartialName(node) {
    return node.name.original;
}

function getNodeName(node) {
    switch (node.type) {
    case 'SubExpression':
    case 'MustacheStatement':
    case 'BlockStatement':
        return `${node.path.data ? '@' : ''}${node.path.parts.join('.')}`;

    case 'Program':
        return;

    case 'PathExpression':
    default:
        if (node.data){
            return `@${node.parts.join('.')}`;
        }
        if (node.parts) {
            return node.parts[0];
        }
        if (node.name.parts) {
            return node.name.parts[0];
        }

        if (node.name.original) {
            return node.name.original;
        }
    }
}

function _blockPrefixChar(node) {
    return node.inverse && !node.program ? '^' : '#';
}

function logNode(node) {
    const prefix = (node.inverse || node.program) ? _blockPrefixChar(node) : '';

    return `{{${prefix}${getNodeName(node)}}}`;
}

// Extracted from https://github.com/handlebars-lang/handlebars.js/blob/6790c080c641ef2b44e663800e1794fae180977a/lib/handlebars/compiler/compiler.js#L429
function blockParamIndex(name, options) {
    for (
        let depth = 0, len = options.blockParams.length;
        depth < len;
        depth++
    ) {
        let blockParams = options.blockParams[depth],
            param = blockParams && blockParams.indexOf(name);
        if (blockParams && param >= 0) {
            return [depth, param];
        }
    }
}

// Extracted from https://github.com/handlebars-lang/handlebars.js/blob/6790c080c641ef2b44e663800e1794fae180977a/lib/handlebars/compiler/compiler.js#L368
function classifyNode(sexpr, options = {knownHelpers: [], knownHelpersOnly: false, blockParams: []}) {
    let isSimple = AST.helpers.simpleId(sexpr.path);

    let isBlockParam = isSimple && !!blockParamIndex(sexpr.path.parts[0], options);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    let isHelper = !isBlockParam && AST.helpers.helperExpression(sexpr);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
    let isEligible = !isBlockParam && (isHelper || isSimple);

    // if ambiguous, we can possibly resolve the ambiguity now
    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
    if (isEligible && !isHelper) {
        let name = sexpr.path.parts[0];
        if (options.knownHelpers.includes(name)) {
            isHelper = true;
        } else if (options.knownHelpersOnly) {
            isEligible = false;
        }
    }

    if (isHelper) {
        return 'helper';
    } else if (isEligible) {
        return 'ambiguous';
    } else {
        return 'simple';
    }
}

// Extracted from https://github.com/handlebars-lang/handlebars.js/blob/6790c080c641ef2b44e663800e1794fae180977a/lib/handlebars/compiler/compiler.js#L522
function transformLiteralToPath(sexpr) {
    if (!sexpr.path.parts) {
        let literal = sexpr.path;
        // Casting to string here to make false and 0 literal values play nicely with the rest
        // of the system.
        sexpr.path = {
            type: 'PathExpression',
            data: false,
            depth: 0,
            parts: [literal.original + ''],
            original: literal.original + '',
            loc: literal.loc
        };
    }
}

module.exports = {
    getNodeName,
    getPartialName,
    logNode,
    classifyNode,
    transformLiteralToPath
};
