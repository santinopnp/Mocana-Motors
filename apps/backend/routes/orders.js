const router  = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { createOrder } = require('../services/orderService');
const { query } = require('../config/postgres');

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { items, couponCode, shippingAddress, billingAddress } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Items requeridos' });
    const order = await createOrder({
      userId: req.user.id, items, couponCode, shippingAddress, billingAddress,
    });
    res.status(201).json(order);
  } catch (err) { next(err); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT o.id, o.order_number, o.status, o.total, o.currency, o.created_at,
              json_agg(json_build_object('name', oi.name, 'sku', oi.sku, 'quantity', oi.quantity,
                'unit_price', oi.unit_price)) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT o.*, json_agg(json_build_object(
          'name', oi.name, 'sku', oi.sku, 'quantity', oi.quantity,
          'unit_price', oi.unit_price, 'total_price', oi.total_price)) AS items
       FROM orders o JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1 AND o.user_id = $2 GROUP BY o.id`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
