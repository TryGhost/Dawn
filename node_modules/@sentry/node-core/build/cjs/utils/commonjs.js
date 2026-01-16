Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

/** Detect CommonJS. */
function isCjs() {
  try {
    return typeof module !== 'undefined' && typeof module.exports !== 'undefined';
  } catch {
    return false;
  }
}

exports.isCjs = isCjs;
//# sourceMappingURL=commonjs.js.map
