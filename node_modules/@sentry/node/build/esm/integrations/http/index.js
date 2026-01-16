import { diag } from '@opentelemetry/api';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { defineIntegration, getClient, hasSpansEnabled } from '@sentry/core';
import { generateInstrumentOnce, SentryHttpInstrumentation, NODE_VERSION, addOriginToSpan, getRequestUrl } from '@sentry/node-core';

const INTEGRATION_NAME = 'Http';

const INSTRUMENTATION_NAME = '@opentelemetry_sentry-patched/instrumentation-http';

const instrumentSentryHttp = generateInstrumentOnce(
  `${INTEGRATION_NAME}.sentry`,
  options => {
    return new SentryHttpInstrumentation(options);
  },
);

const instrumentOtelHttp = generateInstrumentOnce(INTEGRATION_NAME, config => {
  const instrumentation = new HttpInstrumentation(config);

  // We want to update the logger namespace so we can better identify what is happening here
  try {
    instrumentation['_diag'] = diag.createComponentLogger({
      namespace: INSTRUMENTATION_NAME,
    });
    // @ts-expect-error We are writing a read-only property here...
    instrumentation.instrumentationName = INSTRUMENTATION_NAME;
  } catch {
    // ignore errors here...
  }

  return instrumentation;
});

/** Exported only for tests. */
function _shouldInstrumentSpans(options, clientOptions = {}) {
  // If `spans` is passed in, it takes precedence
  // Else, we by default emit spans, unless `skipOpenTelemetrySetup` is set to `true` or spans are not enabled
  if (typeof options.spans === 'boolean') {
    return options.spans;
  }

  if (clientOptions.skipOpenTelemetrySetup) {
    return false;
  }

  // IMPORTANT: We only disable span instrumentation when spans are not enabled _and_ we are on Node 22+,
  // as otherwise the necessary diagnostics channel is not available yet
  if (!hasSpansEnabled(clientOptions) && NODE_VERSION.major >= 22) {
    return false;
  }

  return true;
}

/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs and spans for outgoing HTTP requests which will be attached to the currently active span.
 */
const httpIntegration = defineIntegration((options = {}) => {
  const dropSpansForIncomingRequestStatusCodes = options.dropSpansForIncomingRequestStatusCodes ?? [
    [401, 404],
    [300, 399],
  ];

  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      const instrumentSpans = _shouldInstrumentSpans(options, getClient()?.getOptions());

      // This is Sentry-specific instrumentation for request isolation and breadcrumbs
      instrumentSentryHttp({
        ...options,
        // If spans are not instrumented, it means the HttpInstrumentation has not been added
        // In that case, we want to handle incoming trace extraction ourselves
        extractIncomingTraceFromHeader: !instrumentSpans,
        // If spans are not instrumented, it means the HttpInstrumentation has not been added
        // In that case, we want to handle trace propagation ourselves
        propagateTraceInOutgoingRequests: !instrumentSpans,
      });

      // This is the "regular" OTEL instrumentation that emits spans
      if (instrumentSpans) {
        const instrumentationConfig = getConfigWithDefaults(options);
        instrumentOtelHttp(instrumentationConfig);
      }
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

/**
 * Determines if @param req is a ClientRequest, meaning the request was created within the express app
 * and it's an outgoing request.
 * Checking for properties instead of using `instanceOf` to avoid importing the request classes.
 */
function _isClientRequest(req) {
  return 'outputData' in req && 'outputSize' in req && !('client' in req) && !('statusCode' in req);
}

/**
 * Detects if an incoming request is a prefetch request.
 */
function isKnownPrefetchRequest(req) {
  // Currently only handles Next.js prefetch requests but may check other frameworks in the future.
  return req.headers['next-router-prefetch'] === '1';
}

function getConfigWithDefaults(options = {}) {
  const instrumentationConfig = {
    ...options.instrumentation?._experimentalConfig,

    disableIncomingRequestInstrumentation: options.disableIncomingRequestSpans,

    ignoreOutgoingRequestHook: request => {
      const url = getRequestUrl(request);

      if (!url) {
        return false;
      }

      const _ignoreOutgoingRequests = options.ignoreOutgoingRequests;
      if (_ignoreOutgoingRequests?.(url, request)) {
        return true;
      }

      return false;
    },

    ignoreIncomingRequestHook: request => {
      // request.url is the only property that holds any information about the url
      // it only consists of the URL path and query string (if any)
      const urlPath = request.url;

      const method = request.method?.toUpperCase();
      // We do not capture OPTIONS/HEAD requests as transactions
      if (method === 'OPTIONS' || method === 'HEAD') {
        return true;
      }

      const _ignoreIncomingRequests = options.ignoreIncomingRequests;
      if (urlPath && _ignoreIncomingRequests?.(urlPath, request)) {
        return true;
      }

      return false;
    },

    requireParentforOutgoingSpans: false,
    requireParentforIncomingSpans: false,
    requestHook: (span, req) => {
      addOriginToSpan(span, 'auto.http.otel.http');
      if (!_isClientRequest(req) && isKnownPrefetchRequest(req)) {
        span.setAttribute('sentry.http.prefetch', true);
      }

      options.instrumentation?.requestHook?.(span, req);
    },
    responseHook: (span, res) => {
      options.instrumentation?.responseHook?.(span, res);
    },
    applyCustomAttributesOnSpan: (
      span,
      request,
      response,
    ) => {
      options.instrumentation?.applyCustomAttributesOnSpan?.(span, request, response);
    },
  } ;

  return instrumentationConfig;
}

export { _shouldInstrumentSpans, httpIntegration, instrumentOtelHttp };
//# sourceMappingURL=index.js.map
