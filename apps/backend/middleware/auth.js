const jwt    = require('jsonwebtoken');
const { query } = require('../config/postgres');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query('SELECT id, email, role, is_active FROM users WHERE id = $1', [payload.sub]);
    if (!rows.length || !rows[0].is_active) return res.status(401).json({ error: 'Usuario inválido' });
    req.user = rows[0];
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'staff') {
    return res.status(403).json({ error: 'Acceso restringido' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
