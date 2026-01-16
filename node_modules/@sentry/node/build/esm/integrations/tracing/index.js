import { instrumentOtelHttp } from '../http/index.js';
import { instrumentAmqplib, amqplibIntegration } from './amqplib.js';
import { instrumentConnect, connectIntegration } from './connect.js';
import { instrumentExpress, instrumentExpressV5, expressIntegration } from './express.js';
import { instrumentFastify, instrumentFastifyV3, fastifyIntegration } from './fastify/index.js';
import { instrumentGenericPool, genericPoolIntegration } from './genericPool.js';
import { instrumentGraphql, graphqlIntegration } from './graphql.js';
import { instrumentHapi, hapiIntegration } from './hapi/index.js';
import { instrumentKafka, kafkaIntegration } from './kafka.js';
import { instrumentKoa, koaIntegration } from './koa.js';
import { instrumentLruMemoizer, lruMemoizerIntegration } from './lrumemoizer.js';
import { instrumentMongo, mongoIntegration } from './mongo.js';
import { instrumentMongoose, mongooseIntegration } from './mongoose.js';
import { instrumentMysql, mysqlIntegration } from './mysql.js';
import { instrumentMysql2, mysql2Integration } from './mysql2.js';
import { instrumentOpenAi, openAIIntegration } from './openai/index.js';
import { instrumentPostgres, postgresIntegration } from './postgres.js';
import { instrumentPostgresJs, postgresJsIntegration } from './postgresjs.js';
import { prismaIntegration } from './prisma.js';
import { instrumentRedis, redisIntegration } from './redis.js';
import { instrumentTedious, tediousIntegration } from './tedious.js';
import { instrumentVercelAi, vercelAIIntegration } from './vercelai/index.js';

/**
 * With OTEL, all performance integrations will be added, as OTEL only initializes them when the patched package is actually required.
 */
function getAutoPerformanceIntegrations() {
  return [
    expressIntegration(),
    fastifyIntegration(),
    graphqlIntegration(),
    mongoIntegration(),
    mongooseIntegration(),
    mysqlIntegration(),
    mysql2Integration(),
    redisIntegration(),
    postgresIntegration(),
    prismaIntegration(),
    hapiIntegration(),
    koaIntegration(),
    connectIntegration(),
    tediousIntegration(),
    genericPoolIntegration(),
    kafkaIntegration(),
    amqplibIntegration(),
    lruMemoizerIntegration(),
    vercelAIIntegration(),
    openAIIntegration(),
    postgresJsIntegration(),
  ];
}

/**
 * Get a list of methods to instrument OTEL, when preload instrumentation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOpenTelemetryInstrumentationToPreload() {
  return [
    instrumentOtelHttp,
    instrumentExpress,
    instrumentExpressV5,
    instrumentConnect,
    instrumentFastify,
    instrumentFastifyV3,
    instrumentHapi,
    instrumentKafka,
    instrumentKoa,
    instrumentLruMemoizer,
    instrumentMongo,
    instrumentMongoose,
    instrumentMysql,
    instrumentMysql2,
    instrumentPostgres,
    instrumentHapi,
    instrumentGraphql,
    instrumentRedis,
    instrumentTedious,
    instrumentGenericPool,
    instrumentAmqplib,
    instrumentVercelAi,
    instrumentOpenAi,
    instrumentPostgresJs,
  ];
}

export { getAutoPerformanceIntegrations, getOpenTelemetryInstrumentationToPreload };
//# sourceMappingURL=index.js.map
