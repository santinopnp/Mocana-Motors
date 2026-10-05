const bcrypt          = require('bcryptjs');
const jwt             = require('jsonwebtoken');
const { query }       = require('../config/postgres');
const emailService    = require('./emailService');
const { createContact } = require('./zohoCrmService');

async function register({ email, password, firstName, lastName, phone }) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) throw Object.assign(new Error('Email ya registrado'), { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows: [user] } = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, email, first_name, last_name, role`,
    [email, passwordHash, firstName, lastName, phone]
  );

  emailService.sendWelcome({ email, firstName }).catch(() => {});
  createContact({ email, first_name: firstName, last_name: lastName, phone }).catch(() => {});

  return { user, token: signToken(user.id) };
}

async function login({ email, password }) {
  const { rows } = await query(
    'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
    [email]
  );
  if (!rows.length) throw Object.assign(new Error('Credenciales incorrectas'), { status: 401 });

  const user = rows[0];
  if (!user.is_active) throw Object.assign(new Error('Cuenta desactivada'), { status: 403 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw Object.assign(new Error('Credenciales incorrectas'), { status: 401 });

  await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser, token: signToken(user.id) };
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { register, login };
