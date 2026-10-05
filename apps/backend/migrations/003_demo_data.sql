-- Mocana Motors — demo data for client presentations
-- Neon project: mocana-motors-demo (weathered-truth-84624320)
-- Run: psql $DATABASE_URL -f migrations/003_demo_data.sql

-- ── Demo Users ────────────────────────────────────────────────────────────────
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
  ('admin@mocanamotors.com',    '$2b$10$placeholder', 'Admin',     'Mocana',  '+573000000001', 'admin'),
  ('carlos.ramirez@demo.com',   '$2b$10$placeholder', 'Carlos',    'Ramírez', '+573001234567', 'customer'),
  ('valentina.torres@demo.com', '$2b$10$placeholder', 'Valentina', 'Torres',  '+573107654321', 'customer'),
  ('andres.molina@demo.com',    '$2b$10$placeholder', 'Andrés',    'Molina',  '+573204445566', 'customer'),
  ('maria.garcia@demo.com',     '$2b$10$placeholder', 'María',     'García',  '+573059998877', 'customer')
ON CONFLICT (email) DO NOTHING;

-- ── Categories ────────────────────────────────────────────────────────────────
INSERT INTO categories (slug, name, description, sort_order) VALUES
  ('motorcycles', 'Motocicletas',   'Motos nuevas y usadas',                  1),
  ('helmets',     'Cascos',         'Cascos integrales, modulares y abiertos', 2),
  ('gear',        'Equipamiento',   'Chaquetas, guantes, botas y pantalones',  3),
  ('parts',       'Repuestos',      'Repuestos originales y alternativos',     4),
  ('accessories', 'Accesorios',     'Maletas, espejos, GPS, luces LED',        5),
  ('lubricants',  'Lubricantes',    'Aceites, grasas y fluidos',               6)
ON CONFLICT (slug) DO NOTHING;

-- ── Products ─────────────────────────────────────────────────────────────────
-- Motorcycles
INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, model, engine_cc, price, compare_price, currency, is_featured, tags)
SELECT 'HON-CB190R-2024','honda-cb190r-2024','Honda CB190R 2024',
  'Naked urbana 184cc con CBS e inyección electrónica',
  'La Honda CB190R 2024 es la elección perfecta para el motociclista urbano. Motor monocilíndrico de 184cc con inyección electrónica, freno CBS, cuadro de acero de alta resistencia y diseño naked agresivo. Ideal para ciudad y carretera.',
  c.id,'Honda','CB190R',184,9990000,11500000,'COP',true,ARRAY['naked','urbana','honda','184cc']
FROM categories c WHERE c.slug='motorcycles' ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, model, engine_cc, price, compare_price, currency, is_featured, tags)
SELECT 'YAM-FZ25-2024','yamaha-fz25-2024','Yamaha FZ25 2024',
  'Street 249cc con ABS y frenos de disco doble',
  'La Yamaha FZ25 2024 combina potencia y tecnología en una street de 249cc. ABS de doble canal, frenos de disco delante y atrás, display digital TFT y chasis Deltabox de aluminio.',
  c.id,'Yamaha','FZ25',249,14500000,16900000,'COP',true,ARRAY['street','yamaha','249cc','abs']
FROM categories c WHERE c.slug='motorcycles' ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, model, engine_cc, price, currency, is_featured, tags)
SELECT 'SUZ-GS150-2024','suzuki-gs150-2024','Suzuki GS150 2024',
  'Commuter 150cc económica y confiable',
  'La Suzuki GS150 es la moto commuter más vendida de Colombia. Motor 150cc confiable, bajo consumo de combustible, fácil mantenimiento y gran disponibilidad de repuestos.',
  c.id,'Suzuki','GS150',150,5800000,'COP',true,ARRAY['commuter','suzuki','150cc','economica']
FROM categories c WHERE c.slug='motorcycles' ON CONFLICT (sku) DO NOTHING;

-- Helmets
INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, price, compare_price, currency, tags)
SELECT 'HJC-I70-M-BK','hjc-i70-modular-negro','Casco HJC i70 Modular Negro',
  'Casco modular certificado ECE R22.06, interior extraíble',
  'Casco modular HJC i70 con certificación ECE R22.06. Sistema de apertura RATCHET, interior extraíble y lavable, ventilación avanzada, pantalla pinlock-ready y visera solar integrada.',
  c.id,'HJC',689000,850000,'COP',ARRAY['casco','modular','hjc','certificado']
FROM categories c WHERE c.slug='helmets' ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, price, currency, tags)
SELECT 'AGV-K6-INT','agv-k6-integral-negro','Casco AGV K6 Integral Negro',
  'Casco integral racing de fibra de carbono, ultraligero',
  'El AGV K6 es el casco favorito de pilotos profesionales. Carcasa en fibra de carbono/vidrio, peso solo 1.27kg, aerodinámica de túnel de viento y sistema de sujeción micrométrico.',
  c.id,'AGV',1250000,'COP',ARRAY['casco','integral','agv','racing','carbono']
FROM categories c WHERE c.slug='helmets' ON CONFLICT (sku) DO NOTHING;

-- Gear
INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, price, compare_price, currency, tags)
SELECT 'DAI-CHAQ-SPEED','dainese-chaqueta-speed-master','Dainese Speed Master Chaqueta',
  'Chaqueta textil CE nivel 2 con protecciones en codos y hombros',
  'Chaqueta Dainese Speed Master en tejido técnico resistente. Protecciones CE nivel 2 en codos y hombros, bolsillo para espalda, forro térmico desmontable.',
  c.id,'Dainese',520000,680000,'COP',ARRAY['chaqueta','dainese','proteccion','textil']
FROM categories c WHERE c.slug='gear' ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, price, currency, tags)
SELECT 'CAST-GUANT-GP','castelli-guantes-gp-tech','Guantes Castelli GP-Tech',
  'Guantes de cuero perforado con protección de nudillos',
  'Guantes de cuero perforado con protección rígida en nudillos y palma reforzada con Clarino. Cierre Velcro ajustable y costuras dobles para durabilidad.',
  c.id,'Castelli',189000,'COP',ARRAY['guantes','cuero','proteccion','castelli']
FROM categories c WHERE c.slug='gear' ON CONFLICT (sku) DO NOTHING;

-- Parts
INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, price, currency, tags)
SELECT 'HON-KIT-MANTENIMIENTO','honda-kit-mantenimiento-cb190r','Kit Mantenimiento Honda CB190R',
  'Kit completo: filtro aire, bujía, filtro aceite y correa',
  'Kit original Honda para mantenimiento de 10.000km de la CB190R. Incluye filtro de aire, bujía NGK, filtro de aceite y kit de empaque de distribución.',
  c.id,'Honda',145000,'COP',ARRAY['repuesto','honda','mantenimiento','cb190r','kit']
FROM categories c WHERE c.slug='parts' ON CONFLICT (sku) DO NOTHING;

-- Accessories
INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, price, currency, tags)
SELECT 'GIVI-MALETA-B37','givi-maleta-monolock-b37','Maleta Givi B37 Monolock 37L',
  'Maleta trasera 37 litros, cierre rápido Monolock',
  'Maleta Givi B37 Monolock de 37 litros, resistente al agua, tapa con llave integrada. Compatible con la mayoría de bases Givi. Capacidad para casco integral.',
  c.id,'Givi',389000,'COP',ARRAY['maleta','givi','accesorios','37l','monolock']
FROM categories c WHERE c.slug='accessories' ON CONFLICT (sku) DO NOTHING;

-- Lubricants
INSERT INTO products (sku, slug, name, short_desc, description, category_id, brand, price, currency, tags)
SELECT 'MOTUL-7100-1L','motul-7100-4t-1l','Motul 7100 4T 10W-40 1L',
  'Aceite sintético 100% para motos 4T, rendimiento extremo',
  'Motul 7100 100% sintético 10W-40 para motores 4 tiempos. Máxima protección del motor, cambios de marcha suaves. Certificación JASO MA2.',
  c.id,'Motul',65000,'COP',ARRAY['aceite','motul','lubricante','4t','sintetico']
FROM categories c WHERE c.slug='lubricants' ON CONFLICT (sku) DO NOTHING;

-- ── Product Variants ─────────────────────────────────────────────────────────
INSERT INTO product_variants (product_id, sku, name, color, price, compare_price, stock)
SELECT p.id,'HON-CB190R-ROJ','CB190R Rojo','Rojo',9990000,11500000,3 FROM products p WHERE p.sku='HON-CB190R-2024' ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, name, color, price, compare_price, stock)
SELECT p.id,'HON-CB190R-NEG','CB190R Negro','Negro',9990000,11500000,2 FROM products p WHERE p.sku='HON-CB190R-2024' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, color, price, compare_price, stock)
SELECT p.id,'YAM-FZ25-AZU','FZ25 Azul Racing','Azul',14500000,16900000,2 FROM products p WHERE p.sku='YAM-FZ25-2024' ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, name, color, price, stock)
SELECT p.id,'YAM-FZ25-NEG','FZ25 Negro Mate','Negro',14500000,1 FROM products p WHERE p.sku='YAM-FZ25-2024' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, color, price, stock)
SELECT p.id,'SUZ-GS150-AZU','GS150 Azul','Azul',5800000,4 FROM products p WHERE p.sku='SUZ-GS150-2024' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, size, price, compare_price, stock)
SELECT p.id,'HJC-I70-S','HJC i70 Talla S','S',689000,850000,5 FROM products p WHERE p.sku='HJC-I70-M-BK' ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, name, size, price, compare_price, stock)
SELECT p.id,'HJC-I70-M','HJC i70 Talla M','M',689000,850000,8 FROM products p WHERE p.sku='HJC-I70-M-BK' ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, name, size, price, compare_price, stock)
SELECT p.id,'HJC-I70-L','HJC i70 Talla L','L',689000,850000,6 FROM products p WHERE p.sku='HJC-I70-M-BK' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, size, price, compare_price, stock)
SELECT p.id,'DAI-CHAQ-S','Dainese Speed Master S','S',520000,680000,4 FROM products p WHERE p.sku='DAI-CHAQ-SPEED' ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, name, size, price, compare_price, stock)
SELECT p.id,'DAI-CHAQ-M','Dainese Speed Master M','M',520000,680000,6 FROM products p WHERE p.sku='DAI-CHAQ-SPEED' ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_variants (product_id, sku, name, price, stock)
SELECT p.id,'GIVI-B37-STD','Maleta Givi B37',389000,10 FROM products p WHERE p.sku='GIVI-MALETA-B37' ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, name, price, stock)
SELECT p.id,'MOTUL-7100-STD','Motul 7100 1L',65000,25 FROM products p WHERE p.sku='MOTUL-7100-1L' ON CONFLICT (sku) DO NOTHING;
INSERT INTO product_variants (product_id, sku, name, price, stock)
SELECT p.id,'HON-KIT-STD','Kit Mantenimiento CB190R',145000,15 FROM products p WHERE p.sku='HON-KIT-MANTENIMIENTO' ON CONFLICT (sku) DO NOTHING;

-- ── Demo Orders ───────────────────────────────────────────────────────────────
-- Pedido entregado (Carlos → Honda CB190R)
INSERT INTO orders (order_number, user_id, status, subtotal, shipping, tax, total, currency, shipping_address, created_at)
SELECT 'MM-2024-001', u.id, 'delivered', 9990000, 0, 0, 9990000, 'COP',
  '{"line1":"Cra 7 #45-32","city":"Bogotá","country":"CO"}'::jsonb,
  NOW() - INTERVAL '45 days'
FROM users u WHERE u.email='carlos.ramirez@demo.com' ON CONFLICT (order_number) DO NOTHING;

INSERT INTO order_items (order_id, product_id, variant_id, name, sku, quantity, unit_price, total_price)
SELECT o.id, p.id, v.id, 'Honda CB190R 2024 – Rojo', 'HON-CB190R-ROJ', 1, 9990000, 9990000
FROM orders o, products p, product_variants v
WHERE o.order_number='MM-2024-001' AND p.sku='HON-CB190R-2024' AND v.sku='HON-CB190R-ROJ';

-- Pedido enviado (Valentina → Casco + Chaqueta)
INSERT INTO orders (order_number, user_id, status, subtotal, shipping, tax, total, currency, shipping_address, created_at)
SELECT 'MM-2024-002', u.id, 'shipped', 878000, 15000, 0, 893000, 'COP',
  '{"line1":"Av El Poblado #12-55","city":"Medellín","country":"CO"}'::jsonb,
  NOW() - INTERVAL '12 days'
FROM users u WHERE u.email='valentina.torres@demo.com' ON CONFLICT (order_number) DO NOTHING;

INSERT INTO order_items (order_id, product_id, variant_id, name, sku, quantity, unit_price, total_price)
SELECT o.id, p.id, v.id, 'Casco HJC i70 – M', 'HJC-I70-M', 1, 689000, 689000
FROM orders o, products p, product_variants v
WHERE o.order_number='MM-2024-002' AND p.sku='HJC-I70-M-BK' AND v.sku='HJC-I70-M';

INSERT INTO order_items (order_id, product_id, variant_id, name, sku, quantity, unit_price, total_price)
SELECT o.id, p.id, v.id, 'Dainese Speed Master – M', 'DAI-CHAQ-M', 1, 520000, 520000
FROM orders o, products p, product_variants v
WHERE o.order_number='MM-2024-002' AND p.sku='DAI-CHAQ-SPEED' AND v.sku='DAI-CHAQ-M';

-- Pedido en proceso (Andrés → Yamaha FZ25)
INSERT INTO orders (order_number, user_id, status, subtotal, shipping, tax, total, currency, shipping_address, created_at)
SELECT 'MM-2024-003', u.id, 'processing', 14500000, 0, 0, 14500000, 'COP',
  '{"line1":"Calle 5 #22-10","city":"Cali","country":"CO"}'::jsonb,
  NOW() - INTERVAL '3 days'
FROM users u WHERE u.email='andres.molina@demo.com' ON CONFLICT (order_number) DO NOTHING;

INSERT INTO order_items (order_id, product_id, variant_id, name, sku, quantity, unit_price, total_price)
SELECT o.id, p.id, v.id, 'Yamaha FZ25 2024 – Azul Racing', 'YAM-FZ25-AZU', 1, 14500000, 14500000
FROM orders o, products p, product_variants v
WHERE o.order_number='MM-2024-003' AND p.sku='YAM-FZ25-2024' AND v.sku='YAM-FZ25-AZU';

-- Pedido pendiente (guest)
INSERT INTO orders (order_number, guest_email, status, subtotal, shipping, tax, total, currency, shipping_address, created_at)
VALUES ('MM-2024-004','maria.garcia@demo.com','pending',769000,15000,0,784000,'COP',
  '{"line1":"Transversal 4 #8-22","city":"Barranquilla","country":"CO"}'::jsonb,
  NOW() - INTERVAL '1 day')
ON CONFLICT (order_number) DO NOTHING;

-- ── Demo Service Orders (Taller) ──────────────────────────────────────────────
INSERT INTO service_orders (service_number, user_id, moto_plate, moto_brand, moto_model, moto_year, service_type, description, mechanic_notes, status, estimated_cost, final_cost, scheduled_at, completed_at, created_at)
SELECT 'SV-2024-001', u.id, 'ABC123', 'Honda', 'CB190R', 2024, 'oil_change',
  'Cambio de aceite y filtro a los 5.000km',
  'Aceite Motul 7100 10W-40, filtro original Honda. Todo en orden.',
  'delivered', 95000, 95000,
  NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '30 days'
FROM users u WHERE u.email='carlos.ramirez@demo.com' ON CONFLICT (service_number) DO NOTHING;

INSERT INTO service_orders (service_number, user_id, moto_plate, moto_brand, moto_model, moto_year, service_type, description, status, estimated_cost, scheduled_at, created_at)
SELECT 'SV-2024-002', u.id, 'XYZ789', 'Yamaha', 'FZ25', 2023, 'maintenance',
  'Mantenimiento preventivo 10.000km: cadena, frenos, calibración de válvulas y limpieza de inyectores',
  'in_progress', 280000,
  NOW() + INTERVAL '2 days', NOW() - INTERVAL '1 day'
FROM users u WHERE u.email='andres.molina@demo.com' ON CONFLICT (service_number) DO NOTHING;

INSERT INTO service_orders (service_number, moto_plate, moto_brand, moto_model, moto_year, service_type, description, status, estimated_cost, scheduled_at, created_at)
VALUES ('SV-2024-003','DEF456','Suzuki','GS150',2022,'repair',
  'Vibración excesiva en manillar a velocidades altas. Posible desbalanceo de ruedas o problema en rodamientos de dirección.',
  'scheduled', 150000,
  NOW() + INTERVAL '5 days', NOW())
ON CONFLICT (service_number) DO NOTHING;
