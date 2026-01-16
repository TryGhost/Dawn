import deepCopy from '@stdlib/utils-copy';
import {GhostError} from './GhostError';
import * as errors from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>

const errorsWithBase: Record<string, typeof GhostError> = {...errors, GhostError};

const _private = {
    serialize(err: GhostError) {
        try {
            return {
                id: err.id,
                status: err.statusCode,
                code: err.code || err.errorType,
                title: err.name,
                detail: err.message,
                meta: {
                    context: err.context,
                    help: err.help,
                    errorDetails: err.errorDetails,
                    level: err.level,
                    errorType: err.errorType
                }
            };
        } catch (error) {
            return {
                detail: 'Something went wrong.'
            };
        }
    },

    deserialize(obj: AnyObject) {
        return {
            id: obj.id,
            message: obj.detail || obj.error_description || obj.message,
            statusCode: obj.status,
            code: obj.code || obj.error,
            level: obj.meta && obj.meta.level,
            help: obj.meta && obj.meta.help,
            context: obj.meta && obj.meta.context
        };
    },

    /**
     * @description Serialize error instance into oauth format.
     *
     * @see https://tools.ietf.org/html/rfc6749#page-45
     *
     * To not loose any error data when sending errors between internal services, we use the suggested OAuth properties and add ours as well.
     */
    OAuthSerialize(err: GhostError) {
        const matchTable = {
            [errors.NoPermissionError.name]: 'access_denied',
            [errors.MaintenanceError.name]: 'temporarily_unavailable',
            [errors.BadRequestError.name]: 'invalid_request',
            [errors.ValidationError.name]: 'invalid_request',
            default: 'server_error'
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {detail, code, ...properties} = _private.serialize(err);

        return {
            error: err.code || matchTable[err.name] || 'server_error',
            error_description: err.message,
            ...properties
        };
    },

    /**
     * @description Deserialize oauth error format into GhostError instance.
     * @constructor
     */
    OAuthDeserialize(errorFormat: AnyObject): GhostError {
        try {
            return new errorsWithBase[errorFormat.title || errorFormat.name || errors.InternalServerError.name](_private.deserialize(errorFormat));
        } catch (err) {
            // CASE: you receive an OAuth formatted error, but the error prototype is unknown
            return new errors.InternalServerError({
                errorType: errorFormat.title || errorFormat.name,
                ..._private.deserialize(errorFormat)
            });
        }
    },

    /**
     * @description Serialize GhostError instance into jsonapi.org format.
     * @param err
     * @return {Object}
     */
    JSONAPISerialize(err: GhostError): AnyObject {
        const errorFormat: AnyObject = {
            errors: [_private.serialize(err)]
        };

        errorFormat.errors[0].source = {};

        if (err.property) {
            errorFormat.errors[0].source.pointer = '/data/attributes/' + err.property;
        }

        return errorFormat;
    },

    /**
     * @description Deserialize JSON api format into GhostError instance.
     */
    JSONAPIDeserialize(errorFormat: AnyObject): GhostError {
        errorFormat = errorFormat.errors && errorFormat.errors[0] || {};

        let internalError;

        try {
            internalError = new errorsWithBase[errorFormat.title || errorFormat.name || errors.InternalServerError.name](_private.deserialize(errorFormat));
        } catch (err) {
            // CASE: you receive a JSON format error, but the error prototype is unknown
            internalError = new errors.InternalServerError({
                errorType: errorFormat.title || errorFormat.name,
                ..._private.deserialize(errorFormat)
            });
        }

        if (errorFormat.source && errorFormat.source.pointer) {
            internalError.property = errorFormat.source.pointer.split('/')[3];
        }

        return internalError;
    }
};

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
export function serialize(err: GhostError, options?: {format: 'jsonapi' | 'oauth'}) {
    options = options || {format: 'jsonapi'};

    let errorFormat: AnyObject = {};

    try {
        if (options.format === 'jsonapi') {
            errorFormat = _private.JSONAPISerialize(err);
        } else {
            errorFormat = _private.OAuthSerialize(err);
        }
    } catch (error) {
        errorFormat.message = 'Something went wrong.';
    }

    // no need to sanitize the undefined values, on response send JSON.stringify get's called
    return errorFormat;
};

/**
 * @description Deserialize from error JSON format to GhostError instance
 */
export function deserialize(errorFormat: AnyObject): AnyObject {
    let internalError = {};

    if (errorFormat.errors) {
        internalError = _private.JSONAPIDeserialize(errorFormat);
    } else {
        internalError = _private.OAuthDeserialize(errorFormat);
    }

    return internalError;
};

/**
 * @description Replace the stack with a user-facing one
 * @returns Clone of the original error with a user-facing stack
 */
export function prepareStackForUser(error: GhostError): GhostError
export function prepareStackForUser(error: Error): Error
export function prepareStackForUser(error: Error): Error {
    const stackbits = error.stack?.split(/\n/) || [];

    // We build this up backwards, so we always insert at position 1

    const hideStack = 'hideStack' in error && error.hideStack;

    if (process.env.NODE_ENV === 'production' || hideStack) {
        stackbits.splice(1, stackbits.length - 1);
    } else {
        // Clearly mark the strack trace
        stackbits.splice(1, 0, `Stack Trace:`);
    }

    // Add in our custom context and help methods
    if ('help' in error && error.help) {
        stackbits.splice(1, 0, `${error.help}`);
    }

    if ('context' in error && error.context) {
        stackbits.splice(1, 0, `${error.context}`);
    }

    // @NOTE: would be a good idea to swap out the cloning implementation with native
    //        `structuredClone` one once we use Node v17 or higher. Before making an
    //        upgrade make sure structuredClone does a full copy of all properties
    //        present on a custom error (see issue: https://github.com/ungap/structured-clone/issues/12)
    const errorClone = deepCopy(error);
    errorClone.stack = stackbits.join('\n');
    return errorClone;
};

/**
 * @description Check whether an error instance is a GhostError.
 */
export function isGhostError(err: Error) {
    const errorName = GhostError.name;
    const legacyErrorName = 'IgnitionError';

    const recursiveIsGhostError = function recursiveIsGhostError(obj: AnyObject): boolean {
        // no super constructor available anymore
        if (!obj || !obj.name) {
            return false;
        }

        if (obj.name === errorName || obj.name === legacyErrorName) {
            return true;
        }

        return recursiveIsGhostError(Object.getPrototypeOf(obj));
    };

    return recursiveIsGhostError(err.constructor);
};
