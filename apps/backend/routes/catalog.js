const router = require('express').Router();
const { query } = require('../config/postgres');

router.get('/categories', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM categories WHERE is_active = true ORDER BY sort_order');
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/products', async (req, res, next) => {
  try {
    const { category, brand, search, featured, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const conds  = ['p.is_active = true'];
    const params = [];

    if (category) {
      params.push(category);
      conds.push(`c.slug = $${params.length}`);
    }
    if (brand) {
      params.push(brand);
      conds.push(`p.brand ILIKE $${params.length}`);
    }
    if (featured === 'true') conds.push('p.is_featured = true');
    if (search) {
      params.push(`%${search}%`);
      conds.push(`(p.name ILIKE $${params.length} OR p.brand ILIKE $${params.length} OR p.model ILIKE $${params.length})`);
    }

    params.push(limit, offset);
    const { rows } = await query(
      `SELECT p.id, p.sku, p.slug, p.name, p.short_desc, p.brand, p.model, p.year,
              p.engine_cc, p.price, p.compare_price, p.currency, p.images, p.is_featured,
              c.name AS category_name, c.slug AS category_slug,
              COALESCE(SUM(pv.stock), 0) AS total_stock
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = true
       WHERE ${conds.join(' AND ')}
       GROUP BY p.id, c.name, c.slug
       ORDER BY p.is_featured DESC, p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    res.json({ products: rows, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
});

router.get('/products/:slug', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*, c.name AS category_name
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.slug = $1 AND p.is_active = true`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });

    const { rows: variants } = await query(
      'SELECT * FROM product_variants WHERE product_id = $1 AND is_active = true ORDER BY price',
      [rows[0].id]
    );

    res.json({ ...rows[0], variants });
  } catch (err) { next(err); }
});

module.exports = router;
