import {v1 as uuidv1} from 'uuid';
import {wrapStack} from './wrap-stack';

export interface GhostErrorOptions {
    message?: string;
    statusCode?: number;
    level?: string;
    id?: string;
    context?: string;
    help?: string;
    errorType?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorDetails?: any;
    code?: string;
    property?: string;
    redirect?: string;
    hideStack?: boolean;
    err?: Error | string;
}

export class GhostError extends Error {
    statusCode: number;
    errorType: string;
    level: string;
    id: string;
    context?: string;
    help?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorDetails: any;
    code: string | null;
    property: string | null;
    redirect: string | null;
    hideStack: boolean;

    constructor(options: GhostErrorOptions = {}) {
        super();

        /**
         * defaults
         */
        this.statusCode = 500;
        this.errorType = 'InternalServerError';
        this.level = 'normal';
        this.message = 'The server has encountered an error.';
        this.id = uuidv1();

        /**
         * custom overrides
         */
        this.id = options.id || this.id;
        this.statusCode = options.statusCode || this.statusCode;
        this.level = options.level || this.level;
        this.context = options.context;
        this.help = options.help;
        this.errorType = this.name = options.errorType || this.errorType;
        this.errorDetails = options.errorDetails;
        this.code = options.code || null;
        this.property = options.property || null;
        this.redirect = options.redirect || null;

        this.message = options.message || this.message;
        this.hideStack = options.hideStack || false;

        // NOTE: Error to inherit from, override!
        //       Nested objects are getting copied over in one piece (can be changed, but not needed right now)
        if (options.err) {
            // CASE: Support err as string (it happens that third party libs return a string instead of an error instance)
            if (typeof options.err === 'string') {
                /* eslint-disable no-restricted-syntax */
                options.err = new Error(options.err);
                /* eslint-enable no-restricted-syntax */
            }

            Object.getOwnPropertyNames(options.err).forEach((property) => {
                if (['errorType', 'name', 'statusCode', 'message', 'level'].indexOf(property) !== -1) {
                    return;
                }

                // CASE: `code` should put options as priority over err
                if (property === 'code') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this[property] = this[property] || (options.err as any)[property];
                    return;
                }

                if (property === 'stack' && !this.hideStack) {
                    this[property] = wrapStack(this, options.err as Error);
                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this as any)[property] = (options.err as any)[property] || (this as any)[property];
            });
        }
    }
}
