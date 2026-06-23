# 🗺️ Mireng — Roadmap & Development Progress

> Marketplace Indonesia — Target: seperti Shopee & Blibli
> Dokumen ini diperbarui setiap sesi development.

---

## 📊 Status Keseluruhan

| Fase | Status | Progress |
|------|--------|----------|
| Fase 1 — MVP Core | 🟡 In Progress | ~40% |
| Fase 2 — Growth Features | ⏳ Belum mulai | 0% |
| Fase 3 — Monetization | ⏳ Belum mulai | 0% |
| Fase 4 — Advanced | ⏳ Belum mulai | 0% |

---

## ✅ FASE 1 — MVP Core

### Yang sudah selesai

- [x] **Auth & Register** — login, register, JWT, role-based guard
- [x] **Store Create** — multi-step form (upgrade seller, tipe toko, info, lokasi, review)
  - [x] StepClosed (registrasi seller ditutup → form aplikasi)
  - [x] Registration check (cek apakah toko sudah ada)
- [x] **Admin Module Backend** (NestJS)
  - [x] `GET /admin/dashboard/stats`
  - [x] `GET/PATCH /admin/users` (list, suspend, activate, KYC verify)
  - [x] `GET/PATCH /admin/stores` (list, verify, reject, suspend, ban, activate)
  - [x] `GET/PATCH /admin/seller-applications` (list, approve, reject)
  - [x] `GET/PATCH /admin/settings` (platform settings CRUD)
  - [x] `GET/PATCH /admin/verifications` (store verification queue)
- [x] **Wilayah Indonesia Integration**
  - [x] NestJS proxy controller `/wilayah/*` (hindari CORS)
  - [x] Data source: ibnux GitHub Pages (provinsi/kab/kec/kelurahan)
  - [x] Kodepos: cahyadsn `wilayah_kodepos` di PostgreSQL (83k+ desa)
  - [x] Cache in-memory 24 jam di backend
  - [x] `wilayahStore.ts` — Zustand cache frontend
  - [x] `useWilayah.ts` — cascading hook + reverse lookup kodepos
  - [x] `AddressForm.tsx` — reusable component (Provinsi→Kab→Kec→Kel→Kodepos)
  - [x] Integrasi ke `stores/create` Step Lokasi
- [x] **Admin Panel Frontend** (file siap, perlu test)
  - [x] `AdminLayout` — sidebar + topbar terpisah dari main app
  - [x] `AdminGuard` — proteksi route via Cookie JWT
  - [x] `AdminSidebar` — navigasi 6 menu
  - [x] Dashboard page (stats cards)
  - [x] Users page (table + filter + aksi)
  - [x] Stores page (filter verifStatus + aksi)
  - [x] Applications page (approve/reject + detail modal)
  - [x] Settings page (toggle boolean + inline edit)
  - [x] Verifications page (dokumen viewer + approve/reject)
- [x] **Admin Seeder** — buat akun admin otomatis
- [x] **Database migrations** — kolom `village` di `user_addresses` & `stores`

---

### Yang belum selesai di Fase 1

- [ ] **Admin Panel Frontend — Test & Aktivasi**
  - [ ] Test login admin di `/admin`
  - [ ] Test semua halaman & aksi
  - [ ] Fix bug jika ada

- [ ] **Profile Addresses** — kelola alamat pengiriman buyer/seller
  - [ ] Halaman `/profile/addresses`
  - [ ] Form tambah/edit alamat (pakai `AddressForm`)
  - [ ] Set alamat default
  - [ ] Backend endpoint `addresses` CRUD

- [ ] **Document Upload / KYC**
  - [ ] Upload KTP, selfie, NIB, SIUP, Akta, NPWP, sertifikat merek
  - [ ] File storage (lokal → nantinya S3/Cloudflare R2)
  - [ ] Preview dokumen di admin panel

- [ ] **Checkout Flow**
  - [ ] Pilih/tambah alamat pengiriman
  - [ ] Kalkulasi ongkos kirim
  - [ ] Summary pesanan

- [ ] **Payment Gateway**
  - [ ] Integrasi Midtrans atau Xendit
  - [ ] Callback handler
  - [ ] Status pembayaran

- [ ] **Order Management**
  - [ ] Buyer: track pesanan
  - [ ] Seller: konfirmasi, proses, kirim
  - [ ] Admin: monitor semua pesanan

---

## 🟡 FASE 2 — Growth Features

- [ ] **Flash Sale**
  - [ ] Admin buat & jadwalkan flash sale
  - [ ] Admin set produk + harga flash sale
  - [ ] Seller daftar ikut flash sale
  - [ ] Admin approve/reject produk seller untuk flash sale
  - [ ] Halaman Flash Sale publik (countdown timer)
  - [ ] Banting harga per event khusus

- [ ] **Banner & Slider Homepage**
  - [ ] Admin upload & kelola banner
  - [ ] Admin atur urutan slider
  - [ ] Link banner ke produk/kategori/promo

- [ ] **Voucher & Promo**
  - [ ] Admin buat voucher platform (diskon, gratis ongkir, cashback)
  - [ ] Seller buat voucher toko
  - [ ] Klaim & validasi voucher saat checkout
  - [ ] Promo produk individual (markup + diskon admin)

- [ ] **Wishlist** — buyer simpan produk favorit

- [ ] **Ulasan & Rating**
  - [ ] Buyer review setelah pesanan selesai
  - [ ] Rating toko & produk
  - [ ] Moderasi ulasan oleh admin

---

## 🟠 FASE 3 — Monetization

- [ ] **Wallet & Withdraw Seller**
  - [ ] Saldo seller dari penjualan
  - [ ] Request penarikan dana
  - [ ] Admin approve withdrawal

- [ ] **Komisi & Fee Otomatis**
  - [ ] Komisi platform per transaksi
  - [ ] Fee flash sale / featured
  - [ ] Laporan komisi admin

- [ ] **Analitik Mendalam**
  - [ ] Revenue report admin
  - [ ] Top seller, top produk
  - [ ] Seller analytics dashboard

---

## 🔵 FASE 4 — Advanced

- [ ] **Live Chat** — buyer ↔ seller (WebSocket)
- [ ] **Notifikasi Real-time** — pesanan, promo, chat (WebSocket/SSE)
- [ ] **Rekomendasi Produk** — based on history (simple ML)
- [ ] **SEO & Performance** — meta tags, OG image, sitemap
- [ ] **Mobile App** — React Native (long term)

---

## 🏗️ Tech Stack

### Backend
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL + TypeORM
- **Auth:** JWT (access token) + Cookies
- **File Upload:** Multer (lokal) → nantinya S3/R2
- **Data Wilayah:** ibnux GitHub Pages + cahyadsn DB

### Frontend
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP:** Axios
- **Auth:** JWT via js-cookie (`key: 'token'`)

### Infrastructure
- **Dev:** WSL (Windows 10) + VS Code
- **Production:** Ubuntu VPS
- **Reverse Proxy:** Nginx (planned)

---

## 📁 Struktur Folder Penting

```
mireng/
├── backend/
│   └── src/
│       ├── admin/              ← Admin Module (6 controllers)
│       ├── addresses/          ← User addresses CRUD
│       ├── auth/               ← JWT auth
│       ├── stores/             ← Store management
│       ├── seller-applications/
│       ├── store-verifications/
│       ├── platform-settings/
│       ├── wilayah/            ← Proxy wilayah.id (CORS bypass)
│       └── database/
│           ├── migrations/
│           └── seeds/          ← Admin seeder
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── admin/          ← Admin Panel (separate layout)
│       │   ├── stores/create/  ← Store creation flow
│       │   ├── profile/        ← User profile
│       │   └── checkout/       ← Checkout flow
│       ├── components/
│       │   └── address/
│       │       └── AddressForm.tsx  ← Reusable address form
│       ├── hooks/
│       │   └── useWilayah.ts   ← Cascading address hook
│       └── store/
│           ├── auth.store.ts
│           └── wilayahStore.ts ← Wilayah cache
│
├── wilayah_kodepos/            ← cahyadsn kodepos data (83k desa)
└── wilayah_ref/                ← cahyadsn wilayah referensi
```

---

## 🔑 Catatan Teknis Penting

```
Entity field names:
- Store: verifStatus, verifNote, verifReviewedAt, verifReviewedBy, seller (bukan user)
- SellerApplication: rejectionReason, adminNotes, reviewedBy, reviewedAt
- StoreVerification: notesFromAdmin, reviewedBy, reviewedAt
- UserAddress: village (baru ditambah)

Auth:
- Token disimpan di Cookie key: 'token' (via js-cookie)
- RolesGuard: instantiated manual → new RolesGuard(['admin'])
- Tidak ada data-source.ts → pakai @InjectDataSource() untuk raw query

Admin credentials (development):
- Email: admin@mireng.id
- Password: Admin@Mireng2025!

Database:
- DB: mireng, User: mirenguser, Host: 127.0.0.1:5432
- Tabel kodepos: wilayah_kodepos (kode varchar BPS format "35.78.01.0001")
- ibnux code format: "3578010001" → konversi via toBPSCode()

Wilayah API:
- Backend proxy: GET /wilayah/provinces|regencies/:code|districts/:code|villages/:code
- Source: ibnux.github.io/data-indonesia (cascade)
- Kodepos: query wilayah_kodepos di PostgreSQL
```

---

## 📝 Cara Update Dokumen Ini

1. Setiap fitur selesai → ubah `- [ ]` jadi `- [x]`
2. Setiap sesi development → update bagian "Yang sudah selesai"
3. Fitur baru yang muncul → tambahkan di fase yang sesuai
4. Catatan teknis penting → tambahkan di bagian "Catatan Teknis"

---

*Last updated: Juni 2026*
*Development session: Admin Module + Wilayah Indonesia Integration*