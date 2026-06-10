# Mireng Feature Status
*Last updated: Juni 2026*

---

## Legend
```
✅ IMPLEMENTED  → sudah ada dan berfungsi
🔶 PARTIAL      → fondasi ada, belum lengkap
📋 PLANNED      → sudah didiskusikan, belum dibuat
❌ NOT STARTED  → belum sama sekali
```

---

## Core System

| Feature | Status | Notes |
|---|---|---|
| Authentication (JWT) | ✅ | login, profile, role guard |
| User Register | ✅ | email + password |
| User Profile (basic) | ✅ | nama, email |
| User Profile (lengkap) | ✅ | foto, bio, HP, gender, tanggal lahir |
| Ubah Password | ✅ | validasi password lama |
| Upload Avatar | ✅ | diskStorage |
| Multi Alamat Buyer | ✅ | label, default, CRUD |
| Buyer Upgrade ke Seller | ✅ | PATCH /users/me/upgrade-seller |
| Store CRUD | ✅ | nama, deskripsi, kota, holiday mode |
| Product CRUD | ✅ | fisik + digital + service |
| Product Images | ✅ | gallery, thumbnail |
| Product Categories | ✅ | hierarki parent-child |
| Cart | ✅ | add, get, delete |
| Order Basic | ✅ | checkout, list, detail |
| Dashboard Seller UI | ✅ | stats, tabel, modal tambah/edit |
| Profile Page UI | ✅ | 4 tab: profil, alamat, keamanan, akun |
| Login Page Premium | ✅ | split layout, demo akun |
| Navbar Premium | ✅ | search, cart badge, dropdown user |
| Navbar Role-aware | ✅ | tampilan beda untuk buyer/seller/admin |
| AuthInitializer Fix | ✅ | tidak loading forever |

---

## Partial Features

| Feature | Status | Notes |
|---|---|---|
| Checkout Flow | 🔶 | basic only, belum: alamat, ongkir, payment |
| Cloudflare R2 | 🔶 | integrasi ada, belum stabil |
| Progressive KYC | 🔶 | fields ada di DB, workflow belum |
| Admin Foundation | 🔶 | panel ada, fitur belum lengkap |
| Review Foundation | 🔶 | field rating ada, UI belum |

---

## ✅ FASE 1 — Database Migration v3 (SELESAI)

| Feature | Status | Notes |
|---|---|---|
| seller_type di stores | ✅ | physical / digital |
| store_type di stores | ✅ | personal / umkm / official |
| seller_tier di stores | ✅ | regular / star / star_plus / top / official |
| badge_visible | ✅ | seller bisa sembunyikan badge |
| tier_progress | ✅ | angka progress tidak reset |
| Tabel store_verifications | ✅ | dokumen verifikasi toko |
| Tabel seller_applications | ✅ | permohonan saat pendaftaran ditutup |
| Tabel platform_settings | ✅ | admin toggle buka/tutup |
| categories.for_type | ✅ | pisah kategori fisik/digital |
| Progressive KYC fields | ✅ | kyc_verified, withdraw_blocked di users |
| Wallet KYC limit | ✅ | limit withdraw tanpa KYC |
| seller_tier_log | ✅ | log riwayat perubahan tier |

---

## ✅ FASE 2 — Backend API (SELESAI)

| Feature | Status | Notes |
|---|---|---|
| Platform Settings Module | ✅ | 19 default settings |
| Store Verifications Module | ✅ | upload, approve, reject |
| Seller Applications Module | ✅ | permohonan + review admin |
| Tier System Module | ✅ | cron job otomatis + admin override |
| Admin Toggle Pendaftaran | ✅ | buka/tutup via platform_settings |
| Progressive KYC Withdraw | ✅ | block withdraw jika belum KYC |
| Admin Override Tier | ✅ | manual naik/turun + notifikasi |
| Total Endpoint Baru | ✅ | 16 endpoint |

---

## 🔶 FASE 3 — Frontend (PARTIAL)

| Feature | Status | Notes |
|---|---|---|
| Form Buka Toko v2 | ✅ | 6 steps (tipe seller, tipe toko, info, lokasi, dokumen, review) |
| Halaman Toko Publik `/stores/[slug]` | ✅ | banner, info, produk |
| Dashboard Tier `/dashboard/tier` | ✅ | progress bar, notifikasi |
| Admin Panel `/admin` | ✅ | dashboard statistik |
| Admin Verifikasi Toko | ✅ | `/admin/verifications` |
| Admin Seller Applications | ✅ | `/admin/seller-applications` |
| Admin Platform Settings | ✅ | `/admin/settings` |
| Middleware Proteksi `/admin/*` | ✅ | |
| WilayahSelector | 📋 | Provinsi → Kota → Kecamatan → Kelurahan |
| DocumentUpload Component | 📋 | upload dokumen verifikasi |
| StoreCard Component | 📋 | kartu toko di listing |
| Dashboard Seller v2 | 📋 | target per tier, analytics |
| Kategori Terpisah UI | 📋 | fisik vs digital di frontend |
| Seller Analytics | 📋 | statistik penjualan, konversi |

---

## 📋 FASE 4 — Integrasi Eksternal

| Feature | Status | Notes |
|---|---|---|
| Raja Ongkir API | 📋 | cek ongkir otomatis |
| Midtrans Payment | 📋 | VA, QRIS, e-wallet, CC, COD |
| Escrow System | 📋 | tahan dana sampai buyer konfirmasi |
| COD Support | 📋 | untuk produk fisik |
| WebSocket / Socket.io | 📋 | infrastruktur realtime |
| Chat Real-time | 📋 | buyer ↔ seller |
| Email Notifikasi | 📋 | Nodemailer / Resend |

---

## 📋 FASE 5 — Fitur Lanjutan

| Feature | Status | Notes |
|---|---|---|
| Voucher Platform | 📋 | admin buat voucher global |
| Voucher Toko | 📋 | seller buat voucher toko |
| Flash Sale | 📋 | waktu + kuota terbatas |
| Diskon Produk | 📋 | coret harga |
| Wishlist | 📋 | buyer simpan produk favorit |
| Follow Toko | 📋 | ikuti toko seller |
| Review + Foto | 📋 | review dengan foto + balasan seller |
| Refund & Mediasi | 📋 | negosiasi, admin mediasi |
| Notifikasi In-app | 📋 | bell icon, real-time |
| Notifikasi Email | 📋 | event penting |
| Wallet Buyer | 📋 | saldo refund / cashback |
| Wallet Seller | 📋 | saldo penjualan, tarik dana |

---

## 📋 FASE 6 — Deploy & Production

| Feature | Status | Notes |
|---|---|---|
| Docker Compose | 📋 | frontend + backend + postgres |
| VPS Deploy Backend | 📋 | Ubuntu VPS |
| Vercel Frontend | 📋 | |
| Domain + SSL | 📋 | Nginx reverse proxy |
| CI/CD GitHub Actions | 📋 | |
| i18n Indonesia + Inggris | 📋 | dari awal |
| Monitoring | 📋 | Sentry / Uptime Robot |

---

## Keputusan Desain Yang Sudah Final

```
✅ 1 seller = 1 tipe toko (FISIK atau DIGITAL, tidak keduanya)
✅ Progressive KYC: daftar bebas, verif WAJIB saat withdraw
✅ Tier: Regular → Star → Star+ → Top Seller → Official Store
✅ Progress tier TIDAK reset dari 0 setelah naik
✅ Seller bisa sembunyikan badge (progress tetap jalan)
✅ Admin bisa buka/tutup pendaftaran seller
✅ Saat ditutup: bisa ajukan permohonan khusus
✅ Raja Ongkir (bisa ganti Biteship nanti)
✅ Seller pilih ekspedisi yang diaktifkan/dinonaktifkan
✅ Komisi: Regular paling rendah, naik per tier
✅ COD tersedia untuk produk fisik
✅ Review opsional + ada reminder/dorongan
✅ Review bisa dibalas seller + ada foto
✅ Chat real-time WebSocket
✅ Notifikasi in-app + email
✅ Bahasa: Indonesia + Inggris dari awal
✅ Tidak ada limit transaksi per tier
✅ Boost produk: gratis dulu, berbayar nanti
✅ Refund: negosiasi buyer-seller, admin mediasi
✅ Alamat: wilayah.id API otomatis
✅ Voucher: platform + toko
✅ Flash sale + diskon biasa
```
