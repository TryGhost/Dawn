import { type InstrumentationConfig, type InstrumentationModuleDefinition, InstrumentationBase } from '@opentelemetry/instrumentation';
import type { Integration, OpenAiOptions } from '@sentry/core';
export interface OpenAiIntegration extends Integration {
    options: OpenAiOptions;
}
/**
 * Sentry OpenAI instrumentation using OpenTelemetry.
 */
export declare class SentryOpenAiInstrumentation extends InstrumentationBase<InstrumentationConfig> {
    constructor(config?: InstrumentationConfig);
    /**
     * Initializes the instrumentation by defining the modules to be patched.
     */
    init(): InstrumentationModuleDefinition;
    /**
     * Core patch logic applying instrumentation to the OpenAI client constructor.
     */
    private _patch;
}
//# sourceMappingURL=instrumentation.d.ts.map