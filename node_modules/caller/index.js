'use strict';
var assert = require('assert');


/**
 * Module wrapper of @substack's `caller.js`
 * @original: https://github.com/substack/node-resolve/blob/master/lib/caller.js
 * @blessings: https://twitter.com/eriktoth/statuses/413719312273125377
 * @see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
 */
module.exports = function (depth) {
    var pst, stack, file, frame, startIdx;

    pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        Error.prepareStackTrace = pst;
        return stack;
    };

    stack = (new Error()).stack;
    // Handle case where error object is wrapped by say babel. Try to find current file's index first.
    startIdx = 0;
    while(startIdx < stack.length && stack[startIdx].getFileName() !== __filename) startIdx++;
    assert(startIdx < stack.length, 'Unexpected: unable to find caller/index.js in the stack');

    depth = !depth || isNaN(depth) ? 1 : (depth > stack.length - 2 ? stack.length - 2 : depth);
    stack = stack.slice(startIdx + depth + 1);

    do {
        frame = stack.shift();
        file = frame && frame.getFileName();
    } while (stack.length && file === 'module.js');

    return file;
};
