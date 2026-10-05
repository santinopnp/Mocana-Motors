const Redis  = require('ioredis');
const logger = require('../utils/logger');

let redis;

async function connectRedis() {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
  await redis.connect();
  logger.info('Redis conectado');
  return redis;
}

function getRedis() {
  return redis;
}

module.exports = { connectRedis, getRedis };
