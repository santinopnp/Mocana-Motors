-- Mocana Motors initial schema
-- Run with: psql $DATABASE_URL -f migrations/001_initial.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Users / Staff ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  role            TEXT NOT NULL DEFAULT 'customer', -- customer | admin | staff | mechanic
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  zoho_contact_id TEXT,
  zoho_customer_id TEXT,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ── Addresses ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      TEXT DEFAULT 'Principal',
  line1      TEXT NOT NULL,
  line2      TEXT,
  city       TEXT NOT NULL,
  state      TEXT,
  country    TEXT NOT NULL DEFAULT 'CO',
  zip        TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  parent_id   UUID REFERENCES categories(id),
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- motorcycles, helmets, gear, parts, accessories, tools, lubricants

-- ── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku             TEXT UNIQUE NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  short_desc      TEXT,
  category_id     UUID REFERENCES categories(id),
  brand           TEXT,                        -- Honda, Yamaha, Suzuki, KTM, Kawasaki...
  model           TEXT,                        -- CB190R, FZ25, GS150...
  year            INT,                         -- para motos y repuestos compatibles
  engine_cc       INT,                         -- cilindrada en cc (motos)
  compatible_with TEXT[],                      -- modelos compatibles (repuestos)
  color           TEXT,
  price           NUMERIC(12,2) NOT NULL,
  compare_price   NUMERIC(12,2),
  currency        TEXT NOT NULL DEFAULT 'COP',
  images          TEXT[],
  tags            TEXT[],
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title      TEXT,
  meta_desc       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_brand    ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_search   ON products USING gin(to_tsvector('spanish', name || ' ' || coalesce(brand,'') || ' ' || coalesce(model,'') || ' ' || coalesce(description, '')));

-- ── Product Variants (colores, tallas) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku           TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,       -- e.g. "Rojo M", "Negro XL", "150cc Azul"
  size          TEXT,                -- para cascos/ropa
  color         TEXT,
  price         NUMERIC(12,2) NOT NULL,
  compare_price NUMERIC(12,2),
  stock         INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- ── Inventory movements ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_movements (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  delta      INT NOT NULL,  -- positivo = entrada, negativo = salida
  reason     TEXT,          -- reception | sale | return | count_adjustment | shrinkage | transfer
  ref_id     UUID,          -- order_id o service_order_id
  notes      TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Customer motorcycles registry ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_motorcycles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id),
  plate        TEXT NOT NULL,
  brand        TEXT NOT NULL,
  model        TEXT,
  year         INT,
  engine_cc    INT,
  color        TEXT,
  vin          TEXT,
  mileage_km   INT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_motos_user  ON customer_motorcycles(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_motos_plate ON customer_motorcycles(plate);

-- ── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     TEXT UNIQUE NOT NULL,
  user_id          UUID REFERENCES users(id),
  guest_email      TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',
  -- pending | confirmed | processing | shipped | delivered | cancelled | refunded
  subtotal         NUMERIC(12,2) NOT NULL,
  discount         NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping         NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax              NUMERIC(12,2) NOT NULL DEFAULT 0,
  total            NUMERIC(12,2) NOT NULL,
  currency         TEXT NOT NULL DEFAULT 'COP',
  coupon_code      TEXT,
  shipping_address JSONB,
  billing_address  JSONB,
  tracking_number  TEXT,
  notes            TEXT,
  zoho_salesorder_id TEXT,
  zoho_invoice_id    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- ── Order Items ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  variant_id  UUID REFERENCES product_variants(id),
  name        TEXT NOT NULL,
  sku         TEXT NOT NULL,
  quantity    INT NOT NULL,
  unit_price  NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Service Orders (Taller) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_orders (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_number TEXT UNIQUE NOT NULL,
  user_id        UUID REFERENCES users(id),
  mechanic_id    UUID REFERENCES users(id),
  moto_plate     TEXT NOT NULL,
  moto_brand     TEXT,
  moto_model     TEXT,
  moto_year      INT,
  moto_km        INT,
  service_type   TEXT NOT NULL,
  -- oil_change | maintenance | repair | technical_inspection | customization | other
  description    TEXT NOT NULL,
  mechanic_notes TEXT,
  status         TEXT NOT NULL DEFAULT 'scheduled',
  -- scheduled | in_progress | waiting_parts | ready | delivered | cancelled
  estimated_cost NUMERIC(12,2),
  final_cost     NUMERIC(12,2),
  currency       TEXT NOT NULL DEFAULT 'COP',
  scheduled_at   TIMESTAMPTZ,
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  delivered_at   TIMESTAMPTZ,
  zoho_invoice_id TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_orders_user     ON service_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_mechanic ON service_orders(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status   ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_plate    ON service_orders(moto_plate);

-- ── Service Order Parts ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_order_parts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  variant_id       UUID REFERENCES product_variants(id),
  sku              TEXT,
  name             TEXT NOT NULL,
  quantity         INT NOT NULL DEFAULT 1,
  unit_price       NUMERIC(12,2),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Coupons ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code             TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC(5,2) NOT NULL,
  applies_to       TEXT NOT NULL DEFAULT 'all',
  min_purchase     NUMERIC(12,2),
  usage_limit      INT,
  used_count       INT NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Cart ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_id    UUID REFERENCES users(id),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  quantity   INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, variant_id)
);

-- ── Chat conversations (Asistente Moto) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_id    UUID REFERENCES users(id),
  messages   JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_conversations(session_id);

-- ── Payments ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id         UUID REFERENCES orders(id),
  provider         TEXT NOT NULL,  -- stripe | wompi
  provider_id      TEXT,
  amount           NUMERIC(12,2) NOT NULL,
  currency         TEXT NOT NULL DEFAULT 'COP',
  status           TEXT NOT NULL DEFAULT 'pending',
  -- pending | succeeded | failed | refunded
  metadata         JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
