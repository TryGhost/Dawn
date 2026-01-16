import {GhostError, GhostErrorOptions} from './GhostError';

const mergeOptions = (options: GhostErrorOptions, defaults: GhostErrorOptions) => {
    const result = {...defaults};

    // Ignore undefined options - for example passing statusCode: undefined should not override the default
    (Object.keys(options) as (keyof GhostErrorOptions)[]).forEach((key) => {
        if (options[key] !== undefined) {
            result[key] = options[key];
        }
    });

    return result;
};

export class InternalServerError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 500,
            level: 'critical',
            errorType: 'InternalServerError',
            message: 'The server has encountered an error.'
        }));
    }
}

export class IncorrectUsageError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 400,
            level: 'critical',
            errorType: 'IncorrectUsageError',
            message: 'We detected a misuse. Please read the stack trace.'
        }));
    }
}

export class NotFoundError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 404,
            errorType: 'NotFoundError',
            message: 'Resource could not be found.',
            hideStack: true
        }));
    }
}

export class BadRequestError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 400,
            errorType: 'BadRequestError',
            message: 'The request could not be understood.'
        }));
    }
}

export class UnauthorizedError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 401,
            errorType: 'UnauthorizedError',
            message: 'You are not authorised to make this request.'
        }));
    }
}

export class NoPermissionError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 403,
            errorType: 'NoPermissionError',
            message: 'You do not have permission to perform this request.'
        }));
    }
}

export class ValidationError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 422,
            errorType: 'ValidationError',
            message: 'The request failed validation.'
        }));
    }
}

export class UnsupportedMediaTypeError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 415,
            errorType: 'UnsupportedMediaTypeError',
            message: 'The media in the request is not supported by the server.'
        }));
    }
}

export class TooManyRequestsError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 429,
            errorType: 'TooManyRequestsError',
            message: 'Server has received too many similar requests in a short space of time.'
        }));
    }
}

export class MaintenanceError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 503,
            errorType: 'MaintenanceError',
            message: 'The server is temporarily down for maintenance.'
        }));
    }
}

export class MethodNotAllowedError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 405,
            errorType: 'MethodNotAllowedError',
            message: 'Method not allowed for resource.'
        }));
    }
}

export class RequestNotAcceptableError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 406,
            errorType: 'RequestNotAcceptableError',
            message: 'Request not acceptable for provided Accept-Version header.',
            hideStack: true
        }));
    }
}

export class RangeNotSatisfiableError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 416,
            errorType: 'RangeNotSatisfiableError',
            message: 'Range not satisfiable for provided Range header.',
            hideStack: true
        }));
    }
}

export class RequestEntityTooLargeError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 413,
            errorType: 'RequestEntityTooLargeError',
            message: 'Request was too big for the server to handle.'
        }));
    }
}

export class TokenRevocationError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 503,
            errorType: 'TokenRevocationError',
            message: 'Token is no longer available.'
        }));
    }
}

export class VersionMismatchError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 400,
            errorType: 'VersionMismatchError',
            message: 'Requested version does not match server version.'
        }));
    }
}

export class DataExportError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 500,
            errorType: 'DataExportError',
            message: 'The server encountered an error whilst exporting data.'
        }));
    }
}

export class DataImportError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 500,
            errorType: 'DataImportError',
            message: 'The server encountered an error whilst importing data.'
        }));
    }
}

export class EmailError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 500,
            errorType: 'EmailError',
            message: 'The server encountered an error whilst sending email.'
        }));
    }
}

export class ThemeValidationError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 422,
            errorType: 'ThemeValidationError',
            message: 'The theme has a validation error.',
            errorDetails: {}
        }));
    }
}

export class DisabledFeatureError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 409,
            errorType: 'DisabledFeatureError',
            message: 'Unable to complete the request, this feature is disabled.'
        }));
    }
}

export class UpdateCollisionError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            statusCode: 409,
            errorType: 'UpdateCollisionError',
            message: 'Unable to complete the request, there was a conflict.'
        }));
    }
}

export class HostLimitError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            errorType: 'HostLimitError',
            hideStack: true,
            statusCode: 403,
            message: 'Unable to complete the request, this resource is limited.'
        }));
    }
}

export class HelperWarning extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            errorType: 'HelperWarning',
            hideStack: true,
            statusCode: 400,
            message: 'A theme helper has done something unexpected.'
        }));
    }
}

export class PasswordResetRequiredError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            errorType: 'PasswordResetRequiredError',
            statusCode: 401,
            message: 'For security, you need to create a new password. An email has been sent to you with instructions!'
        }));
    }
}

export class UnhandledJobError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            errorType: 'UnhandledJobError',
            message: 'Processed job threw an unhandled error',
            level: 'critical'
        }));
    }
}

export class NoContentError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            errorType: 'NoContentError',
            statusCode: 204,
            hideStack: true
        }));
    }
}

export class ConflictError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            errorType: 'ConflictError',
            statusCode: 409,
            message: 'The server has encountered an conflict.'
        }));
    }
}

export class MigrationError extends GhostError {
    constructor(options: GhostErrorOptions = {}) {
        super(mergeOptions(options, {
            errorType: 'MigrationError',
            message: 'An error has occurred applying a database migration.',
            level: 'critical'
        }));
    }
}
