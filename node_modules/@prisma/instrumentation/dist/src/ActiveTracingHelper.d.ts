import { Context, TracerProvider } from '@opentelemetry/api';
import { EngineSpan, ExtendedSpanOptions, SpanCallback, TracingHelper } from '@prisma/internals';
type Options = {
    traceMiddleware: boolean;
    tracerProvider: TracerProvider;
    ignoreSpanTypes: (string | RegExp)[];
};
export declare class ActiveTracingHelper implements TracingHelper {
    private traceMiddleware;
    private tracerProvider;
    private ignoreSpanTypes;
    constructor({ traceMiddleware, tracerProvider, ignoreSpanTypes }: Options);
    isEnabled(): boolean;
    getTraceParent(context?: Context | undefined): string;
    dispatchEngineSpans(spans: EngineSpan[]): void;
    getActiveContext(): Context | undefined;
    runInChildSpan<R>(options: string | ExtendedSpanOptions, callback: SpanCallback<R>): R;
}
export {};
