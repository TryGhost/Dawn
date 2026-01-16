Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const os = require('node:os');
const api = require('@opentelemetry/api');
const instrumentation = require('@opentelemetry/instrumentation');
const core = require('@sentry/core');
const opentelemetry = require('@sentry/opentelemetry');
const worker_threads = require('worker_threads');
const debugBuild = require('../debug-build.js');

const DEFAULT_CLIENT_REPORT_FLUSH_INTERVAL_MS = 60000; // 60s was chosen arbitrarily

/** A client for using Sentry with Node & OpenTelemetry. */
class NodeClient extends core.ServerRuntimeClient {

   constructor(options) {
    const serverName =
      options.includeServerName === false
        ? undefined
        : options.serverName || global.process.env.SENTRY_NAME || os.hostname();

    const clientOptions = {
      ...options,
      platform: 'node',
      runtime: { name: 'node', version: global.process.version },
      serverName,
    };

    if (options.openTelemetryInstrumentations) {
      instrumentation.registerInstrumentations({
        instrumentations: options.openTelemetryInstrumentations,
      });
    }

    core.applySdkMetadata(clientOptions, 'node');

    core.debug.log(`Initializing Sentry: process: ${process.pid}, thread: ${worker_threads.isMainThread ? 'main' : `worker-${worker_threads.threadId}`}.`);

    super(clientOptions);

    const { enableLogs, _experiments } = this.getOptions();
    // eslint-disable-next-line deprecation/deprecation
    const shouldEnableLogs = enableLogs ?? _experiments?.enableLogs;
    if (shouldEnableLogs) {
      this._logOnExitFlushListener = () => {
        core._INTERNAL_flushLogsBuffer(this);
      };

      if (serverName) {
        this.on('beforeCaptureLog', log => {
          log.attributes = {
            ...log.attributes,
            'server.address': serverName,
          };
        });
      }

      process.on('beforeExit', this._logOnExitFlushListener);
    }
  }

  /** Get the OTEL tracer. */
   get tracer() {
    if (this._tracer) {
      return this._tracer;
    }

    const name = '@sentry/node';
    const version = core.SDK_VERSION;
    const tracer = api.trace.getTracer(name, version);
    this._tracer = tracer;

    return tracer;
  }

  // Eslint ignore explanation: This is already documented in super.
  // eslint-disable-next-line jsdoc/require-jsdoc
   async flush(timeout) {
    const provider = this.traceProvider;

    await provider?.forceFlush();

    if (this.getOptions().sendClientReports) {
      this._flushOutcomes();
    }

    return super.flush(timeout);
  }

  // Eslint ignore explanation: This is already documented in super.
  // eslint-disable-next-line jsdoc/require-jsdoc
   close(timeout) {
    if (this._clientReportInterval) {
      clearInterval(this._clientReportInterval);
    }

    if (this._clientReportOnExitFlushListener) {
      process.off('beforeExit', this._clientReportOnExitFlushListener);
    }

    if (this._logOnExitFlushListener) {
      process.off('beforeExit', this._logOnExitFlushListener);
    }

    return super.close(timeout);
  }

  /**
   * Will start tracking client reports for this client.
   *
   * NOTICE: This method will create an interval that is periodically called and attach a `process.on('beforeExit')`
   * hook. To clean up these resources, call `.close()` when you no longer intend to use the client. Not doing so will
   * result in a memory leak.
   */
  // The reason client reports need to be manually activated with this method instead of just enabling them in a
  // constructor, is that if users periodically and unboundedly create new clients, we will create more and more
  // intervals and beforeExit listeners, thus leaking memory. In these situations, users are required to call
  // `client.close()` in order to dispose of the acquired resources.
  // We assume that calling this method in Sentry.init() is a sensible default, because calling Sentry.init() over and
  // over again would also result in memory leaks.
  // Note: We have experimented with using `FinalizationRegisty` to clear the interval when the client is garbage
  // collected, but it did not work, because the cleanup function never got called.
   startClientReportTracking() {
    const clientOptions = this.getOptions();
    if (clientOptions.sendClientReports) {
      this._clientReportOnExitFlushListener = () => {
        this._flushOutcomes();
      };

      this._clientReportInterval = setInterval(() => {
        debugBuild.DEBUG_BUILD && core.debug.log('Flushing client reports based on interval.');
        this._flushOutcomes();
      }, clientOptions.clientReportFlushInterval ?? DEFAULT_CLIENT_REPORT_FLUSH_INTERVAL_MS)
        // Unref is critical for not preventing the process from exiting because the interval is active.
        .unref();

      process.on('beforeExit', this._clientReportOnExitFlushListener);
    }
  }

  /** Custom implementation for OTEL, so we can handle scope-span linking. */
   _getTraceInfoFromScope(
    scope,
  ) {
    if (!scope) {
      return [undefined, undefined];
    }

    return opentelemetry.getTraceContextForScope(this, scope);
  }
}

exports.NodeClient = NodeClient;
//# sourceMappingURL=client.js.map
