# Mireng Marketplace — Roadmap Detail 

_Dokumen ini berisi rencana pengembangan per fase_
_Last updated: Juni 2026_

---

## Status Saat Ini (Juni 2026)

```
✅ FASE 1 SELESAI — Database Migration v3
✅ FASE 2 SELESAI — Backend API Baru (bisa ditambah & dikembangkan lagi sesuai kebutuhan)
🔶 FASE 3 PARTIAL — Frontend Baru (sebagian selesai)
📋 FASE 4 — Integrasi Eksternal
📋 FASE 5 — Fitur Lanjutan
📋 FASE 6 — Deploy & Production
```

---

## ✅ FASE 1 — Database Migration v3 (SELESAI)

- 33 tabel (tambah 4 tabel baru dari 29)
- Kolom baru di `stores`: `seller_type`, `store_type`, `seller_tier`, `badge_visible`, `tier_progress`
- Tabel baru: `store_verifications`, `seller_applications`, `platform_settings`, `seller_tier_log`
- Update `categories`: kolom `for_type` (fisik/digital)
- Update `users`: progressive KYC fields (`kyc_verified`, `withdraw_blocked`)
- Update `wallets`: limit withdraw tanpa KYC

---

## ✅ FASE 2 — Backend API Baru (SELESAI)

### Modul Baru
- `platform-settings` — 19 default settings, admin toggle
- `store-verifications` — upload dokumen, admin approve/reject
- `seller-applications` — permohonan saat pendaftaran ditutup
- `tier-system` — cron job otomatis, admin override

### Total Endpoint Baru: 16
- Seller registration flow (buka/tutup toggle)
- Progressive KYC + withdraw validation
- Admin panel API lengkap
- Platform settings API

---

## 🔶 FASE 3 — Frontend Baru (PARTIAL)

### ✅ Sudah Selesai
- Form buka toko v2 — 6 steps (pilih tipe seller, tipe toko, info, lokasi, dokumen, review)
- Halaman toko publik (`/stores/[slug]`)
- Dashboard tier (`/dashboard/tier`) — progress bar, notifikasi
- Admin panel (`/admin`, `/admin/verifications`, `/admin/seller-applications`, `/admin/settings`)
- Middleware proteksi `/admin/*`
- AuthInitializer fix (tidak loading forever)
- Navbar role-aware (buyer / seller / admin)

### 📋 Belum Selesai
- `WilayahSelector` — Provinsi → Kota → Kecamatan → Kelurahan (wilayah.id API)
- `DocumentUpload` — upload dokumen verifikasi di form toko
- `StoreCard` — kartu toko di listing publik
- Dashboard Seller v2 — target yang harus dicapai per tier
- Kategori terpisah UI — fisik vs digital di frontend
- Seller analytics (statistik penjualan, konversi)

*Estimasi sisa: 2-3 hari*

---

## 📋 FASE 4 — Integrasi Eksternal
*Estimasi: 7-10 hari*

### Raja Ongkir
- Daftar di rajaongkir.com → tambah `RAJA_ONGKIR_KEY` di .env
- Buat `shipping` module di backend
- Endpoint: `POST /shipping/cost`
- Frontend: selector ekspedisi + ongkir di checkout

### Midtrans
- Daftar di midtrans.com → tambah `MIDTRANS_KEY` di .env
- Buat `payment` module di backend
- Endpoint: `POST /payments/create`, `POST /payments/callback`
- Frontend: payment page + status tracking

### WebSocket (Chat Real-time)
- Install socket.io di backend
- Buat chat gateway (NestJS WebSocket)
- Frontend: chat component dengan Socket.io client
- Fitur: kirim pesan, gambar, share produk

### Email (Nodemailer / Resend)
- Setup SMTP atau Resend API
- Template email: order, verifikasi, tier, dll
- Trigger dari backend events

---

## 📋 FASE 5 — Fitur Lanjutan
*Estimasi: 10-14 hari*

### Voucher & Promosi
- Platform voucher (admin buat voucher global)
- Toko voucher (seller buat voucher toko)
- Flash sale (waktu + kuota terbatas)
- Diskon produk (coret harga)

### Sosial & Engagement
- Wishlist produk
- Follow toko
- Review + foto + balasan seller
- Diskusi produk publik

### Wallet & Keuangan
- Wallet buyer (saldo refund / cashback)
- Wallet seller (saldo penjualan)
- Withdraw (wajib KYC verified)
- Riwayat transaksi wallet

### Refund & Mediasi
- Buyer ajukan retur + foto bukti
- Seller respons
- Admin mediasi jika tidak sepakat
- Refund ke wallet buyer

---

## 📋 FASE 6 — Deploy & Production
*Estimasi: 3-5 hari*

1. Docker Compose (frontend + backend + postgres)
2. Environment production (`.env.production`)
3. VPS Ubuntu (backend + database)
4. Vercel (frontend)
5. Domain + SSL (Nginx reverse proxy)
6. GitHub Actions CI/CD
7. Monitoring (Sentry / Uptime Robot)

---

## Keputusan Teknis Yang Sudah Final

```
PENGIRIMAN:
- Raja Ongkir untuk MVP
- Arsitektur modular → bisa ganti Biteship nanti
- Seller pilih ekspedisi aktif/nonaktif

PAYMENT:
- Midtrans untuk MVP
- Escrow untuk fisik (tahan dana sampai buyer konfirmasi)
- Digital → langsung cair setelah delivery

ALAMAT:
- wilayah.id API (open source, gratis)
- Provinsi → Kota → Kecamatan → Kelurahan → Kode Pos otomatis

CHAT:
- Socket.io (WebSocket) — realtime buyer ↔ seller

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

## Urutan Kerja Yang Benar

```
Database migration → Backend entity → Backend service →
Backend controller → Backend test → Frontend types →
Frontend API call → Frontend UI → Test end-to-end → Commit
```
