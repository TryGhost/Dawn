import { GhostError } from './GhostError';
import * as ghostErrors from './errors';
import { deserialize, isGhostError, prepareStackForUser, serialize } from './utils';
export * from './errors';
export type { GhostError };
export default ghostErrors;
export declare const utils: {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
    isGhostError: typeof isGhostError;
    prepareStackForUser: typeof prepareStackForUser;
};
//# sourceMappingURL=index.d.ts.map