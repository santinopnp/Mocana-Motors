const router  = require('express').Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { query } = require('../config/postgres');
const { updateOrderStatus }    = require('../services/orderService');
const { createServiceOrder, updateServiceOrder } = require('../services/serviceOrderService');
const { getRevenueSummary }    = require('../services/zohoBooksService');
const { listTickets, replyTicket } = require('../services/zohoDeskService');
const { searchContacts, updateContact } = require('../services/zohoCrmService');
const { getCampaignStats }     = require('../services/zohoCampaignsService');
const emailService             = require('../services/emailService');

router.use(requireAuth, requireAdmin);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard', async (req, res, next) => {
  try {
    const [orders, serviceOrders, monthRevenue, customers, lowStock, topProducts] = await Promise.all([
      query(`SELECT status, COUNT(*) AS count FROM orders GROUP BY status`),
      query(`SELECT status, COUNT(*) AS count FROM service_orders GROUP BY status`),
      query(`SELECT COALESCE(SUM(total),0) AS total FROM orders WHERE status IN ('confirmed','processing','shipped','delivered') AND created_at > NOW() - INTERVAL '30 days'`),
      query(`SELECT COUNT(*) AS count FROM users WHERE role = 'customer'`),
      query(`SELECT pv.id, pv.sku, pv.stock, p.name, p.brand FROM product_variants pv JOIN products p ON p.id = pv.product_id WHERE pv.stock < 3 ORDER BY pv.stock`),
      query(`SELECT p.name, p.brand, SUM(oi.quantity) AS sold FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY p.id, p.name, p.brand ORDER BY sold DESC LIMIT 5`),
    ]);
    res.json({
      orders:           orders.rows,
      service_orders:   serviceOrders.rows,
      monthly_revenue:  monthRevenue.rows[0].total,
      total_customers:  customers.rows[0].count,
      low_stock_alerts: lowStock.rows,
      top_products:     topProducts.rows,
    });
  } catch (err) { next(err); }
});

// ── Órdenes de venta ──────────────────────────────────────────────────────────
router.get('/orders', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const where  = status ? `WHERE o.status = $3` : '';
    const params = status ? [limit, offset, status] : [limit, offset];
    const { rows } = await query(
      `SELECT o.id, o.order_number, o.status, o.total, o.currency, o.created_at,
              u.email AS user_email, u.first_name, u.last_name
       FROM orders o LEFT JOIN users u ON u.id = o.user_id
       ${where} ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { status, tracking_number, notes } = req.body;
    const valid = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Estado inválido' });
    await updateOrderStatus(req.params.id, status, { trackingNumber: tracking_number, notes });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Órdenes de servicio ───────────────────────────────────────────────────────
router.get('/service-orders', async (req, res, next) => {
  try {
    const { status, mechanic_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const conds  = [];
    const params = [];

    if (status)      { params.push(status);      conds.push(`so.status = $${params.length}`); }
    if (mechanic_id) { params.push(mechanic_id); conds.push(`so.mechanic_id = $${params.length}`); }

    params.push(limit, offset);
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    const { rows } = await query(
      `SELECT so.*, u.first_name, u.last_name, u.email,
              m.first_name AS mechanic_first, m.last_name AS mechanic_last
       FROM service_orders so
       LEFT JOIN users u ON u.id = so.user_id
       LEFT JOIN users m ON m.id = so.mechanic_id
       ${where} ORDER BY so.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/service-orders', async (req, res, next) => {
  try {
    const { customer_id, moto_plate, moto_brand, moto_model, moto_year,
            service_type, description, scheduled_at, mechanic_id, estimated_cost } = req.body;
    const order = await createServiceOrder({
      userId: customer_id, mechanicId: mechanic_id, motoPlate: moto_plate,
      motoBrand: moto_brand, motoModel: moto_model, motoYear: moto_year,
      serviceType: service_type, description, scheduledAt: scheduled_at, estimatedCost: estimated_cost,
    });
    res.status(201).json(order);
  } catch (err) { next(err); }
});

router.patch('/service-orders/:id', async (req, res, next) => {
  try {
    const { status, mechanic_notes, parts_used, final_cost } = req.body;
    await updateServiceOrder(req.params.id, {
      status, mechanicNotes: mechanic_notes, partsUsed: parts_used, finalCost: final_cost,
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Productos ─────────────────────────────────────────────────────────────────
router.get('/products', async (req, res, next) => {
  try {
    const { category, brand, search, limit = 50 } = req.query;
    const conds  = [];
    const params = [];

    if (category) { params.push(category); conds.push(`c.slug = $${params.length}`); }
    if (brand)    { params.push(`%${brand}%`); conds.push(`p.brand ILIKE $${params.length}`); }
    if (search)   { params.push(`%${search}%`); conds.push(`(p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length})`); }

    params.push(limit);
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    const { rows } = await query(
      `SELECT p.id, p.sku, p.name, p.brand, p.model, p.price, p.currency, p.is_active,
              c.slug AS category, COALESCE(SUM(pv.stock), 0) AS total_stock
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = true
       ${where}
       GROUP BY p.id, c.slug ORDER BY p.brand, p.name
       LIMIT $${params.length}`,
      params
    );
    res.json({ products: rows });
  } catch (err) { next(err); }
});

router.patch('/products/variants/:id/inventory', async (req, res, next) => {
  try {
    const { quantity, reason, notes } = req.body;
    const { rows: [v] } = await query('SELECT stock FROM product_variants WHERE id = $1', [req.params.id]);
    if (!v) return res.status(404).json({ error: 'Variante no encontrada' });
    const delta = quantity - v.stock;
    await query('UPDATE product_variants SET stock = $2 WHERE id = $1', [req.params.id, quantity]);
    await query(
      `INSERT INTO inventory_movements (variant_id, delta, reason, notes, created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [req.params.id, delta, reason || 'count_adjustment', notes || null, req.user.id]
    );
    res.json({ ok: true, new_stock: quantity, delta });
  } catch (err) { next(err); }
});

router.patch('/products/variants/:id/price', async (req, res, next) => {
  try {
    const { price, compare_price } = req.body;
    await query(
      'UPDATE product_variants SET price = $2, compare_price = $3 WHERE id = $1',
      [req.params.id, price, compare_price || null]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ── Clientes ─────────────────────────────────────────────────────────────────
router.get('/customers', async (req, res, next) => {
  try {
    const { search, limit = 20 } = req.query;
    const params = [limit];
    let where = `WHERE u.role = 'customer'`;
    if (search) {
      params.push(`%${search}%`);
      where += ` AND (u.email ILIKE $${params.length} OR u.first_name ILIKE $${params.length} OR u.phone ILIKE $${params.length}
                  OR EXISTS (SELECT 1 FROM customer_motorcycles cm WHERE cm.user_id = u.id AND cm.plate ILIKE $${params.length}))`;
    }
    const { rows } = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
              COUNT(DISTINCT o.id) AS total_orders,
              COALESCE(SUM(o.total), 0) AS lifetime_value,
              COUNT(DISTINCT cm.id) AS registered_motos
       FROM users u
       LEFT JOIN orders o  ON o.user_id  = u.id AND o.status NOT IN ('cancelled','refunded')
       LEFT JOIN customer_motorcycles cm ON cm.user_id = u.id
       ${where}
       GROUP BY u.id ORDER BY lifetime_value DESC LIMIT $1`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/customers/:id', async (req, res, next) => {
  try {
    const [user, orders, serviceOrders, motos] = await Promise.all([
      query('SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = $1', [req.params.id]),
      query('SELECT id, order_number, status, total, currency, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [req.params.id]),
      query('SELECT id, service_number, moto_plate, service_type, status, created_at FROM service_orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [req.params.id]),
      query('SELECT * FROM customer_motorcycles WHERE user_id = $1', [req.params.id]),
    ]);
    if (!user.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ ...user.rows[0], orders: orders.rows, service_orders: serviceOrders.rows, motorcycles: motos.rows });
  } catch (err) { next(err); }
});

// ── DM a cliente ──────────────────────────────────────────────────────────────
router.post('/customers/dm', async (req, res, next) => {
  try {
    const { customer_id, channel, subject, message } = req.body;
    const { rows } = await query('SELECT email, first_name FROM users WHERE id = $1', [customer_id]);
    if (!rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    if (channel === 'email' || !channel) {
      await emailService.send({ to: rows[0].email, subject: subject || 'Mensaje de Mocana Motors', html: message });
    }
    res.json({ ok: true, channel: channel || 'email' });
  } catch (err) { next(err); }
});

// ── Zoho ──────────────────────────────────────────────────────────────────────
router.get('/zoho/revenue', async (req, res, next) => {
  try {
    const { period } = req.query;
    const summary = await getRevenueSummary(period || 'this_month');
    res.json(summary || { message: 'Zoho Books no configurado' });
  } catch (err) { next(err); }
});

router.get('/support/tickets', async (req, res, next) => {
  try {
    const { status, limit } = req.query;
    const data = await listTickets(status || 'open', Number(limit) || 10);
    res.json(data);
  } catch (err) { next(err); }
});

router.post('/support/tickets/:id/reply', async (req, res, next) => {
  try {
    const { message, is_public } = req.body;
    const data = await replyTicket(req.params.id, message, is_public !== false);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/zoho/crm/search', async (req, res, next) => {
  try {
    const { q, module } = req.query;
    const data = await searchContacts(q, module || 'Contacts');
    res.json(data);
  } catch (err) { next(err); }
});

router.patch('/zoho/crm/contacts/:id', async (req, res, next) => {
  try {
    const data = await updateContact(req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/zoho/campaigns', async (req, res, next) => {
  try {
    const data = await getCampaignStats(Number(req.query.limit) || 5);
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
