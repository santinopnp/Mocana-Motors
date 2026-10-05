const router  = require('express').Router();
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const { requireAuth } = require('../middleware/auth');
const { query } = require('../config/postgres');

router.post('/stripe/create-intent', requireAuth, async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const { rows } = await query(
      'SELECT total, currency FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Orden no encontrada' });

    const amount = Math.round(rows[0].total * 100);
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: rows[0].currency.toLowerCase(),
      metadata: { order_id },
    });

    await query(
      `INSERT INTO payments (order_id, provider, provider_id, amount, currency, status)
       VALUES ($1, 'stripe', $2, $3, $4, 'pending')`,
      [order_id, intent.id, rows[0].total, rows[0].currency]
    );

    res.json({ client_secret: intent.client_secret });
  } catch (err) { next(err); }
});

router.post('/wompi/confirm', requireAuth, async (req, res, next) => {
  try {
    const { order_id, transaction_id, status } = req.body;

    await query(
      `INSERT INTO payments (order_id, provider, provider_id, amount, currency, status)
       SELECT id, 'wompi', $2, total, currency, $3 FROM orders WHERE id = $1`,
      [order_id, transaction_id, status === 'APPROVED' ? 'succeeded' : 'failed']
    );

    if (status === 'APPROVED') {
      await query(`UPDATE orders SET status = 'confirmed' WHERE id = $1`, [order_id]);
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
