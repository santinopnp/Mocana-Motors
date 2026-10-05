-- Mocana Motors — seed del catálogo base

-- ── Categorías ───────────────────────────────────────────────────────────────
INSERT INTO categories (slug, name, description, sort_order) VALUES
  ('motorcycles',  'Motocicletas',     'Motos nuevas y usadas',                   1),
  ('helmets',      'Cascos',           'Cascos integrales, modulares y abiertos',  2),
  ('gear',         'Equipamiento',     'Chaquetas, guantes, botas y pantalones',   3),
  ('parts',        'Repuestos',        'Repuestos originales y alternativos',       4),
  ('accessories',  'Accesorios',       'Maletas, espejos, GPS, luces LED',         5),
  ('tools',        'Herramientas',     'Herramientas de moto y taller',            6),
  ('lubricants',   'Lubricantes',      'Aceites, grasas y fluidos',                7)
ON CONFLICT (slug) DO NOTHING;

-- ── Admin user ────────────────────────────────────────────────────────────────
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@mocanamotors.com',
  '$2b$10$placeholder_change_on_first_login',
  'Admin',
  'Mocana',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ── Productos de ejemplo ──────────────────────────────────────────────────────
INSERT INTO products (sku, slug, name, short_desc, category_id, brand, model, engine_cc, price, currency, is_featured)
SELECT
  'HON-CB190R-2024', 'honda-cb190r-2024',
  'Honda CB190R 2024', 'Naked urbana 184cc con CBS e inyección electrónica',
  (SELECT id FROM categories WHERE slug = 'motorcycles'),
  'Honda', 'CB190R', 184, 9990000, 'COP', true
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, slug, name, short_desc, category_id, brand, model, engine_cc, price, currency, is_featured)
SELECT
  'YAM-FZ25-2024', 'yamaha-fz25-2024',
  'Yamaha FZ25 2024', 'Street 249cc con ABS y frenos de disco doble',
  (SELECT id FROM categories WHERE slug = 'motorcycles'),
  'Yamaha', 'FZ25', 249, 14500000, 'COP', true
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, slug, name, short_desc, category_id, brand, price, currency)
SELECT
  'HJC-I70-M-BK', 'hjc-i70-modular-negro',
  'Casco HJC i70 Modular Negro', 'Casco modular certificado ECE R22.06, interior extraíble',
  (SELECT id FROM categories WHERE slug = 'helmets'),
  'HJC', 689000, 'COP'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, slug, name, short_desc, category_id, brand, price, currency)
SELECT
  'DUC-CHAQ-M-KHK', 'dainese-chaqueta-moto-kaki',
  'Chaqueta Dainese Moto Kaki M', 'Chaqueta textil con protecciones CE nivel 2 en codos y hombros',
  (SELECT id FROM categories WHERE slug = 'gear'),
  'Dainese', 450000, 'COP'
ON CONFLICT (sku) DO NOTHING;

-- Variantes de las motos
INSERT INTO product_variants (product_id, sku, name, color, price, stock)
SELECT p.id, 'HON-CB190R-2024-ROJ', 'CB190R Rojo', 'Rojo', 9990000, 3
FROM products p WHERE p.sku = 'HON-CB190R-2024'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, color, price, stock)
SELECT p.id, 'HON-CB190R-2024-NEG', 'CB190R Negro', 'Negro', 9990000, 2
FROM products p WHERE p.sku = 'HON-CB190R-2024'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, color, price, stock)
SELECT p.id, 'YAM-FZ25-2024-AZU', 'FZ25 Azul', 'Azul', 14500000, 2
FROM products p WHERE p.sku = 'YAM-FZ25-2024'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, size, price, stock)
SELECT p.id, 'HJC-I70-M-BK-S', 'HJC i70 S', 'S', 689000, 5
FROM products p WHERE p.sku = 'HJC-I70-M-BK'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, size, price, stock)
SELECT p.id, 'HJC-I70-M-BK-M', 'HJC i70 M', 'M', 689000, 8
FROM products p WHERE p.sku = 'HJC-I70-M-BK'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, size, price, stock)
SELECT p.id, 'HJC-I70-M-BK-L', 'HJC i70 L', 'L', 689000, 6
FROM products p WHERE p.sku = 'HJC-I70-M-BK'
ON CONFLICT (sku) DO NOTHING;
