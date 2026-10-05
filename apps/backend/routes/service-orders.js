const router  = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { createServiceOrder } = require('../services/serviceOrderService');
const { query } = require('../config/postgres');

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { motoPlate, motoBrand, motoModel, motoYear, serviceType, description, scheduledAt } = req.body;
    if (!motoPlate || !serviceType || !description) {
      return res.status(400).json({ error: 'motoPlate, serviceType y description son requeridos' });
    }
    const order = await createServiceOrder({
      userId: req.user.id, motoPlate, motoBrand, motoModel, motoYear,
      serviceType, description, scheduledAt,
    });
    res.status(201).json(order);
  } catch (err) { next(err); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, service_number, moto_plate, moto_brand, moto_model, service_type,
              status, estimated_cost, final_cost, scheduled_at, created_at
       FROM service_orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM service_orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Orden no encontrada' });

    const { rows: parts } = await query(
      'SELECT * FROM service_order_parts WHERE service_order_id = $1', [req.params.id]
    );
    res.json({ ...rows[0], parts });
  } catch (err) { next(err); }
});

module.exports = router;
