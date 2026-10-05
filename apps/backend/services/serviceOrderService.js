const { query }      = require('../config/postgres');
const emailService   = require('./emailService');

async function createServiceOrder({
  userId, mechanicId, motoPlate, motoBrand, motoModel, motoYear,
  serviceType, description, scheduledAt, estimatedCost,
}) {
  const serviceNumber = `TALLER-${Date.now()}`;

  const { rows: [order] } = await query(
    `INSERT INTO service_orders
       (service_number, user_id, mechanic_id, moto_plate, moto_brand, moto_model, moto_year,
        service_type, description, status, estimated_cost, scheduled_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'scheduled',$10,$11) RETURNING *`,
    [serviceNumber, userId || null, mechanicId || null, motoPlate, motoBrand || null,
     motoModel || null, motoYear || null, serviceType, description,
     estimatedCost || null, scheduledAt || null]
  );

  if (userId) {
    const { rows } = await query('SELECT email FROM users WHERE id = $1', [userId]);
    if (rows.length) {
      await emailService.sendServiceConfirmation({
        email: rows[0].email,
        serviceNumber,
        serviceType,
        scheduledAt,
        motoPlate,
      });
    }
  }

  return order;
}

async function updateServiceOrder(serviceOrderId, { status, mechanicNotes, partsUsed, finalCost }) {
  await query(
    `UPDATE service_orders
     SET status = $2,
         mechanic_notes = COALESCE($3, mechanic_notes),
         final_cost     = COALESCE($4, final_cost),
         started_at     = CASE WHEN $2 = 'in_progress' AND started_at IS NULL THEN NOW() ELSE started_at END,
         completed_at   = CASE WHEN $2 = 'ready' AND completed_at IS NULL THEN NOW() ELSE completed_at END,
         delivered_at   = CASE WHEN $2 = 'delivered' AND delivered_at IS NULL THEN NOW() ELSE delivered_at END,
         updated_at     = NOW()
     WHERE id = $1`,
    [serviceOrderId, status, mechanicNotes || null, finalCost || null]
  );

  if (partsUsed?.length) {
    for (const part of partsUsed) {
      await query(
        `UPDATE product_variants SET stock = GREATEST(0, stock - $1) WHERE sku = $2`,
        [part.qty, part.sku]
      );
      await query(
        `INSERT INTO inventory_movements (variant_id, delta, reason, ref_id)
         SELECT id, -$1, 'sale', $2 FROM product_variants WHERE sku = $3`,
        [part.qty, serviceOrderId, part.sku]
      );
    }
  }

  if (status === 'ready') {
    const { rows } = await query(
      `SELECT so.service_number, so.moto_plate, u.email
       FROM service_orders so LEFT JOIN users u ON u.id = so.user_id WHERE so.id = $1`,
      [serviceOrderId]
    );
    if (rows.length && rows[0].email) {
      await emailService.sendServiceReady({
        email:         rows[0].email,
        serviceNumber: rows[0].service_number,
        motoPlate:     rows[0].moto_plate,
      });
    }
  }
}

module.exports = { createServiceOrder, updateServiceOrder };
