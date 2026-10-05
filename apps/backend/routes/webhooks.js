const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const { query } = require('../config/postgres');
const logger    = require('../utils/logger');

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Stripe webhook signature error', { error: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const orderId = event.data.object.metadata?.order_id;
    if (orderId) {
      await query(`UPDATE orders SET status = 'confirmed', updated_at = NOW() WHERE id = $1`, [orderId]);
      await query(`UPDATE payments SET status = 'succeeded' WHERE provider_id = $1`, [event.data.object.id]);
    }
  }

  res.json({ received: true });
});

router.post('/wompi', async (req, res) => {
  try {
    const { event } = req.body;
    if (event?.transaction?.status === 'APPROVED') {
      const orderId = event.transaction.reference;
      await query(`UPDATE orders SET status = 'confirmed', updated_at = NOW() WHERE order_number = $1`, [orderId]);
    }
    res.json({ ok: true });
  } catch (err) {
    logger.error('Wompi webhook error', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

const express = require('express');
module.exports = router;
