const rateLimit = require('express-rate-limit');

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos de autenticación' },
});

module.exports = { defaultLimiter, authLimiter };
