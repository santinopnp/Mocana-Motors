const router    = require('express').Router();
const { chat }  = require('../services/motoAIService');
const { query } = require('../config/postgres');

router.post('/', async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) return res.status(400).json({ error: 'message y sessionId requeridos' });

    const { rows } = await query(
      `SELECT messages FROM chat_conversations WHERE session_id = $1 ORDER BY updated_at DESC LIMIT 1`,
      [sessionId]
    );

    const history = rows.length ? rows[0].messages : [];
    history.push({ role: 'user', content: message });

    const lastN   = history.slice(-20);
    const response = await chat({ messages: lastN, sessionId });

    history.push({ role: 'assistant', content: response });

    await query(
      `INSERT INTO chat_conversations (session_id, user_id, messages)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [sessionId, req.user?.id || null, JSON.stringify(history)]
    );
    await query(
      `UPDATE chat_conversations SET messages = $2, updated_at = NOW() WHERE session_id = $1`,
      [sessionId, JSON.stringify(history)]
    );

    res.json({ response });
  } catch (err) { next(err); }
});

module.exports = router;
