import * as logger from 'bunyan';

export = BunyanLoggly;

declare class BunyanLoggly implements logger.Stream {
    constructor(
        options: BunyanLoggly.IOptions,
        bufferLength?: number,
        bufferTimeout?: number,
        logglyCallback?: Function,
    );
}

declare namespace BunyanLoggly {
    interface IOptions {
        token: string;
        subdomain: string;
        tags?: string[];
        json?: boolean;
        isBulk?: boolean;
        host?: string;
        auth?: {
            username: string;
            password: string;
        };
    }
}
