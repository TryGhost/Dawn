import type { ContextManager } from '@opentelemetry/api';
/**
 * Wrap an OpenTelemetry ContextManager in a way that ensures the context is kept in sync with the Sentry Scope.
 *
 * Usage:
 * import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
 * const SentryContextManager = wrapContextManagerClass(AsyncLocalStorageContextManager);
 * const contextManager = new SentryContextManager();
 */
export declare function wrapContextManagerClass<ContextManagerInstance extends ContextManager>(ContextManagerClass: new (...args: unknown[]) => ContextManagerInstance): typeof ContextManagerClass;
//# sourceMappingURL=contextManager.d.ts.map