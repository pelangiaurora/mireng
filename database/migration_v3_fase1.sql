-- ============================================================
-- MIRENG MARKETPLACE v3.0 — MIGRATION FASE 1
-- Seller Type, Store Type, Tier System, Verification
-- Aman dijalankan: semua pakai IF NOT EXISTS
-- ============================================================

-- ── 1. UPDATE STORES ─────────────────────────────────────
ALTER TABLE stores
  ADD COLUMN IF NOT EXISTS seller_type      VARCHAR(20) DEFAULT 'digital'
                                            CHECK (seller_type IN ('physical','digital')),
  ADD COLUMN IF NOT EXISTS store_type       VARCHAR(20) DEFAULT 'personal'
                                            CHECK (store_type IN ('personal','umkm','official')),
  ADD COLUMN IF NOT EXISTS seller_tier      VARCHAR(20) DEFAULT 'regular'
                                            CHECK (seller_tier IN ('regular','star','star_plus','top','official')),
  ADD COLUMN IF NOT EXISTS tier_progress    INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS badge_visible    BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS verif_status     VARCHAR(20) DEFAULT 'unverified'
                                            CHECK (verif_status IN ('unverified','pending','approved','rejected','suspended','banned')),
  ADD COLUMN IF NOT EXISTS verif_docs       JSONB,
  ADD COLUMN IF NOT EXISTS verif_note       TEXT,
  ADD COLUMN IF NOT EXISTS verif_reviewed_at  TIMESTAMP,
  ADD COLUMN IF NOT EXISTS verif_reviewed_by  UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS total_transactions INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avg_rating         NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS response_rate      NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS complaint_rate     NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_since       TIMESTAMP DEFAULT NOW();

-- ── 2. UPDATE CATEGORIES ─────────────────────────────────
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS for_type VARCHAR(20) DEFAULT 'both'
                                    CHECK (for_type IN ('physical','digital','both'));

-- Seed kategori fisik
INSERT INTO categories (name, slug, level, sort_order, is_active, for_type) VALUES
  ('Elektronik & Gadget',    'elektronik-gadget',    1, 1,  true, 'physical'),
  ('Fashion & Pakaian',      'fashion-pakaian',      1, 2,  true, 'physical'),
  ('Makanan & Minuman',      'makanan-minuman',      1, 3,  true, 'physical'),
  ('Kesehatan & Kecantikan', 'kesehatan-kecantikan', 1, 4,  true, 'physical'),
  ('Rumah & Taman',          'rumah-taman',          1, 5,  true, 'physical'),
  ('Olahraga & Outdoor',     'olahraga-outdoor',     1, 6,  true, 'physical'),
  ('Hobi & Koleksi',         'hobi-koleksi',         1, 7,  true, 'physical'),
  ('Otomotif',               'otomotif',             1, 8,  true, 'physical'),
  ('Buku & ATK',             'buku-atk',             1, 9,  true, 'physical'),
  ('Ibu & Bayi',             'ibu-bayi',             1, 10, true, 'physical')
ON CONFLICT (slug) DO UPDATE SET for_type = 'physical';

-- Seed kategori digital
INSERT INTO categories (name, slug, level, sort_order, is_active, for_type) VALUES
  ('Akun Premium',        'akun-premium',     1, 1,  true, 'digital'),
  ('Software & Aplikasi', 'software-aplikasi',1, 2,  true, 'digital'),
  ('Template & Desain',   'template-desain',  1, 3,  true, 'digital'),
  ('Ebook & Kursus',      'ebook-kursus',     1, 4,  true, 'digital'),
  ('Lisensi Software',    'lisensi-software', 1, 5,  true, 'digital'),
  ('Game & Hiburan',      'game-hiburan',     1, 6,  true, 'digital'),
  ('Jasa Digital',        'jasa-digital',     1, 7,  true, 'digital'),
  ('Domain & Hosting',    'domain-hosting',   1, 8,  true, 'digital')
ON CONFLICT (slug) DO UPDATE SET for_type = 'digital';

-- ── 3. UPDATE USERS (Progressive KYC) ────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS kyc_verified       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS kyc_verified_at    TIMESTAMP,
  ADD COLUMN IF NOT EXISTS kyc_verified_by    UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS withdraw_blocked   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS seller_reg_status  VARCHAR(20) DEFAULT 'none'
                                              CHECK (seller_reg_status IN ('none','pending','approved','rejected'));

-- ── 4. TABEL store_verifications ─────────────────────────
CREATE TABLE IF NOT EXISTS store_verifications (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id            UUID REFERENCES stores(id) ON DELETE CASCADE,
  seller_type         VARCHAR(20) NOT NULL,
  store_type          VARCHAR(20) NOT NULL,

  -- Dokumen Perorangan
  document_ktp        TEXT,
  document_selfie     TEXT,

  -- Dokumen UMKM
  document_nib        TEXT,
  document_siup       TEXT,
  document_akta       TEXT,

  -- Dokumen Official Store
  document_npwp       TEXT,
  document_brand      TEXT,

  -- Catatan
  notes_from_seller   TEXT,
  notes_from_admin    TEXT,

  -- Status
  status              VARCHAR(20) DEFAULT 'pending'
                      CHECK (status IN ('pending','approved','rejected','need_revision')),
  submitted_at        TIMESTAMP DEFAULT NOW(),
  reviewed_at         TIMESTAMP,
  reviewed_by         UUID REFERENCES users(id),

  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ── 5. TABEL seller_applications ─────────────────────────
-- Permohonan saat pendaftaran seller ditutup admin
CREATE TABLE IF NOT EXISTS seller_applications (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Informasi permohonan
  seller_type_requested VARCHAR(20) CHECK (seller_type_requested IN ('physical','digital')),
  reason                TEXT NOT NULL,
  marketplace_links     JSONB,        -- [{platform: 'Tokopedia', url: '...', followers: 100}]
  estimated_products    INT,
  estimated_revenue     BIGINT,
  experience_years      INT,

  -- Dokumen
  document_ktp          TEXT NOT NULL,
  document_support      TEXT,

  -- Status & review
  status                VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected','need_info')),
  submitted_at          TIMESTAMP DEFAULT NOW(),
  reviewed_at           TIMESTAMP,
  reviewed_by           UUID REFERENCES users(id),
  admin_notes           TEXT,
  rejection_reason      TEXT,

  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

-- ── 6. TABEL platform_settings ───────────────────────────
CREATE TABLE IF NOT EXISTS platform_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         VARCHAR(100) UNIQUE NOT NULL,
  value       TEXT NOT NULL,
  description TEXT,
  data_type   VARCHAR(20) DEFAULT 'string'
              CHECK (data_type IN ('string','boolean','number','json')),
  updated_at  TIMESTAMP DEFAULT NOW(),
  updated_by  UUID REFERENCES users(id)
);

-- Seed default settings
INSERT INTO platform_settings (key, value, description, data_type) VALUES
  ('seller_registration_open',  'true',  'Buka/tutup pendaftaran seller baru',           'boolean'),
  ('seller_upgrade_open',       'true',  'Buka/tutup upgrade buyer ke seller',            'boolean'),
  ('maintenance_mode',          'false', 'Mode maintenance platform',                     'boolean'),
  ('commission_regular',        '1.0',   'Komisi % untuk seller Regular',                 'number'),
  ('commission_star',           '1.5',   'Komisi % untuk seller Star',                    'number'),
  ('commission_star_plus',      '2.0',   'Komisi % untuk seller Star+',                   'number'),
  ('commission_top',            '2.5',   'Komisi % untuk seller Top Seller',              'number'),
  ('commission_official',       '2.0',   'Komisi % untuk Official Store (default)',        'number'),
  ('tier_star_min_transactions','50',    'Min transaksi untuk naik ke Star',               'number'),
  ('tier_star_min_rating',      '4.5',   'Min rating untuk naik ke Star',                 'number'),
  ('tier_star_min_months',      '3',     'Min bulan aktif untuk naik ke Star',            'number'),
  ('tier_star_plus_min_tx',     '150',   'Min transaksi untuk naik ke Star+',             'number'),
  ('tier_star_plus_min_rating', '4.7',   'Min rating untuk naik ke Star+',               'number'),
  ('tier_top_min_tx',           '500',   'Min transaksi untuk naik ke Top Seller',        'number'),
  ('tier_top_min_rating',       '4.8',   'Min rating untuk naik ke Top Seller',           'number'),
  ('max_products_regular',      '100',   'Max produk untuk seller Regular',               'number'),
  ('max_products_star',         '500',   'Max produk untuk seller Star',                  'number'),
  ('max_products_star_plus',    '1000',  'Max produk untuk seller Star+',                 'number'),
  ('max_products_top',          '9999',  'Max produk untuk seller Top Seller',            'number')
ON CONFLICT (key) DO NOTHING;

-- ── 7. TABEL seller_tier_log ──────────────────────────────
CREATE TABLE IF NOT EXISTS seller_tier_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id      UUID REFERENCES stores(id) ON DELETE CASCADE,
  from_tier     VARCHAR(20),
  to_tier       VARCHAR(20) NOT NULL,
  reason        TEXT,
  changed_by    UUID REFERENCES users(id),
  is_auto       BOOLEAN DEFAULT TRUE,
  notified_at   TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── 8. INDEXES ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_stores_seller_type  ON stores(seller_type);
CREATE INDEX IF NOT EXISTS idx_stores_store_type   ON stores(store_type);
CREATE INDEX IF NOT EXISTS idx_stores_seller_tier  ON stores(seller_tier);
CREATE INDEX IF NOT EXISTS idx_stores_verif_status ON stores(verif_status);
CREATE INDEX IF NOT EXISTS idx_categories_for_type ON categories(for_type);
CREATE INDEX IF NOT EXISTS idx_sv_store_id         ON store_verifications(store_id);
CREATE INDEX IF NOT EXISTS idx_sv_status           ON store_verifications(status);
CREATE INDEX IF NOT EXISTS idx_sa_user_id          ON seller_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_sa_status           ON seller_applications(status);
CREATE INDEX IF NOT EXISTS idx_stl_store_id        ON seller_tier_log(store_id);
CREATE INDEX IF NOT EXISTS idx_ps_key              ON platform_settings(key);
CREATE INDEX IF NOT EXISTS idx_users_kyc           ON users(kyc_verified);

-- ── DONE ──────────────────────────────────────────────────
-- Migration v3 Fase 1 complete!
-- Tables added: store_verifications, seller_applications,
--               platform_settings, seller_tier_log
-- Tables modified: stores, categories, users
-- Categories seeded: 10 fisik + 8 digital
-- Platform settings seeded: 19 settings
