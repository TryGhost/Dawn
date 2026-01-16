const Handlebars = require('handlebars');

function parse(content, fileName) {
    let ast;
    let error;
    try {
        ast = Handlebars.parseWithoutProcessing(content, {srcName: fileName});
    } catch (_error) {
        error = _error;
    }
    return {ast, error};
}

module.exports = parse;
