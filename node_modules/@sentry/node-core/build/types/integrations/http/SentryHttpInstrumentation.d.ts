/// <reference types="node" />
/// <reference types="node" />
import type * as http from 'node:http';
import type { EventEmitter } from 'node:stream';
import type { InstrumentationConfig } from '@opentelemetry/instrumentation';
import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import type { Scope } from '@sentry/core';
export type SentryHttpInstrumentationOptions = InstrumentationConfig & {
    /**
     * Whether breadcrumbs should be recorded for requests.
     *
     * @default `true`
     */
    breadcrumbs?: boolean;
    /**
     * Whether to extract the trace ID from the `sentry-trace` header for incoming requests.
     * By default this is done by the HttpInstrumentation, but if that is not added (e.g. because tracing is disabled, ...)
     * then this instrumentation can take over.
     *
     * @default `false`
     */
    extractIncomingTraceFromHeader?: boolean;
    /**
     * Whether to propagate Sentry trace headers in outgoing requests.
     * By default this is done by the HttpInstrumentation, but if that is not added (e.g. because tracing is disabled)
     * then this instrumentation can take over.
     *
     * @default `false`
     */
    propagateTraceInOutgoingRequests?: boolean;
    /**
     * Do not capture breadcrumbs for outgoing HTTP requests to URLs where the given callback returns `true`.
     * For the scope of this instrumentation, this callback only controls breadcrumb creation.
     * The same option can be passed to the top-level httpIntegration where it controls both, breadcrumb and
     * span creation.
     *
     * @param url Contains the entire URL, including query string (if any), protocol, host, etc. of the outgoing request.
     * @param request Contains the {@type RequestOptions} object used to make the outgoing request.
     */
    ignoreOutgoingRequests?: (url: string, request: http.RequestOptions) => boolean;
    /**
     * Do not capture the request body for incoming HTTP requests to URLs where the given callback returns `true`.
     * This can be useful for long running requests where the body is not needed and we want to avoid capturing it.
     *
     * @param url Contains the entire URL, including query string (if any), protocol, host, etc. of the incoming request.
     * @param request Contains the {@type RequestOptions} object used to make the incoming request.
     */
    ignoreIncomingRequestBody?: (url: string, request: http.RequestOptions) => boolean;
    /**
     * Controls the maximum size of incoming HTTP request bodies attached to events.
     *
     * Available options:
     * - 'none': No request bodies will be attached
     * - 'small': Request bodies up to 1,000 bytes will be attached
     * - 'medium': Request bodies up to 10,000 bytes will be attached (default)
     * - 'always': Request bodies will always be attached
     *
     * Note that even with 'always' setting, bodies exceeding 1MB will never be attached
     * for performance and security reasons.
     *
     * @default 'medium'
     */
    maxIncomingRequestBodySize?: 'none' | 'small' | 'medium' | 'always';
    /**
     * Whether the integration should create [Sessions](https://docs.sentry.io/product/releases/health/#sessions) for incoming requests to track the health and crash-free rate of your releases in Sentry.
     * Read more about Release Health: https://docs.sentry.io/product/releases/health/
     *
     * Defaults to `true`.
     */
    trackIncomingRequestsAsSessions?: boolean;
    /**
     * Number of milliseconds until sessions tracked with `trackIncomingRequestsAsSessions` will be flushed as a session aggregate.
     *
     * Defaults to `60000` (60s).
     */
    sessionFlushingDelayMS?: number;
};
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
export declare class SentryHttpInstrumentation extends InstrumentationBase<SentryHttpInstrumentationOptions> {
    private _propagationDecisionMap;
    private _ignoreOutgoingRequestsMap;
    constructor(config?: SentryHttpInstrumentationOptions);
    /** @inheritdoc */
    init(): [InstrumentationNodeModuleDefinition, InstrumentationNodeModuleDefinition];
    /**
     * This is triggered when an outgoing request finishes.
     * It has access to the final request and response objects.
     */
    private _onOutgoingRequestFinish;
    /**
     * This is triggered when an outgoing request is created.
     * It has access to the request object, and can mutate it before the request is sent.
     */
    private _onOutgoingRequestCreated;
    /**
     * Patch a server.emit function to handle process isolation for incoming requests.
     * This will only patch the emit function if it was not already patched.
     */
    private _patchServerEmitOnce;
    /**
     * Check if the given outgoing request should be ignored.
     */
    private _shouldIgnoreOutgoingRequest;
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
export declare function recordRequestSession({ requestIsolationScope, response, sessionFlushingDelayMS, }: {
    requestIsolationScope: Scope;
    response: EventEmitter;
    sessionFlushingDelayMS?: number;
}): void;
//# sourceMappingURL=SentryHttpInstrumentation.d.ts.map