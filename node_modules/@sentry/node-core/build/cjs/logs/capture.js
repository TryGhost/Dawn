Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const util = require('node:util');
const core = require('@sentry/core');

/**
 * Capture a log with the given level.
 *
 * @param level - The level of the log.
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., userId: 100.
 */
function captureLog(level, ...args) {
  const [messageOrMessageTemplate, paramsOrAttributes, maybeAttributes] = args;
  if (Array.isArray(paramsOrAttributes)) {
    const attributes = { ...maybeAttributes };
    attributes['sentry.message.template'] = messageOrMessageTemplate;
    paramsOrAttributes.forEach((param, index) => {
      attributes[`sentry.message.parameter.${index}`] = param;
    });
    const message = util.format(messageOrMessageTemplate, ...paramsOrAttributes);
    core._INTERNAL_captureLog({ level, message, attributes });
  } else {
    core._INTERNAL_captureLog({ level, message: messageOrMessageTemplate, attributes: paramsOrAttributes });
  }
}

exports.captureLog = captureLog;
//# sourceMappingURL=capture.js.map
