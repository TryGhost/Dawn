Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const diagnosticsChannel = require('node:diagnostics_channel');
const api = require('@opentelemetry/api');
const core$1 = require('@opentelemetry/core');
const instrumentation = require('@opentelemetry/instrumentation');
const core = require('@sentry/core');
const opentelemetry = require('@sentry/opentelemetry');
const debugBuild = require('../../debug-build.js');
const baggage = require('../../utils/baggage.js');
const getRequestUrl = require('../../utils/getRequestUrl.js');

const INSTRUMENTATION_NAME = '@sentry/instrumentation-http';

// We only want to capture request bodies up to 1mb.
const MAX_BODY_BYTE_LENGTH = 1024 * 1024;

/**
 * This custom HTTP instrumentation is used to isolate incoming requests and annotate them with additional information.
 * It does not emit any spans.
 *
 * The reason this is isolated from the OpenTelemetry instrumentation is that users may overwrite this,
 * which would lead to Sentry not working as expected.
 *
 * Important note: Contrary to other OTEL instrumentation, this one cannot be unwrapped.
 * It only does minimal things though and does not emit any spans.
 *
 * This is heavily inspired & adapted from:
 * https://github.com/open-telemetry/opentelemetry-js/blob/f8ab5592ddea5cba0a3b33bf8d74f27872c0367f/experimental/packages/opentelemetry-instrumentation-http/src/http.ts
 */
class SentryHttpInstrumentation extends instrumentation.InstrumentationBase {

   constructor(config = {}) {
    super(INSTRUMENTATION_NAME, core.SDK_VERSION, config);

    this._propagationDecisionMap = new core.LRUMap(100);
    this._ignoreOutgoingRequestsMap = new WeakMap();
  }

  /** @inheritdoc */
   init() {
    // We register handlers when either http or https is instrumented
    // but we only want to register them once, whichever is loaded first
    let hasRegisteredHandlers = false;

    const onHttpServerRequestStart = ((_data) => {
      const data = _data ;
      this._patchServerEmitOnce(data.server);
    }) ;

    const onHttpClientResponseFinish = ((_data) => {
      const data = _data ;
      this._onOutgoingRequestFinish(data.request, data.response);
    }) ;

    const onHttpClientRequestError = ((_data) => {
      const data = _data ;
      this._onOutgoingRequestFinish(data.request, undefined);
    }) ;

    const onHttpClientRequestCreated = ((_data) => {
      const data = _data ;
      this._onOutgoingRequestCreated(data.request);
    }) ;

    const wrap = (moduleExports) => {
      if (hasRegisteredHandlers) {
        return moduleExports;
      }

      hasRegisteredHandlers = true;

      diagnosticsChannel.subscribe('http.server.request.start', onHttpServerRequestStart);
      diagnosticsChannel.subscribe('http.client.response.finish', onHttpClientResponseFinish);

      // When an error happens, we still want to have a breadcrumb
      // In this case, `http.client.response.finish` is not triggered
      diagnosticsChannel.subscribe('http.client.request.error', onHttpClientRequestError);

      // NOTE: This channel only exist since Node 22
      // Before that, outgoing requests are not patched
      // and trace headers are not propagated, sadly.
      if (this.getConfig().propagateTraceInOutgoingRequests) {
        diagnosticsChannel.subscribe('http.client.request.created', onHttpClientRequestCreated);
      }

      return moduleExports;
    };

    const unwrap = () => {
      diagnosticsChannel.unsubscribe('http.server.request.start', onHttpServerRequestStart);
      diagnosticsChannel.unsubscribe('http.client.response.finish', onHttpClientResponseFinish);
      diagnosticsChannel.unsubscribe('http.client.request.error', onHttpClientRequestError);
      diagnosticsChannel.unsubscribe('http.client.request.created', onHttpClientRequestCreated);
    };

    /**
     * You may be wondering why we register these diagnostics-channel listeners
     * in such a convoluted way (as InstrumentationNodeModuleDefinition...)˝,
     * instead of simply subscribing to the events once in here.
     * The reason for this is timing semantics: These functions are called once the http or https module is loaded.
     * If we'd subscribe before that, there seem to be conflicts with the OTEL native instrumentation in some scenarios,
     * especially the "import-on-top" pattern of setting up ESM applications.
     */
    return [
      new instrumentation.InstrumentationNodeModuleDefinition('http', ['*'], wrap, unwrap),
      new instrumentation.InstrumentationNodeModuleDefinition('https', ['*'], wrap, unwrap),
    ];
  }

  /**
   * This is triggered when an outgoing request finishes.
   * It has access to the final request and response objects.
   */
   _onOutgoingRequestFinish(request, response) {
    debugBuild.DEBUG_BUILD && core.debug.log(INSTRUMENTATION_NAME, 'Handling finished outgoing request');

    const _breadcrumbs = this.getConfig().breadcrumbs;
    const breadCrumbsEnabled = typeof _breadcrumbs === 'undefined' ? true : _breadcrumbs;

    // Note: We cannot rely on the map being set by `_onOutgoingRequestCreated`, because that is not run in Node <22
    const shouldIgnore = this._ignoreOutgoingRequestsMap.get(request) ?? this._shouldIgnoreOutgoingRequest(request);
    this._ignoreOutgoingRequestsMap.set(request, shouldIgnore);

    if (breadCrumbsEnabled && !shouldIgnore) {
      addRequestBreadcrumb(request, response);
    }
  }

  /**
   * This is triggered when an outgoing request is created.
   * It has access to the request object, and can mutate it before the request is sent.
   */
   _onOutgoingRequestCreated(request) {
    const shouldIgnore = this._ignoreOutgoingRequestsMap.get(request) ?? this._shouldIgnoreOutgoingRequest(request);
    this._ignoreOutgoingRequestsMap.set(request, shouldIgnore);

    if (shouldIgnore) {
      return;
    }

    // Add trace propagation headers
    const url = getRequestUrl.getRequestUrl(request);

    // Manually add the trace headers, if it applies
    // Note: We do not use `propagation.inject()` here, because our propagator relies on an active span
    // Which we do not have in this case
    const tracePropagationTargets = core.getClient()?.getOptions().tracePropagationTargets;
    const addedHeaders = opentelemetry.shouldPropagateTraceForUrl(url, tracePropagationTargets, this._propagationDecisionMap)
      ? core.getTraceData()
      : undefined;

    if (!addedHeaders) {
      return;
    }

    const { 'sentry-trace': sentryTrace, baggage: baggage$1 } = addedHeaders;

    // We do not want to overwrite existing header here, if it was already set
    if (sentryTrace && !request.getHeader('sentry-trace')) {
      try {
        request.setHeader('sentry-trace', sentryTrace);
        debugBuild.DEBUG_BUILD && core.debug.log(INSTRUMENTATION_NAME, 'Added sentry-trace header to outgoing request');
      } catch (error) {
        debugBuild.DEBUG_BUILD &&
          core.debug.error(
            INSTRUMENTATION_NAME,
            'Failed to add sentry-trace header to outgoing request:',
            core.isError(error) ? error.message : 'Unknown error',
          );
      }
    }

    if (baggage$1) {
      // For baggage, we make sure to merge this into a possibly existing header
      const newBaggage = baggage.mergeBaggageHeaders(request.getHeader('baggage'), baggage$1);
      if (newBaggage) {
        try {
          request.setHeader('baggage', newBaggage);
          debugBuild.DEBUG_BUILD && core.debug.log(INSTRUMENTATION_NAME, 'Added baggage header to outgoing request');
        } catch (error) {
          debugBuild.DEBUG_BUILD &&
            core.debug.error(
              INSTRUMENTATION_NAME,
              'Failed to add baggage header to outgoing request:',
              core.isError(error) ? error.message : 'Unknown error',
            );
        }
      }
    }
  }

  /**
   * Patch a server.emit function to handle process isolation for incoming requests.
   * This will only patch the emit function if it was not already patched.
   */
   _patchServerEmitOnce(server) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalEmit = server.emit;

    // This means it was already patched, do nothing
    if ((originalEmit ).__sentry_patched__) {
      return;
    }

    debugBuild.DEBUG_BUILD && core.debug.log(INSTRUMENTATION_NAME, 'Patching server.emit');

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instrumentation = this;
    const { ignoreIncomingRequestBody, maxIncomingRequestBodySize = 'medium' } = instrumentation.getConfig();

    const newEmit = new Proxy(originalEmit, {
      apply(target, thisArg, args) {
        // Only traces request events
        if (args[0] !== 'request') {
          return target.apply(thisArg, args);
        }

        debugBuild.DEBUG_BUILD && core.debug.log(INSTRUMENTATION_NAME, 'Handling incoming request');

        const isolationScope = core.getIsolationScope().clone();
        const request = args[1] ;
        const response = args[2] ;

        const normalizedRequest = core.httpRequestToRequestData(request);

        // request.ip is non-standard but some frameworks set this
        const ipAddress = (request ).ip || request.socket?.remoteAddress;

        const url = request.url || '/';
        if (!ignoreIncomingRequestBody?.(url, request) && maxIncomingRequestBodySize !== 'none') {
          patchRequestToCaptureBody(request, isolationScope, maxIncomingRequestBodySize);
        }

        // Update the isolation scope, isolate this request
        isolationScope.setSDKProcessingMetadata({ normalizedRequest, ipAddress });

        // attempt to update the scope's `transactionName` based on the request URL
        // Ideally, framework instrumentations coming after the HttpInstrumentation
        // update the transactionName once we get a parameterized route.
        const httpMethod = (request.method || 'GET').toUpperCase();
        const httpTarget = core.stripUrlQueryAndFragment(url);

        const bestEffortTransactionName = `${httpMethod} ${httpTarget}`;

        isolationScope.setTransactionName(bestEffortTransactionName);

        if (instrumentation.getConfig().trackIncomingRequestsAsSessions !== false) {
          recordRequestSession({
            requestIsolationScope: isolationScope,
            response,
            sessionFlushingDelayMS: instrumentation.getConfig().sessionFlushingDelayMS ?? 60000,
          });
        }

        return core.withIsolationScope(isolationScope, () => {
          // Set a new propagationSpanId for this request
          // We rely on the fact that `withIsolationScope()` will implicitly also fork the current scope
          // This way we can save an "unnecessary" `withScope()` invocation
          core.getCurrentScope().getPropagationContext().propagationSpanId = core.generateSpanId();

          // If we don't want to extract the trace from the header, we can skip this
          if (!instrumentation.getConfig().extractIncomingTraceFromHeader) {
            return target.apply(thisArg, args);
          }

          const ctx = api.propagation.extract(api.context.active(), normalizedRequest.headers);
          return api.context.with(ctx, () => {
            return target.apply(thisArg, args);
          });
        });
      },
    });

    core.addNonEnumerableProperty(newEmit, '__sentry_patched__', true);

    server.emit = newEmit;
  }

  /**
   * Check if the given outgoing request should be ignored.
   */
   _shouldIgnoreOutgoingRequest(request) {
    if (core$1.isTracingSuppressed(api.context.active())) {
      return true;
    }

    const ignoreOutgoingRequests = this.getConfig().ignoreOutgoingRequests;

    if (!ignoreOutgoingRequests) {
      return false;
    }

    const options = getRequestOptions(request);
    const url = getRequestUrl.getRequestUrl(request);
    return ignoreOutgoingRequests(url, options);
  }
}

/** Add a breadcrumb for outgoing requests. */
function addRequestBreadcrumb(request, response) {
  const data = getBreadcrumbData(request);

  const statusCode = response?.statusCode;
  const level = core.getBreadcrumbLogLevelFromHttpStatusCode(statusCode);

  core.addBreadcrumb(
    {
      category: 'http',
      data: {
        status_code: statusCode,
        ...data,
      },
      type: 'http',
      level,
    },
    {
      event: 'response',
      request,
      response,
    },
  );
}

function getBreadcrumbData(request) {
  try {
    // `request.host` does not contain the port, but the host header does
    const host = request.getHeader('host') || request.host;
    const url = new URL(request.path, `${request.protocol}//${host}`);
    const parsedUrl = core.parseUrl(url.toString());

    const data = {
      url: core.getSanitizedUrlString(parsedUrl),
      'http.method': request.method || 'GET',
    };

    if (parsedUrl.search) {
      data['http.query'] = parsedUrl.search;
    }
    if (parsedUrl.hash) {
      data['http.fragment'] = parsedUrl.hash;
    }

    return data;
  } catch {
    return {};
  }
}

/**
 * This method patches the request object to capture the body.
 * Instead of actually consuming the streamed body ourselves, which has potential side effects,
 * we monkey patch `req.on('data')` to intercept the body chunks.
 * This way, we only read the body if the user also consumes the body, ensuring we do not change any behavior in unexpected ways.
 */
function patchRequestToCaptureBody(
  req,
  isolationScope,
  maxIncomingRequestBodySize,
) {
  let bodyByteLength = 0;
  const chunks = [];

  debugBuild.DEBUG_BUILD && core.debug.log(INSTRUMENTATION_NAME, 'Patching request.on');

  /**
   * We need to keep track of the original callbacks, in order to be able to remove listeners again.
   * Since `off` depends on having the exact same function reference passed in, we need to be able to map
   * original listeners to our wrapped ones.
   */
  const callbackMap = new WeakMap();

  const maxBodySize =
    maxIncomingRequestBodySize === 'small'
      ? 1000
      : maxIncomingRequestBodySize === 'medium'
        ? 10000
        : MAX_BODY_BYTE_LENGTH;

  try {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    req.on = new Proxy(req.on, {
      apply: (target, thisArg, args) => {
        const [event, listener, ...restArgs] = args;

        if (event === 'data') {
          debugBuild.DEBUG_BUILD &&
            core.debug.log(INSTRUMENTATION_NAME, `Handling request.on("data") with maximum body size of ${maxBodySize}b`);

          const callback = new Proxy(listener, {
            apply: (target, thisArg, args) => {
              try {
                const chunk = args[0] ;
                const bufferifiedChunk = Buffer.from(chunk);

                if (bodyByteLength < maxBodySize) {
                  chunks.push(bufferifiedChunk);
                  bodyByteLength += bufferifiedChunk.byteLength;
                } else if (debugBuild.DEBUG_BUILD) {
                  core.debug.log(
                    INSTRUMENTATION_NAME,
                    `Dropping request body chunk because maximum body length of ${maxBodySize}b is exceeded.`,
                  );
                }
              } catch (err) {
                debugBuild.DEBUG_BUILD && core.debug.error(INSTRUMENTATION_NAME, 'Encountered error while storing body chunk.');
              }

              return Reflect.apply(target, thisArg, args);
            },
          });

          callbackMap.set(listener, callback);

          return Reflect.apply(target, thisArg, [event, callback, ...restArgs]);
        }

        return Reflect.apply(target, thisArg, args);
      },
    });

    // Ensure we also remove callbacks correctly
    // eslint-disable-next-line @typescript-eslint/unbound-method
    req.off = new Proxy(req.off, {
      apply: (target, thisArg, args) => {
        const [, listener] = args;

        const callback = callbackMap.get(listener);
        if (callback) {
          callbackMap.delete(listener);

          const modifiedArgs = args.slice();
          modifiedArgs[1] = callback;
          return Reflect.apply(target, thisArg, modifiedArgs);
        }

        return Reflect.apply(target, thisArg, args);
      },
    });

    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString('utf-8');
        if (body) {
          // Using Buffer.byteLength here, because the body may contain characters that are not 1 byte long
          const bodyByteLength = Buffer.byteLength(body, 'utf-8');
          const truncatedBody =
            bodyByteLength > maxBodySize
              ? `${Buffer.from(body)
                  .subarray(0, maxBodySize - 3)
                  .toString('utf-8')}...`
              : body;

          isolationScope.setSDKProcessingMetadata({ normalizedRequest: { data: truncatedBody } });
        }
      } catch (error) {
        if (debugBuild.DEBUG_BUILD) {
          core.debug.error(INSTRUMENTATION_NAME, 'Error building captured request body', error);
        }
      }
    });
  } catch (error) {
    if (debugBuild.DEBUG_BUILD) {
      core.debug.error(INSTRUMENTATION_NAME, 'Error patching request to capture body', error);
    }
  }
}

function getRequestOptions(request) {
  return {
    method: request.method,
    protocol: request.protocol,
    host: request.host,
    hostname: request.host,
    path: request.path,
    headers: request.getHeaders(),
  };
}

/**
 * Starts a session and tracks it in the context of a given isolation scope.
 * When the passed response is finished, the session is put into a task and is
 * aggregated with other sessions that may happen in a certain time window
 * (sessionFlushingDelayMs).
 *
 * The sessions are always aggregated by the client that is on the current scope
 * at the time of ending the response (if there is one).
 */
// Exported for unit tests
function recordRequestSession({
  requestIsolationScope,
  response,
  sessionFlushingDelayMS,
}

) {
  requestIsolationScope.setSDKProcessingMetadata({
    requestSession: { status: 'ok' },
  });
  response.once('close', () => {
    // We need to grab the client off the current scope instead of the isolation scope because the isolation scope doesn't hold any client out of the box.
    const client = core.getClient();
    const requestSession = requestIsolationScope.getScopeData().sdkProcessingMetadata.requestSession;

    if (client && requestSession) {
      debugBuild.DEBUG_BUILD && core.debug.log(`Recorded request session with status: ${requestSession.status}`);

      const roundedDate = new Date();
      roundedDate.setSeconds(0, 0);
      const dateBucketKey = roundedDate.toISOString();

      const existingClientAggregate = clientToRequestSessionAggregatesMap.get(client);
      const bucket = existingClientAggregate?.[dateBucketKey] || { exited: 0, crashed: 0, errored: 0 };
      bucket[({ ok: 'exited', crashed: 'crashed', errored: 'errored' } )[requestSession.status]]++;

      if (existingClientAggregate) {
        existingClientAggregate[dateBucketKey] = bucket;
      } else {
        debugBuild.DEBUG_BUILD && core.debug.log('Opened new request session aggregate.');
        const newClientAggregate = { [dateBucketKey]: bucket };
        clientToRequestSessionAggregatesMap.set(client, newClientAggregate);

        const flushPendingClientAggregates = () => {
          clearTimeout(timeout);
          unregisterClientFlushHook();
          clientToRequestSessionAggregatesMap.delete(client);

          const aggregatePayload = Object.entries(newClientAggregate).map(
            ([timestamp, value]) => ({
              started: timestamp,
              exited: value.exited,
              errored: value.errored,
              crashed: value.crashed,
            }),
          );
          client.sendSession({ aggregates: aggregatePayload });
        };

        const unregisterClientFlushHook = client.on('flush', () => {
          debugBuild.DEBUG_BUILD && core.debug.log('Sending request session aggregate due to client flush');
          flushPendingClientAggregates();
        });
        const timeout = setTimeout(() => {
          debugBuild.DEBUG_BUILD && core.debug.log('Sending request session aggregate due to flushing schedule');
          flushPendingClientAggregates();
        }, sessionFlushingDelayMS).unref();
      }
    }
  });
}

const clientToRequestSessionAggregatesMap = new Map

();

exports.SentryHttpInstrumentation = SentryHttpInstrumentation;
exports.recordRequestSession = recordRequestSession;
//# sourceMappingURL=SentryHttpInstrumentation.js.map
