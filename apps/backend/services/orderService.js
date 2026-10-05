const { query }       = require('../config/postgres');
const { v4: uuidv4 }  = require('uuid');
const emailService    = require('./emailService');

async function createOrder({ userId, guestEmail, items, couponCode, shippingAddress, billingAddress }) {
  const orderNumber = `MM-${Date.now()}`;

  let subtotal = 0;
  for (const item of items) {
    const { rows } = await query('SELECT price, stock FROM product_variants WHERE id = $1', [item.variant_id]);
    if (!rows.length || rows[0].stock < item.quantity) throw new Error(`Stock insuficiente: ${item.variant_id}`);
    subtotal += rows[0].price * item.quantity;
    item.unit_price = rows[0].price;
  }

  let discount = 0;
  if (couponCode) {
    const { rows } = await query(
      `SELECT * FROM coupons WHERE code = $1 AND is_active = true AND (expires_at IS NULL OR expires_at > NOW())
       AND (usage_limit IS NULL OR used_count < usage_limit)`,
      [couponCode.toUpperCase()]
    );
    if (rows.length) {
      discount = subtotal * (rows[0].discount_percent / 100);
    }
  }

  const total = subtotal - discount;

  const { rows: [order] } = await query(
    `INSERT INTO orders (order_number, user_id, guest_email, status, subtotal, discount, total, coupon_code, shipping_address, billing_address)
     VALUES ($1, $2, $3, 'pending', $4, $5, $6, $7, $8, $9) RETURNING *`,
    [orderNumber, userId || null, guestEmail || null, subtotal, discount, total, couponCode || null,
     JSON.stringify(shippingAddress), JSON.stringify(billingAddress)]
  );

  for (const item of items) {
    const { rows: [product] } = await query('SELECT name, sku FROM products WHERE id = $1', [item.product_id]);
    await query(
      `INSERT INTO order_items (order_id, product_id, variant_id, name, sku, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [order.id, item.product_id, item.variant_id, product.name, product.sku,
       item.quantity, item.unit_price, item.unit_price * item.quantity]
    );
  }

  return order;
}

async function updateOrderStatus(orderId, status, { trackingNumber, notes } = {}) {
  await query(
    `UPDATE orders SET status = $2, tracking_number = COALESCE($3, tracking_number),
     notes = COALESCE($4, notes), updated_at = NOW() WHERE id = $1`,
    [orderId, status, trackingNumber || null, notes || null]
  );

  if (status === 'shipped' && trackingNumber) {
    const { rows } = await query(
      `SELECT o.*, u.email FROM orders o LEFT JOIN users u ON u.id = o.user_id WHERE o.id = $1`, [orderId]
    );
    if (rows.length) {
      const email = rows[0].email || rows[0].guest_email;
      if (email) {
        await emailService.sendOrderShipped({ email, orderNumber: rows[0].order_number, trackingNumber });
      }
    }
  }
}

module.exports = { createOrder, updateOrderStatus };
