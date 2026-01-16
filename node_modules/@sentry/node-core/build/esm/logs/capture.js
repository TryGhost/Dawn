import { format } from 'node:util';
import { _INTERNAL_captureLog } from '@sentry/core';

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
    const message = format(messageOrMessageTemplate, ...paramsOrAttributes);
    _INTERNAL_captureLog({ level, message, attributes });
  } else {
    _INTERNAL_captureLog({ level, message: messageOrMessageTemplate, attributes: paramsOrAttributes });
  }
}

export { captureLog };
//# sourceMappingURL=capture.js.map
