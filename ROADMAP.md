# Mireng Marketplace — Roadmap Detail
*Dokumen ini berisi rencana pengembangan per fase*

---

## Status Saat Ini (Mei 2026)

```
✅ Foundation sudah solid:
   - Auth, Users, Stores, Products, Cart, Orders, Categories, Addresses
   - Frontend: Home, Login, Register, Profile, Cart, Orders, Dashboard, Store Create
   - Database: 29 tabel
   - PRD: sudah final dan didokumentasikan

🎯 Next step: FASE 1 — Database Migration v3
```

---

## FASE 1 — Database Migration v3
*Estimasi: 1-2 hari*
*Status: NEXT*

### Tujuan
Tambahkan fondasi database untuk seller type, store type, tier system, dan platform settings.

### Yang Dikerjakan

**1. Update tabel `stores`**
```sql
ADD COLUMN seller_type VARCHAR(20)    -- 'physical' | 'digital'
ADD COLUMN store_type VARCHAR(20)     -- 'personal' | 'umkm' | 'official'
ADD COLUMN seller_tier VARCHAR(20)    -- 'regular' | 'star' | 'star_plus' | 'top' | 'official'
ADD COLUMN tier_progress INT          -- angka progress total (tidak reset)
ADD COLUMN badge_visible BOOLEAN      -- seller bisa sembunyikan badge
ADD COLUMN verif_status VARCHAR(20)   -- 'unverified' | 'pending' | 'approved' | 'rejected' | 'suspended'
ADD COLUMN verif_docs JSONB           -- dokumen yang diupload
ADD COLUMN verif_note TEXT            -- catatan admin
ADD COLUMN verif_reviewed_at TIMESTAMP
ADD COLUMN verif_reviewed_by UUID
ADD COLUMN total_transactions INT     -- untuk kalkulasi tier
ADD COLUMN response_rate DECIMAL      -- untuk kalkulasi tier
ADD COLUMN complaint_rate DECIMAL     -- untuk kalkulasi tier
ADD COLUMN active_since TIMESTAMP     -- untuk kalkulasi tier
```

**2. Update tabel `categories`**
```sql
ADD COLUMN for_type VARCHAR(20)  -- 'physical' | 'digital' | 'both'
```

**3. Update tabel `users`**
```sql
ADD COLUMN kyc_verified BOOLEAN DEFAULT FALSE
ADD COLUMN kyc_verified_at TIMESTAMP
ADD COLUMN withdraw_blocked BOOLEAN DEFAULT FALSE
```

**4. Tabel baru `store_verifications`**
```sql
id, store_id, store_type, seller_type,
document_ktp, document_selfie, document_nib,
document_siup, document_akta, document_npwp,
notes_from_seller, notes_from_admin,
status, submitted_at, reviewed_at, reviewed_by
```

**5. Tabel baru `seller_applications`**
```sql
id, user_id, reason, marketplace_links,
estimated_products, estimated_revenue,
document_ktp, document_support,
status, submitted_at, reviewed_at,
reviewed_by, admin_notes
```

**6. Tabel baru `platform_settings`**
```sql
id, key, value, description, updated_at, updated_by

-- Rows default:
-- seller_registration_open: true
-- seller_upgrade_open: true
-- maintenance_mode: false
-- commission_regular: 1.0
-- commission_star: 1.5
-- commission_star_plus: 2.0
-- commission_top: 2.5
```

**7. Tabel baru `seller_tier_log`**
```sql
id, store_id, from_tier, to_tier,
reason, changed_by, changed_at, notified_at
```

---

## FASE 2 — Backend API Baru
*Estimasi: 3-5 hari*

### Modul Baru
- `platform-settings` → admin toggle buka/tutup, komisi
- `store-verifications` → submit dokumen, admin review
- `seller-applications` → permohonan saat ditutup
- `tier-system` → kalkulasi otomatis tier seller

### Update Modul Existing
- `stores` → seller_type validation, store_type, tier
- `users` → progressive KYC, withdraw check
- `categories` → filter by for_type
- `products` → validasi tipe produk sesuai seller_type

### Endpoint Baru
```
Platform Settings:
GET  /platform-settings          → publik (cek apakah registrasi open)
GET  /admin/platform-settings    → semua setting (admin)
PATCH /admin/platform-settings/:key → update setting

Store Verifications:
POST /stores/verify/submit       → seller submit dokumen
GET  /admin/verifications        → list antrian (admin)
PATCH /admin/verifications/:id/approve → admin approve
PATCH /admin/verifications/:id/reject  → admin reject

Seller Applications:
POST /seller-applications        → ajukan permohonan (saat ditutup)
GET  /admin/seller-applications  → list antrian (admin)
PATCH /admin/seller-applications/:id/approve
PATCH /admin/seller-applications/:id/reject

Tier System:
GET  /stores/seller/mine/tier    → info tier + progress
PATCH /admin/stores/:id/tier     → admin override tier
```

---

## FASE 3 — Frontend Baru
*Estimasi: 5-7 hari*

### Halaman Baru
1. **Form Buka Toko v2** (`/stores/create`)
   - Step 1: Pilih tipe seller (Fisik / Digital)
   - Step 2: Pilih tipe toko (Personal / UMKM / Official)
   - Step 3: Info toko
   - Step 4: Lokasi (wilayah.id otomatis)
   - Step 5: Upload dokumen
   - Step 6: Review & submit

2. **Halaman Toko Publik** (`/stores/[slug]`)
   - Banner + logo toko
   - Info seller tier + badge
   - Statistik toko (rating, transaksi, respon)
   - Produk toko + filter

3. **Admin Panel** (`/admin/*`)
   - Dashboard statistik
   - Kelola antrian verifikasi toko
   - Kelola antrian permohonan seller
   - Override tier seller
   - Toggle platform settings
   - Kelola kategori

4. **Dashboard Seller v2** (`/dashboard/*`)
   - Progress bar tier
   - Notifikasi tier naik/turun
   - Target yang harus dicapai

### Komponen Baru
- `WilayahSelector` — Provinsi → Kota → Kecamatan → Kelurahan
- `TierBadge` — tampilkan badge tier
- `TierProgress` — progress bar menuju tier berikutnya
- `DocumentUpload` — upload dokumen verifikasi
- `StoreCard` — kartu toko di listing

---

## FASE 4 — Integrasi Eksternal
*Estimasi: 7-10 hari*

### Raja Ongkir
```
- Daftar di rajaongkir.com
- Tambah RAJA_ONGKIR_KEY di .env
- Buat shipping module di backend
- Endpoint: POST /shipping/cost
- Frontend: selector ekspedisi + ongkir di checkout
```

### Midtrans
```
- Daftar di midtrans.com
- Tambah MIDTRANS_KEY di .env
- Buat payment module di backend
- Endpoint: POST /payments/create, POST /payments/callback
- Frontend: payment page + status tracking
```

### WebSocket (Chat)
```
- Install socket.io di backend
- Buat chat gateway (NestJS WebSocket)
- Frontend: chat component dengan Socket.io client
- Fitur: kirim pesan, gambar, share produk
```

### Email (Nodemailer)
```
- Setup SMTP atau Resend API
- Template email: order, verifikasi, tier, dll
- Trigger dari backend events
```

---

## FASE 5 — Fitur Lanjutan
*Estimasi: 10-14 hari*

### Voucher & Promosi
- Platform voucher (admin)
- Toko voucher (seller)
- Flash sale (waktu + kuota)
- Diskon produk (coret harga)

### Sosial & Engagement
- Wishlist produk
- Follow toko
- Review + foto + balasan seller
- Diskusi produk publik

### Wallet & Keuangan
- Wallet buyer (saldo refund)
- Wallet seller (saldo penjualan)
- Withdraw (butuh KYC verified)
- Riwayat transaksi wallet

### Refund & Mediasi
- Buyer ajukan retur + foto bukti
- Seller respons
- Admin mediasi jika tidak sepakat
- Refund ke wallet

---

## FASE 6 — Deploy & Production
*Estimasi: 3-5 hari*

```
1. Docker Compose (frontend + backend + postgres)
2. Environment production (.env.production)
3. VPS Ubuntu (backend + database)
4. Vercel (frontend)
5. Domain + SSL (Nginx reverse proxy)
6. GitHub Actions CI/CD
7. Monitoring (optional: Sentry/Uptime)
```

---

## Keputusan Teknis Yang Sudah Final

```
PENGIRIMAN:
- Raja Ongkir untuk MVP
- Arsitektur modular → bisa ganti Biteship/ekspedisi sendiri nanti
- Seller pilih ekspedisi aktif/nonaktif

PAYMENT:
- Midtrans untuk MVP
- Escrow untuk fisik (tahan dana)
- Digital → langsung cair setelah delivery

ALAMAT:
- wilayah.id API (open source, gratis)
- Provinsi → Kota → Kecamatan → Kelurahan → Kode Pos otomatis

CHAT:
- Socket.io (WebSocket)
- Realtime buyer ↔ seller

STORAGE:
- Cloudflare R2 (sudah partial)
- diskStorage sebagai fallback

BAHASA:
- Indonesia + Inggris dari awal (i18n)

TIER PROGRESS:
- Tidak reset dari 0 setelah naik tier
- Sistem kumulatif
```

---

## Aturan Pengembangan

```
SEBELUM MULAI CODING:
1. Diskusikan dulu jika ada perubahan besar
2. Minta izin + berikan alasan
3. Buat migration SQL sebelum ubah entity
4. Test di local dulu sebelum commit
5. Commit setelah setiap milestone selesai

URUTAN KERJA YANG BENAR:
Database migration → Backend entity → Backend service →
Backend controller → Backend test → Frontend types →
Frontend API call → Frontend UI → Test end-to-end → Commit
```
