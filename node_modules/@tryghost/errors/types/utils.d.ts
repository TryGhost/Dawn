import { GhostError } from './GhostError';
type AnyObject = Record<string, any>;
/**
 * @description Serialize GhostError instance to error JSON format
 *
 * jsonapi.org error format:
 *
 *  source: {
 *      parameter: URL query parameter (no support yet)
 *      pointer: HTTP body attribute
 *  }
 *
 * @see http://jsonapi.org/format/#errors
 */
export declare function serialize(err: GhostError, options?: {
    format: 'jsonapi' | 'oauth';
}): AnyObject;
/**
 * @description Deserialize from error JSON format to GhostError instance
 */
export declare function deserialize(errorFormat: AnyObject): AnyObject;
/**
 * @description Replace the stack with a user-facing one
 * @returns Clone of the original error with a user-facing stack
 */
export declare function prepareStackForUser(error: GhostError): GhostError;
export declare function prepareStackForUser(error: Error): Error;
/**
 * @description Check whether an error instance is a GhostError.
 */
export declare function isGhostError(err: Error): boolean;
export {};
//# sourceMappingURL=utils.d.ts.map