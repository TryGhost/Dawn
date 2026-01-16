Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const instrumentationIoredis = require('@opentelemetry/instrumentation-ioredis');
const instrumentationRedis4 = require('@opentelemetry/instrumentation-redis-4');
const core = require('@sentry/core');
const nodeCore = require('@sentry/node-core');
const redisCache = require('../../utils/redisCache.js');

const INTEGRATION_NAME = 'Redis';

let _redisOptions = {};

const cacheResponseHook = (span, redisCommand, cmdArgs, response) => {
  span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.redis');

  const safeKey = redisCache.getCacheKeySafely(redisCommand, cmdArgs);
  const cacheOperation = redisCache.getCacheOperation(redisCommand);

  if (
    !safeKey ||
    !cacheOperation ||
    !_redisOptions.cachePrefixes ||
    !redisCache.shouldConsiderForCache(redisCommand, safeKey, _redisOptions.cachePrefixes)
  ) {
    // not relevant for cache
    return;
  }

  // otel/ioredis seems to be using the old standard, as there was a change to those params: https://github.com/open-telemetry/opentelemetry-specification/issues/3199
  // We are using params based on the docs: https://opentelemetry.io/docs/specs/semconv/attributes-registry/network/
  const networkPeerAddress = core.spanToJSON(span).data['net.peer.name'];
  const networkPeerPort = core.spanToJSON(span).data['net.peer.port'];
  if (networkPeerPort && networkPeerAddress) {
    span.setAttributes({ 'network.peer.address': networkPeerAddress, 'network.peer.port': networkPeerPort });
  }

  const cacheItemSize = redisCache.calculateCacheItemSize(response);

  if (cacheItemSize) {
    span.setAttribute(core.SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE, cacheItemSize);
  }

  if (redisCache.isInCommands(redisCache.GET_COMMANDS, redisCommand) && cacheItemSize !== undefined) {
    span.setAttribute(core.SEMANTIC_ATTRIBUTE_CACHE_HIT, cacheItemSize > 0);
  }

  span.setAttributes({
    [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: cacheOperation,
    [core.SEMANTIC_ATTRIBUTE_CACHE_KEY]: safeKey,
  });

  const spanDescription = safeKey.join(', ');

  span.updateName(core.truncate(spanDescription, 1024));
};

const instrumentIORedis = nodeCore.generateInstrumentOnce('IORedis', () => {
  return new instrumentationIoredis.IORedisInstrumentation({
    responseHook: cacheResponseHook,
  });
});

const instrumentRedis4 = nodeCore.generateInstrumentOnce('Redis-4', () => {
  return new instrumentationRedis4.RedisInstrumentation({
    responseHook: cacheResponseHook,
  });
});

/** To be able to preload all Redis OTel instrumentations with just one ID ("Redis"), all the instrumentations are generated in this one function  */
const instrumentRedis = Object.assign(
  () => {
    instrumentIORedis();
    instrumentRedis4();

    // todo: implement them gradually
    // new LegacyRedisInstrumentation({}),
  },
  { id: INTEGRATION_NAME },
);

const _redisIntegration = ((options = {}) => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      _redisOptions = options;
      instrumentRedis();
    },
  };
}) ;

/**
 * Adds Sentry tracing instrumentation for the [redis](https://www.npmjs.com/package/redis) and
 * [ioredis](https://www.npmjs.com/package/ioredis) libraries.
 *
 * For more information, see the [`redisIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/redis/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.redisIntegration()],
 * });
 * ```
 */
const redisIntegration = core.defineIntegration(_redisIntegration);

exports.instrumentRedis = instrumentRedis;
exports.redisIntegration = redisIntegration;
//# sourceMappingURL=redis.js.map
