import { InstrumentationConfig } from '@opentelemetry/instrumentation';
import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import { Span } from '@sentry/core';
type PostgresConnectionContext = {
    ATTR_DB_NAMESPACE?: string;
    ATTR_SERVER_ADDRESS?: string;
    ATTR_SERVER_PORT?: string;
};
type PostgresJsInstrumentationConfig = InstrumentationConfig & {
    /**
     * Whether to require a parent span for the instrumentation.
     * If set to true, the instrumentation will only create spans if there is a parent span
     * available in the current scope.
     * @default true
     */
    requireParentSpan?: boolean;
    /**
     * Hook to modify the span before it is started.
     * This can be used to set additional attributes or modify the span in any way.
     */
    requestHook?: (span: Span, sanitizedSqlQuery: string, postgresConnectionContext?: PostgresConnectionContext) => void;
};
export declare const instrumentPostgresJs: ((options?: PostgresJsInstrumentationConfig | undefined) => PostgresJsInstrumentation) & {
    id: string;
};
/**
 * Instrumentation for the [postgres](https://www.npmjs.com/package/postgres) library.
 * This instrumentation captures postgresjs queries and their attributes,
 */
export declare class PostgresJsInstrumentation extends InstrumentationBase<PostgresJsInstrumentationConfig> {
    constructor(config: PostgresJsInstrumentationConfig);
    /**
     * Initializes the instrumentation.
     */
    init(): InstrumentationNodeModuleDefinition[];
    /**
     * Determines whether a span should be created based on the current context.
     * If `requireParentSpan` is set to true in the configuration, a span will
     * only be created if there is a parent span available.
     */
    private _shouldCreateSpans;
    /**
     * Patches the reject method of the Query class to set the span status and end it
     */
    private _patchReject;
    /**
     * Patches the resolve method of the Query class to end the span when the query is resolved.
     */
    private _patchResolve;
    /**
     * Patches the Query class to instrument the handle method.
     */
    private _patchQuery;
    /**
     * Patches the Connection class to set the database, host, and port attributes
     * when a new connection is created.
     */
    private _patchConnection;
    /**
     * Sanitize SQL query as per the OTEL semantic conventions
     * https://opentelemetry.io/docs/specs/semconv/database/database-spans/#sanitization-of-dbquerytext
     */
    private _sanitizeSqlQuery;
}
/**
 * Adds Sentry tracing instrumentation for the [postgres](https://www.npmjs.com/package/postgres) library.
 *
 * For more information, see the [`postgresIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/postgres/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.postgresJsIntegration()],
 * });
 * ```
 */
export declare const postgresJsIntegration: () => import("@sentry/core").Integration;
export {};
//# sourceMappingURL=postgresjs.d.ts.map
