const router  = require('express').Router();
const { register, login } = require('../services/userService');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const result = await register({ email, password, firstName, lastName, phone });
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const result = await login({ email, password });
    res.json(result);
  } catch (err) { next(err); }
});

module.exports = router;
