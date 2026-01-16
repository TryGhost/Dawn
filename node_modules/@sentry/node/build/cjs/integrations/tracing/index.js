Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const index = require('../http/index.js');
const amqplib = require('./amqplib.js');
const connect = require('./connect.js');
const express = require('./express.js');
const index$1 = require('./fastify/index.js');
const genericPool = require('./genericPool.js');
const graphql = require('./graphql.js');
const index$2 = require('./hapi/index.js');
const kafka = require('./kafka.js');
const koa = require('./koa.js');
const lrumemoizer = require('./lrumemoizer.js');
const mongo = require('./mongo.js');
const mongoose = require('./mongoose.js');
const mysql = require('./mysql.js');
const mysql2 = require('./mysql2.js');
const index$4 = require('./openai/index.js');
const postgres = require('./postgres.js');
const postgresjs = require('./postgresjs.js');
const prisma = require('./prisma.js');
const redis = require('./redis.js');
const tedious = require('./tedious.js');
const index$3 = require('./vercelai/index.js');

/**
 * With OTEL, all performance integrations will be added, as OTEL only initializes them when the patched package is actually required.
 */
function getAutoPerformanceIntegrations() {
  return [
    express.expressIntegration(),
    index$1.fastifyIntegration(),
    graphql.graphqlIntegration(),
    mongo.mongoIntegration(),
    mongoose.mongooseIntegration(),
    mysql.mysqlIntegration(),
    mysql2.mysql2Integration(),
    redis.redisIntegration(),
    postgres.postgresIntegration(),
    prisma.prismaIntegration(),
    index$2.hapiIntegration(),
    koa.koaIntegration(),
    connect.connectIntegration(),
    tedious.tediousIntegration(),
    genericPool.genericPoolIntegration(),
    kafka.kafkaIntegration(),
    amqplib.amqplibIntegration(),
    lrumemoizer.lruMemoizerIntegration(),
    index$3.vercelAIIntegration(),
    index$4.openAIIntegration(),
    postgresjs.postgresJsIntegration(),
  ];
}

/**
 * Get a list of methods to instrument OTEL, when preload instrumentation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOpenTelemetryInstrumentationToPreload() {
  return [
    index.instrumentOtelHttp,
    express.instrumentExpress,
    express.instrumentExpressV5,
    connect.instrumentConnect,
    index$1.instrumentFastify,
    index$1.instrumentFastifyV3,
    index$2.instrumentHapi,
    kafka.instrumentKafka,
    koa.instrumentKoa,
    lrumemoizer.instrumentLruMemoizer,
    mongo.instrumentMongo,
    mongoose.instrumentMongoose,
    mysql.instrumentMysql,
    mysql2.instrumentMysql2,
    postgres.instrumentPostgres,
    index$2.instrumentHapi,
    graphql.instrumentGraphql,
    redis.instrumentRedis,
    tedious.instrumentTedious,
    genericPool.instrumentGenericPool,
    amqplib.instrumentAmqplib,
    index$3.instrumentVercelAi,
    index$4.instrumentOpenAi,
    postgresjs.instrumentPostgresJs,
  ];
}

exports.getAutoPerformanceIntegrations = getAutoPerformanceIntegrations;
exports.getOpenTelemetryInstrumentationToPreload = getOpenTelemetryInstrumentationToPreload;
//# sourceMappingURL=index.js.map
