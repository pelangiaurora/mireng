-- ============================================================
-- MIRENG MARKETPLACE v2.0 — MIGRATION SCRIPT
-- Full marketplace: fisik + digital, multi-seller, multi-role
-- Aman dijalankan: semua pakai IF NOT EXISTS / IF EXISTS
-- ============================================================

-- ── 1. USERS — tambah kolom baru ──────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone          VARCHAR(20),
  ADD COLUMN IF NOT EXISTS avatar         TEXT,
  ADD COLUMN IF NOT EXISTS bio            TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth  DATE,
  ADD COLUMN IF NOT EXISTS gender         VARCHAR(10) CHECK (gender IN ('male','female','other')),
  ADD COLUMN IF NOT EXISTS kyc_status     VARCHAR(20) DEFAULT 'unverified'
                                          CHECK (kyc_status IN ('unverified','pending','verified','rejected')),
  ADD COLUMN IF NOT EXISTS kyc_document   TEXT,
  ADD COLUMN IF NOT EXISTS is_active      BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMP DEFAULT NOW();

-- Update role check (tambah 'seller' jika belum ada)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin','seller','buyer'));

-- ── 2. STORES — toko milik seller ─────────────────────────
CREATE TABLE IF NOT EXISTS stores (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id        UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name             VARCHAR(100) NOT NULL,
  slug             VARCHAR(100) UNIQUE NOT NULL,
  description      TEXT,
  logo             TEXT,
  banner           TEXT,
  city             VARCHAR(100),
  province         VARCHAR(100),
  district         VARCHAR(100),
  address          TEXT,
  postal_code      VARCHAR(10),
  phone            VARCHAR(20),
  operating_hours  JSONB,
  holiday_mode     BOOLEAN DEFAULT FALSE,
  holiday_note     TEXT,
  is_active        BOOLEAN DEFAULT TRUE,
  is_verified      BOOLEAN DEFAULT FALSE,
  kyc_document     TEXT,
  rating           NUMERIC(3,2) DEFAULT 0,
  total_sales      INT DEFAULT 0,
  total_reviews    INT DEFAULT 0,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- ── 3. CATEGORIES — hierarki bertingkat ───────────────────
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id   UUID REFERENCES categories(id),
  ADD COLUMN IF NOT EXISTS icon        TEXT,
  ADD COLUMN IF NOT EXISTS image       TEXT,
  ADD COLUMN IF NOT EXISTS level       INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS sort_order  INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active   BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMP DEFAULT NOW();

-- ── 4. PRODUCTS — fisik + digital ─────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS store_id      UUID REFERENCES stores(id),
  ADD COLUMN IF NOT EXISTS condition     VARCHAR(10) DEFAULT 'new'
                                         CHECK (condition IN ('new','used')),
  ADD COLUMN IF NOT EXISTS weight        INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS width         INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS height        INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS length        INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS stock         INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_order     INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_digital    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS digital_file  TEXT,
  ADD COLUMN IF NOT EXISTS digital_note  TEXT,
  ADD COLUMN IF NOT EXISTS total_sold    INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating        NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMP DEFAULT NOW();

-- Perluas type produk (fisik, digital, layanan)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check;
ALTER TABLE products ADD CONSTRAINT products_type_check
  CHECK (type IN ('account','file','license','physical','digital','service'));

-- ── 5. PRODUCT VARIANTS — variasi (warna, ukuran, dll) ────
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS sku       VARCHAR(100),
  ADD COLUMN IF NOT EXISTS stock     INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image     TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- ── 6. PRODUCT IMAGES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID REFERENCES products(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  is_thumbnail BOOLEAN DEFAULT FALSE,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ── 7. USER ADDRESSES — multi alamat per user ─────────────
CREATE TABLE IF NOT EXISTS user_addresses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  label           VARCHAR(50) DEFAULT 'Rumah',
  recipient_name  VARCHAR(100) NOT NULL,
  phone           VARCHAR(20) NOT NULL,
  address         TEXT NOT NULL,
  city            VARCHAR(100) NOT NULL,
  province        VARCHAR(100) NOT NULL,
  district        VARCHAR(100),
  postal_code     VARCHAR(10) NOT NULL,
  latitude        NUMERIC(10,7),
  longitude       NUMERIC(10,7),
  is_default      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ── 8. ORDERS — refactor untuk multi-seller ───────────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS address_id      UUID REFERENCES user_addresses(id),
  ADD COLUMN IF NOT EXISTS voucher_code    VARCHAR(50),
  ADD COLUMN IF NOT EXISTS discount_amount BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_total  BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes           TEXT,
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMP DEFAULT NOW();

-- Perluas status order
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','paid','processing','shipped','completed','cancelled','refunded','failed','expired'));

-- ── 9. ORDER_STORES — pesanan per toko ────────────────────
CREATE TABLE IF NOT EXISTS order_stores (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id         UUID REFERENCES orders(id) ON DELETE CASCADE,
  store_id         UUID REFERENCES stores(id),
  subtotal         BIGINT NOT NULL DEFAULT 0,
  shipping_fee     BIGINT DEFAULT 0,
  courier          VARCHAR(50),
  courier_service  VARCHAR(50),
  tracking_number  VARCHAR(100),
  status           VARCHAR(30) DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','processing',
                                     'shipped','delivered','completed',
                                     'cancelled','refunded')),
  notes            TEXT,
  seller_notes     TEXT,
  shipped_at       TIMESTAMP,
  delivered_at     TIMESTAMP,
  completed_at     TIMESTAMP,
  cancelled_at     TIMESTAMP,
  cancel_reason    TEXT,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- ── 10. ORDER ITEMS — tambah kolom ────────────────────────
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS order_store_id  UUID REFERENCES order_stores(id),
  ADD COLUMN IF NOT EXISTS quantity        INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS product_name    VARCHAR(255),
  ADD COLUMN IF NOT EXISTS variant_name    VARCHAR(255),
  ADD COLUMN IF NOT EXISTS product_image   TEXT;

-- ── 11. PAYMENTS — perluas ────────────────────────────────
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS amount          BIGINT,
  ADD COLUMN IF NOT EXISTS va_number       VARCHAR(50),
  ADD COLUMN IF NOT EXISTS payment_url     TEXT,
  ADD COLUMN IF NOT EXISTS expired_at      TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMP DEFAULT NOW();

-- ── 12. REVIEWS — lengkap ─────────────────────────────────
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS store_id       UUID REFERENCES stores(id),
  ADD COLUMN IF NOT EXISTS order_item_id  UUID REFERENCES order_items(id),
  ADD COLUMN IF NOT EXISTS images         JSONB,
  ADD COLUMN IF NOT EXISTS is_anonymous   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS seller_reply   TEXT,
  ADD COLUMN IF NOT EXISTS replied_at     TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMP DEFAULT NOW();

-- ── 13. WISHLISTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ── 14. VOUCHERS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vouchers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id     UUID REFERENCES stores(id),
  code         VARCHAR(50) UNIQUE NOT NULL,
  title        VARCHAR(200),
  type         VARCHAR(20) DEFAULT 'discount'
               CHECK (type IN ('discount','shipping','cashback')),
  value_type   VARCHAR(20) DEFAULT 'percentage'
               CHECK (value_type IN ('percentage','fixed')),
  value        BIGINT NOT NULL,
  min_purchase BIGINT DEFAULT 0,
  max_discount BIGINT,
  quota        INT DEFAULT 1,
  used_count   INT DEFAULT 0,
  start_date   TIMESTAMP,
  end_date     TIMESTAMP,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voucher_usage (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id      UUID REFERENCES vouchers(id),
  user_id         UUID REFERENCES users(id),
  order_id        UUID REFERENCES orders(id),
  discount_amount BIGINT,
  used_at         TIMESTAMP DEFAULT NOW()
);

-- ── 15. STORE FOLLOWS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS store_follows (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  store_id   UUID REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);

-- ── 16. NOTIFICATIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  title      VARCHAR(200) NOT NULL,
  message    TEXT,
  data       JSONB,
  image      TEXT,
  action_url TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── 17. CHATS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chats (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  store_id        UUID REFERENCES stores(id) ON DELETE CASCADE,
  last_message    TEXT,
  last_message_at TIMESTAMP DEFAULT NOW(),
  buyer_unread    INT DEFAULT 0,
  seller_unread   INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(buyer_id, store_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id     UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id   UUID REFERENCES users(id),
  message     TEXT,
  image       TEXT,
  product_id  UUID REFERENCES products(id),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── 18. BANNERS (admin) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS banners (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      VARCHAR(200),
  image      TEXT NOT NULL,
  link       TEXT,
  position   VARCHAR(30) DEFAULT 'home'
             CHECK (position IN ('home','category','product','popup')),
  sort_order INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP,
  end_date   TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── 19. FLASH SALES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS flash_sales (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        VARCHAR(200),
  start_time   TIMESTAMP NOT NULL,
  end_time     TIMESTAMP NOT NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flash_sale_products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flash_sale_id   UUID REFERENCES flash_sales(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  discount_price  BIGINT NOT NULL,
  quota           INT NOT NULL,
  sold            INT DEFAULT 0,
  UNIQUE(flash_sale_id, product_id)
);

-- ── 20. INDEXES ───────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_stores_seller    ON stores(seller_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug      ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_city      ON stores(city);
CREATE INDEX IF NOT EXISTS idx_products_store   ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_cat     ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_type    ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_active  ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_ua_user          ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_os_order         ON order_stores(order_id);
CREATE INDEX IF NOT EXISTS idx_os_store         ON order_stores(store_id);
CREATE INDEX IF NOT EXISTS idx_os_status        ON order_stores(status);
CREATE INDEX IF NOT EXISTS idx_wl_user          ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user       ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_read       ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_chats_buyer      ON chats(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chats_store      ON chats(store_id);
CREATE INDEX IF NOT EXISTS idx_chat_msg_chat    ON chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_pimg_product     ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product  ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_store    ON reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_categories_par   ON categories(parent_id);

-- ── DONE ──────────────────────────────────────────────────
-- Mireng Marketplace v2.0 schema migration complete!
-- Tables added: stores, user_addresses, order_stores,
--   product_images, wishlists, vouchers, voucher_usage,
--   store_follows, notifications, chats, chat_messages,
--   banners, flash_sales, flash_sale_products
-- Tables modified: users, categories, products,
--   product_variants, orders, order_items, payments, reviews
