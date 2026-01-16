import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import type { ExpressInstrumentationConfig, ExpressRequestInfo } from './types';
export declare const PACKAGE_VERSION = "0.1.0";
export declare const PACKAGE_NAME = "@sentry/instrumentation-express-v5";
/** Express instrumentation for OpenTelemetry */
export declare class ExpressInstrumentationV5 extends InstrumentationBase<ExpressInstrumentationConfig> {
    constructor(config?: ExpressInstrumentationConfig);
    init(): InstrumentationNodeModuleDefinition[];
    private _setup;
    private _tearDown;
    /**
     * Get the patch for Router.route function
     */
    private _getRoutePatch;
    /**
     * Get the patch for Router.use function
     */
    private _getRouterUsePatch;
    /**
     * Get the patch for Application.use function
     */
    private _getAppUsePatch;
    /** Patch each express layer to create span and propagate context */
    private _applyPatch;
    _getSpanName(info: ExpressRequestInfo, defaultName: string): string;
}
//# sourceMappingURL=instrumentation.d.ts.map