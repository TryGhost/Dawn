import { Log, LogSeverityLevel, ParameterizedString } from '@sentry/core';
export type CaptureLogArgs = [
    /*message*/ ParameterizedString,
    /*attributes*/ Log['attributes']
] | [
    /*messageTemplate*/ string,
    /*messageParams*/ Array<unknown>,
    /*attributes*/ Log['attributes']
];
/**
 * Capture a log with the given level.
 *
 * @param level - The level of the log.
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., userId: 100.
 */
export declare function captureLog(level: LogSeverityLevel, ...args: CaptureLogArgs): void;
//# sourceMappingURL=capture.d.ts.map
