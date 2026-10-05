require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const compression = require('compression');
const morgan     = require('morgan');
const { createServer } = require('http');
const logger     = require('./utils/logger');
const { connectPostgres } = require('./config/postgres');
const { connectRedis }    = require('./config/redis');
const { defaultLimiter }  = require('./middleware/rateLimiter');

const app        = express();
const httpServer = createServer(app);

// ── Security & middleware ────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(defaultLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/catalog',        require('./routes/catalog'));
app.use('/api/orders',         require('./routes/orders'));
app.use('/api/service-orders', require('./routes/service-orders'));
app.use('/api/payment',        require('./routes/payment'));
app.use('/api/chat',           require('./routes/chat'));
app.use('/api/admin',          require('./routes/admin'));
app.use('/api/webhooks',       require('./routes/webhooks'));

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'Mocana Motors API', ts: Date.now() }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

// ── Boot ─────────────────────────────────────────────────────────────────────
async function boot() {
  await connectPostgres();
  await connectRedis();

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    logger.info(`Mocana Motors backend corriendo en :${PORT}`);
  });
}

boot().catch((err) => {
  logger.error('Boot failed', { error: err.message });
  process.exit(1);
});

module.exports = app;
