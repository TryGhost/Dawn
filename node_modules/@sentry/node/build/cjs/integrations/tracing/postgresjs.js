Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const api = require('@opentelemetry/api');
const instrumentation = require('@opentelemetry/instrumentation');
const semanticConventions = require('@opentelemetry/semantic-conventions');
const core = require('@sentry/core');
const nodeCore = require('@sentry/node-core');

// Instrumentation for https://github.com/porsager/postgres

const INTEGRATION_NAME = 'PostgresJs';
const SUPPORTED_VERSIONS = ['>=3.0.0 <4'];

const instrumentPostgresJs = nodeCore.generateInstrumentOnce(
  INTEGRATION_NAME,
  (options) =>
    new PostgresJsInstrumentation({
      requireParentSpan: options?.requireParentSpan ?? true,
      requestHook: options?.requestHook,
    }),
);

/**
 * Instrumentation for the [postgres](https://www.npmjs.com/package/postgres) library.
 * This instrumentation captures postgresjs queries and their attributes,
 */
class PostgresJsInstrumentation extends instrumentation.InstrumentationBase {
   constructor(config) {
    super('sentry-postgres-js', core.SDK_VERSION, config);
  }

  /**
   * Initializes the instrumentation.
   */
   init() {
    const instrumentationModule = new instrumentation.InstrumentationNodeModuleDefinition('postgres', SUPPORTED_VERSIONS);

    ['src', 'cf/src', 'cjs/src'].forEach(path => {
      instrumentationModule.files.push(
        new instrumentation.InstrumentationNodeModuleFile(
          `postgres/${path}/connection.js`,
          ['*'],
          this._patchConnection.bind(this),
          this._unwrap.bind(this),
        ),
      );

      instrumentationModule.files.push(
        new instrumentation.InstrumentationNodeModuleFile(
          `postgres/${path}/query.js`,
          SUPPORTED_VERSIONS,
          this._patchQuery.bind(this),
          this._unwrap.bind(this),
        ),
      );
    });

    return [instrumentationModule];
  }

  /**
   * Determines whether a span should be created based on the current context.
   * If `requireParentSpan` is set to true in the configuration, a span will
   * only be created if there is a parent span available.
   */
   _shouldCreateSpans() {
    const config = this.getConfig();
    const hasParentSpan = api.trace.getSpan(api.context.active()) !== undefined;
    return hasParentSpan || !config.requireParentSpan;
  }

  /**
   * Patches the reject method of the Query class to set the span status and end it
   */
   _patchReject(rejectTarget, span) {
    return new Proxy(rejectTarget, {
      apply: (
        rejectTarget,
        rejectThisArg,
        rejectArgs

,
      ) => {
        span.setStatus({
          code: core.SPAN_STATUS_ERROR,
          // This message is the error message from the rejectArgs, when available
          // e.g "relation 'User' does not exist"
          message: rejectArgs?.[0]?.message || 'unknown_error',
        });

        const result = Reflect.apply(rejectTarget, rejectThisArg, rejectArgs);

        // This status code is PG error code, e.g. '42P01' for "relation does not exist"
        // https://www.postgresql.org/docs/current/errcodes-appendix.html
        span.setAttribute(semanticConventions.ATTR_DB_RESPONSE_STATUS_CODE, rejectArgs?.[0]?.code || 'Unknown error');
        // This is the error type, e.g. 'PostgresError' for a Postgres error
        span.setAttribute(semanticConventions.ATTR_ERROR_TYPE, rejectArgs?.[0]?.name || 'Unknown error');

        span.end();
        return result;
      },
    });
  }

  /**
   * Patches the resolve method of the Query class to end the span when the query is resolved.
   */
   _patchResolve(resolveTarget, span) {
    return new Proxy(resolveTarget, {
      apply: (resolveTarget, resolveThisArg, resolveArgs) => {
        const result = Reflect.apply(resolveTarget, resolveThisArg, resolveArgs);
        const sqlCommand = resolveArgs?.[0]?.command;

        if (sqlCommand) {
          // SQL command is only available when the query is resolved successfully
          span.setAttribute(semanticConventions.ATTR_DB_OPERATION_NAME, sqlCommand);
        }
        span.end();
        return result;
      },
    });
  }

  /**
   * Patches the Query class to instrument the handle method.
   */
   _patchQuery(moduleExports

) {
    moduleExports.Query.prototype.handle = new Proxy(moduleExports.Query.prototype.handle, {
      apply: async (
        handleTarget,
        handleThisArg

,
        handleArgs,
      ) => {
        if (!this._shouldCreateSpans()) {
          // If we don't need to create spans, just call the original method
          return Reflect.apply(handleTarget, handleThisArg, handleArgs);
        }

        const sanitizedSqlQuery = this._sanitizeSqlQuery(handleThisArg.strings?.[0]);

        return core.startSpanManual(
          {
            name: sanitizedSqlQuery || 'postgresjs.query',
            op: 'db',
          },
          (span) => {
            const scope = core.getCurrentScope();
            const postgresConnectionContext = scope.getScopeData().contexts['postgresjsConnection']

;

            nodeCore.addOriginToSpan(span, 'auto.db.otel.postgres');

            const { requestHook } = this.getConfig();

            if (requestHook) {
              instrumentation.safeExecuteInTheMiddle(
                () => requestHook(span, sanitizedSqlQuery, postgresConnectionContext),
                error => {
                  if (error) {
                    core.debug.error(`Error in requestHook for ${INTEGRATION_NAME} integration:`, error);
                  }
                },
              );
            }

            // ATTR_DB_NAMESPACE is used to indicate the database name and the schema name
            // It's only the database name as we don't have the schema information
            const databaseName = postgresConnectionContext?.ATTR_DB_NAMESPACE || '<unknown database>';
            const databaseHost = postgresConnectionContext?.ATTR_SERVER_ADDRESS || '<unknown host>';
            const databasePort = postgresConnectionContext?.ATTR_SERVER_PORT || '<unknown port>';

            span.setAttribute(semanticConventions.ATTR_DB_SYSTEM_NAME, 'postgres');
            span.setAttribute(semanticConventions.ATTR_DB_NAMESPACE, databaseName);
            span.setAttribute(semanticConventions.ATTR_SERVER_ADDRESS, databaseHost);
            span.setAttribute(semanticConventions.ATTR_SERVER_PORT, databasePort);
            span.setAttribute(semanticConventions.ATTR_DB_QUERY_TEXT, sanitizedSqlQuery);

            handleThisArg.resolve = this._patchResolve(handleThisArg.resolve, span);
            handleThisArg.reject = this._patchReject(handleThisArg.reject, span);

            try {
              return Reflect.apply(handleTarget, handleThisArg, handleArgs);
            } catch (error) {
              span.setStatus({
                code: core.SPAN_STATUS_ERROR,
              });
              span.end();
              throw error; // Re-throw the error to propagate it
            }
          },
        );
      },
    });

    return moduleExports;
  }

  /**
   * Patches the Connection class to set the database, host, and port attributes
   * when a new connection is created.
   */
   _patchConnection(Connection) {
    return new Proxy(Connection, {
      apply: (connectionTarget, thisArg, connectionArgs) => {
        const databaseName = connectionArgs[0]?.database || '<unknown database>';
        const databaseHost = connectionArgs[0]?.host?.[0] || '<unknown host>';
        const databasePort = connectionArgs[0]?.port?.[0] || '<unknown port>';

        const scope = core.getCurrentScope();
        scope.setContext('postgresjsConnection', {
          ATTR_DB_NAMESPACE: databaseName,
          ATTR_SERVER_ADDRESS: databaseHost,
          ATTR_SERVER_PORT: databasePort,
        });

        return Reflect.apply(connectionTarget, thisArg, connectionArgs);
      },
    });
  }

  /**
   * Sanitize SQL query as per the OTEL semantic conventions
   * https://opentelemetry.io/docs/specs/semconv/database/database-spans/#sanitization-of-dbquerytext
   */
   _sanitizeSqlQuery(sqlQuery) {
    if (!sqlQuery) {
      return 'Unknown SQL Query';
    }

    return (
      sqlQuery
        .replace(/\s+/g, ' ')
        .trim() // Remove extra spaces including newlines and trim
        .substring(0, 1024) // Truncate to 1024 characters
        .replace(/--.*?(\r?\n|$)/g, '') // Single line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
        .replace(/;\s*$/, '') // Remove trailing semicolons
        .replace(/\b\d+\b/g, '?') // Replace standalone numbers
        // Collapse whitespace to a single space
        .replace(/\s+/g, ' ')
        // Collapse IN and in clauses
        // eg. IN (?, ?, ?, ?) to IN (?)
        .replace(/\bIN\b\s*\(\s*\?(?:\s*,\s*\?)*\s*\)/g, 'IN (?)')
    );
  }
}

const _postgresJsIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentPostgresJs();
    },
  };
}) ;

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

const postgresJsIntegration = core.defineIntegration(_postgresJsIntegration);

exports.PostgresJsInstrumentation = PostgresJsInstrumentation;
exports.instrumentPostgresJs = instrumentPostgresJs;
exports.postgresJsIntegration = postgresJsIntegration;
//# sourceMappingURL=postgresjs.js.map
