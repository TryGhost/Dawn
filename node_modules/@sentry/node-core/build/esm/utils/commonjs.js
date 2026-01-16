/** Detect CommonJS. */
function isCjs() {
  try {
    return typeof module !== 'undefined' && typeof module.exports !== 'undefined';
  } catch {
    return false;
  }
}

export { isCjs };
//# sourceMappingURL=commonjs.js.map
