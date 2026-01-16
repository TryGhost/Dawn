Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const core = require('@sentry/core');
const instrument = require('../../otel/instrument.js');
const SentryHttpInstrumentation = require('./SentryHttpInstrumentation.js');

const INTEGRATION_NAME = 'Http';

const instrumentSentryHttp = instrument.generateInstrumentOnce(
  `${INTEGRATION_NAME}.sentry`,
  options => {
    return new SentryHttpInstrumentation.SentryHttpInstrumentation(options);
  },
);

/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs for outgoing HTTP requests which will be attached to the currently active span.
 */
const httpIntegration = core.defineIntegration((options = {}) => {
  const dropSpansForIncomingRequestStatusCodes = options.dropSpansForIncomingRequestStatusCodes ?? [
    [401, 404],
    [300, 399],
  ];

  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentSentryHttp({
        ...options,
        extractIncomingTraceFromHeader: true,
        propagateTraceInOutgoingRequests: true,
      });
    },
    processEvent(event) {
      // Drop transaction if it has a status code that should be ignored
      if (event.type === 'transaction') {
        const statusCode = event.contexts?.trace?.data?.['http.response.status_code'];
        if (
          typeof statusCode === 'number' &&
          dropSpansForIncomingRequestStatusCodes.some(code => {
            if (typeof code === 'number') {
              return code === statusCode;
            }

            const [min, max] = code;
            return statusCode >= min && statusCode <= max;
          })
        ) {
          return null;
        }
      }

      return event;
    },
  };
});

exports.httpIntegration = httpIntegration;
//# sourceMappingURL=index.js.map
