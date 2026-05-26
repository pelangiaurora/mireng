# Mireng Feature Status
*Last updated: Mei 2026*

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
| Halaman Buka Toko | ✅ | multi-step form (4 langkah) |
| Login Page Premium | ✅ | split layout, demo akun |
| Navbar Premium | ✅ | search, cart badge, dropdown user |

---

## Partial Features

| Feature | Status | Notes |
|---|---|---|
| Checkout Flow | 🔶 | basic only, belum: alamat, ongkir, payment |
| KYC System | 🔶 | field ada di DB, workflow belum |
| Admin Foundation | 🔶 | role ada, panel belum |
| Review Foundation | 🔶 | field rating ada, UI belum |
| Cloudflare R2 | 🔶 | integrasi ada, belum stabil |
| Store Verification | 🔶 | field ada, flow admin belum |
| Progressive KYC | 🔶 | konsep disepakati, belum implemented |

---

## Planned — FASE 1 (Database Migration v3)

| Feature | Status | Notes |
|---|---|---|
| seller_type di stores | 📋 | physical/digital |
| store_type di stores | 📋 | personal/umkm/official |
| seller_tier di stores | 📋 | regular/star/star_plus/top/official |
| badge_visible | 📋 | seller bisa sembunyikan badge |
| tier_progress | 📋 | angka progress tidak reset |
| Tabel store_verifications | 📋 | dokumen verifikasi toko |
| Tabel seller_applications | 📋 | permohonan saat pendaftaran ditutup |
| Tabel platform_settings | 📋 | admin toggle buka/tutup |
| categories.for_type | 📋 | pisah kategori fisik/digital |
| Progressive KYC fields | 📋 | kyc_verified, withdraw_blocked |

---

## Planned — FASE 2 (Backend API)

| Feature | Status | Notes |
|---|---|---|
| Seller Registration Flow | 📋 | buka/tutup, permohonan khusus |
| Admin Toggle Pendaftaran | 📋 | buka/tutup via platform_settings |
| Tier System Otomatis | 📋 | cron job cek target per seller |
| Admin Override Tier | 📋 | manual naik/turun + notifikasi |
| Progressive KYC Withdraw | 📋 | block withdraw jika belum KYC |
| Store Verification API | 📋 | admin approve/reject |
| Platform Settings API | 📋 | admin kelola setting global |
| Seller Application API | 📋 | permohonan + review admin |

---

## Planned — FASE 3 (Frontend)

| Feature | Status | Notes |
|---|---|---|
| Form Buka Toko v2 | 📋 | pilih seller_type + store_type + dokumen |
| Alamat Indonesia Otomatis | 📋 | wilayah.id API |
| Admin Panel Verifikasi | 📋 | review dokumen, approve/reject |
| Dashboard Tier Progress | 📋 | progress bar + notifikasi tier |
| Halaman Toko Publik | 📋 | store page + produk + rating |
| Seller Analytics | 📋 | statistik penjualan, konversi |
| Kategori Terpisah UI | 📋 | fisik vs digital di frontend |

---

## Planned — FASE 4 (Integrasi Eksternal)

| Feature | Status | Notes |
|---|---|---|
| Raja Ongkir API | 📋 | cek ongkir otomatis, bisa ganti Biteship |
| Midtrans Payment | 📋 | VA, QRIS, e-wallet, CC, COD |
| Escrow System | 📋 | tahan dana sampai buyer konfirmasi |
| COD Support | 📋 | untuk produk fisik |
| WebSocket/Socket.io | 📋 | infrastruktur realtime |
| Chat Real-time | 📋 | buyer ↔ seller |
| Email Notifikasi | 📋 | Nodemailer/Resend |

---

## Planned — FASE 5 (Fitur Lanjutan)

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
| Wallet Buyer | 📋 | saldo refund/cashback |
| Wallet Seller | 📋 | saldo penjualan, tarik dana |

---

## Planned — FASE 6 (Deploy)

| Feature | Status | Notes |
|---|---|---|
| Docker Compose | 📋 | frontend + backend + postgres |
| VPS Deploy Backend | 📋 | Railway/VPS Ubuntu |
| Vercel Frontend | 📋 | |
| Domain + SSL | 📋 | |
| CI/CD GitHub Actions | 📋 | |
| i18n Indonesia + Inggris | 📋 | dari awal |
| Boost Produk Berbayar | 📋 | gratis dulu, nanti berbayar |

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
✅ Raja Ongkir (bisa ganti Biteship/ekspedisi sendiri nanti)
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
