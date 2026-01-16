import { Client, Scope, SerializedTraceData, Span } from '@sentry/core';
/**
 * Otel-specific implementation of `getTraceData`.
 * @see `@sentry/core` version of `getTraceData` for more information
 */
export declare function getTraceData({ span, scope, client, }?: {
    span?: Span;
    scope?: Scope;
    client?: Client;
}): SerializedTraceData;
//# sourceMappingURL=getTraceData.d.ts.map
