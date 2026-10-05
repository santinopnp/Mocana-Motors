const { Pool } = require('pg');
const logger   = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => logger.error('Postgres pool error', { error: err.message }));

async function connectPostgres() {
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  logger.info('PostgreSQL conectado');
}

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query, connectPostgres };
