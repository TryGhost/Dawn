import {GhostError} from './GhostError';
import * as ghostErrors from './errors';
import {deserialize, isGhostError, prepareStackForUser, serialize} from './utils';

export * from './errors';
export type {GhostError};
export default ghostErrors;

export const utils = {
    serialize,
    deserialize,
    isGhostError,
    prepareStackForUser
};
