import { Client } from '@sentry/core';
type UnhandledRejectionMode = 'none' | 'warn' | 'strict';
interface OnUnhandledRejectionOptions {
    /**
     * Option deciding what to do after capturing unhandledRejection,
     * that mimicks behavior of node's --unhandled-rejection flag.
     */
    mode: UnhandledRejectionMode;
}
/**
 * Add a global promise rejection handler.
 */
export declare const onUnhandledRejectionIntegration: (options?: Partial<OnUnhandledRejectionOptions> | undefined) => import("@sentry/core").Integration;
/**
 * Send an exception with reason
 * @param reason string
 * @param promise promise
 *
 * Exported only for tests.
 */
export declare function makeUnhandledPromiseHandler(client: Client, options: OnUnhandledRejectionOptions): (reason: unknown, promise: unknown) => void;
export {};
//# sourceMappingURL=onunhandledrejection.d.ts.map
