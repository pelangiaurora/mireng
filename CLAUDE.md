# CLAUDE.md — Mireng Marketplace
*File ini dibaca otomatis oleh Claude. Baca SEMUA sebelum melakukan apapun.*

---

## ⚠️ ATURAN UTAMA UNTUK CLAUDE

```
SEBELUM MELAKUKAN APAPUN:
1. Baca file ini sampai selesai
2. Baca PROJECT_CONTEXT.md
3. Baca FEATURE_STATUS.md
4. Analisa modul yang relevan di codebase
5. MINTA IZIN + berikan alasan sebelum bertindak

JANGAN PERNAH:
- Modifikasi database schema tanpa izin
- Install dependency baru tanpa izin
- Refactor arsitektur tanpa izin
- Ubah auth flow tanpa izin
- Ubah API contract tanpa izin
- Hapus atau rename file penting tanpa izin
- Berasumsi fitur sudah ada hanya karena ada di PRD
```

---

## 🏪 Tentang Mireng

Mireng adalah **marketplace multi-seller Indonesia** untuk produk fisik & digital.
Mirip Tokopedia + Shopee, dikembangkan secara incremental.

**GitHub:** https://github.com/pelangiaurora/mireng
**Dev Environment:** WSL (Windows 10) + Debian VM
**Backend:** http://localhost:3000 | **Frontend:** http://localhost:3001
**Swagger:** http://localhost:3000/api

---

## 🔧 Tech Stack

```
BACKEND:          FRONTEND:         INFRASTRUCTURE:
NestJS 11         Next.js 16        PostgreSQL 17
TypeORM           React 19          Cloudflare R2
PostgreSQL        TypeScript        WSL/Debian
JWT Auth          TailwindCSS v4    GitHub
Swagger           Zustand
Multer            Axios
```

**Database user:** mirenguser | **DB name:** mireng
**synchronize: false** → WAJIB pakai manual migration

---

## 👥 Role System

```
guest    → browse saja, tidak bisa transaksi
buyer    → default setelah register, bisa beli
seller   → buyer yang upgrade, bisa jual (FISIK atau DIGITAL, tidak keduanya)
admin    → kelola platform penuh
```

### Seller Type (PENTING - belum fully implemented)
```
DIGITAL_SELLER  → hanya jual produk digital (akun, file, lisensi, template)
PHYSICAL_SELLER → hanya jual produk fisik (butuh verifikasi lebih ketat)
```

### Store Type (untuk fisik)
```
personal   → Perorangan (KTP + selfie)
umkm       → CV/UD/Firma/Koperasi (KTP + NIB/SIUP + Akta)
official   → PT/Brand resmi (NPWP + SIUP + Akta PT)
```

### Seller Tier
```
regular      → tidak berlabel (default)
star         → ⭐ target awal tercapai
star_plus    → ⭐⭐ target menengah
top_seller   → 🏆 performa terbaik
official     → 🏅 manual oleh admin
```
- Progress TIDAK reset dari 0 setelah naik tier
- Admin bisa override + kirim notifikasi ke seller
- Seller bisa sembunyikan badge (progress tetap jalan)

---

## 🗄️ Database (29 tabel)

```
CORE: users, stores, products, categories, product_images,
      product_variants, product_stocks

TRANSACTION: carts, cart_items, orders, order_items,
             order_stores, payments

SOCIAL: reviews, wishlists, store_follows, chats, chat_messages

PLATFORM: notifications, banners, flash_sales, flash_sale_products,
          vouchers, voucher_usage, wallet_transactions, wallets,
          user_addresses
```

**PLANNED (belum ada):** store_verifications, seller_applications,
platform_settings, seller_tier_log

---

## 📁 Struktur Backend

```
backend/src/
├── auth/           ✅ JWT login, profile, role guard
├── users/          ✅ register, profile, update, password, upgrade-seller
├── stores/         ✅ CRUD toko, holiday mode, verifikasi (partial)
├── products/       ✅ CRUD, fisik+digital, relasi toko+kategori
├── product-images/ ✅ gallery, thumbnail
├── cart/           ✅ add, get, delete item
├── orders/         ✅ checkout basic, list, detail
├── categories/     ✅ hierarki parent-child
├── addresses/      ✅ multi alamat buyer
├── upload/         ✅ multer + R2 (partial)
└── common/         ✅ filters, interceptors, R2 service
```

---

## 📁 Struktur Frontend

```
frontend/src/app/
├── page.tsx              ✅ home + product grid
├── login/page.tsx        ✅ premium split layout
├── register/page.tsx     ✅ form register
├── profile/page.tsx      ✅ tabs: profil, alamat, keamanan, akun
├── cart/page.tsx         ✅ keranjang + order summary
├── orders/page.tsx       ✅ riwayat pesanan + status
├── products/[id]/page.tsx ✅ detail produk + gallery
├── dashboard/products/   ✅ seller dashboard premium
└── stores/create/        ✅ form buka toko multi-step (partial)
```

---

## 🔄 Auth Flow

```
1. POST /auth/login → JWT access_token
2. Token disimpan di cookie (js-cookie)
3. Axios interceptor inject Bearer token otomatis
4. GET /auth/profile → user state di Zustand
5. AuthInitializer component → fetch profile saat app load

CATATAN: Auth profile mengembalikan {userId, email, role}
         (BUKAN {id, name} — userId bukan id!)
```

---

## 💰 Model Bisnis

```
Regular    → komisi rendah, bebas biaya admin
Star       → komisi sedikit naik + fitur tambahan
Star+      → komisi naik + lebih banyak fitur
Top Seller → komisi tertinggi + benefit maksimal
Official   → negosiasi khusus dengan admin

Progressive KYC:
- Seller bisa daftar & jualan TANPA verifikasi
- Verifikasi WAJIB saat mau tarik saldo (withdraw)
- Admin bisa atur: buka/tutup pendaftaran seller
```

---

## 🗺️ Roadmap Pengembangan

### FASE 1 — Database Migration v3 (NEXT)
```
- Tambah: seller_type, store_type, seller_tier di stores
- Tambah: tabel store_verifications
- Tambah: tabel seller_applications (permohonan saat ditutup)
- Tambah: tabel platform_settings (admin toggle)
- Update: categories (for_type: fisik/digital)
- Update: users (progressive KYC fields)
- Update: wallet (limit withdraw tanpa KYC)
```

### FASE 2 — Backend API Baru
```
- Seller registration flow (buka/tutup toggle)
- Progressive KYC + withdraw validation
- Tier system otomatis (cron job)
- Admin panel API lengkap
- Platform settings API
```

### FASE 3 — Frontend Baru
```
- Form buka toko (pilih seller type + store type + dokumen)
- Alamat Indonesia otomatis (wilayah.id API)
- Admin panel verifikasi toko
- Dashboard seller tier & progress bar
- Halaman toko publik (store page)
```

### FASE 4 — Integrasi Eksternal
```
- Raja Ongkir API (cek ongkir otomatis)
- Midtrans (payment gateway)
- WebSocket (chat real-time)
- Email notifikasi (Nodemailer/Resend)
```

### FASE 5 — Fitur Lanjutan
```
- Voucher (platform + toko)
- Flash sale
- Wishlist + Follow toko
- Review dengan foto + balasan seller
- Refund & mediasi admin
- Seller analytics dashboard
```

### FASE 6 — Deploy & Production
```
- Docker compose
- VPS deploy (backend)
- Vercel (frontend)
- Domain + SSL
- CI/CD GitHub Actions
```

---

## 🌐 API Endpoints Yang Ada

```
AUTH:     POST /auth/login, GET /auth/profile
USERS:    POST /users/register, GET/PATCH /users/me
          PATCH /users/me/avatar, /password, /upgrade-seller
          GET /users (admin), PATCH /users/:id/suspend
STORES:   GET /stores, GET /stores/:slug
          POST /stores, PATCH /stores/seller/mine
          PATCH /stores/seller/mine/holiday
          PATCH /stores/:id/verify
PRODUCTS: GET/POST /products, GET/PATCH/DELETE /products/:id
          POST /products/:id/images/upload
CART:     POST /cart/add, GET /cart, DELETE /cart/item/:id
ORDERS:   POST /orders/checkout, GET /orders, GET /orders/:id
CATEGORIES: GET/POST /categories, GET /categories/:slug
ADDRESSES:  GET/POST /addresses, GET/PATCH/DELETE /addresses/:id
            PATCH /addresses/:id/set-default
```

---

## ⚠️ Hal Penting Yang Harus Diketahui

1. **PORT:** Backend=3000, Frontend=3001
2. **DB:** gunakan `-h 127.0.0.1` untuk koneksi PostgreSQL di WSL
3. **Token:** JWT expired setiap kali backend restart (dev mode)
4. **synchronize: false** → JANGAN ubah entity tanpa migration manual
5. **seller_type** belum ada di DB — masih planned
6. **Auth profile** kembalikan `userId` bukan `id`
7. **Products API** kembalikan `{data: [], meta: {}}` (paginated)
8. **Bahasa:** Indonesia + Inggris (i18n planned)

---

## 📚 Dokumen Referensi

```
docs/PRD-mireng-marketplace.md  → spesifikasi lengkap semua fitur
AGENTS.md                        → aturan untuk semua AI agent
ARCHITECTURE.md                  → arsitektur teknis detail
DEVELOPMENT_RULES.md             → aturan development
FEATURE_STATUS.md                → status implementasi per fitur
ROADMAP.md                       → roadmap detail per fase
```

---

## 🧠 ECC Skills & Rules

> Dibaca Claude saat mengerjakan modul terkait. Skills ada di `.claude/skills/ecc/`.

### Backend
- `nestjs-patterns`     → NestJS module / service / controller
- `postgres-patterns`   → TypeORM entity / query
- `database-migrations` → File migration (wajib, synchronize: false)
- `backend-patterns`    → API design / response format
- `api-design`          → Rancang endpoint baru
- `redis-patterns`      → Cache / session

### Frontend
- `frontend-patterns`   → Next.js page / layout
- `react-patterns`      → React component / hooks
- `nextjs-turbopack`    → Next.js 16 config

### Quality & Security
- `security-review`     → JWT, KYC, payment flow
- `security-scan`       → Cek celah sebelum deploy
- `error-handling`      → Konsistensi error response
- `tdd-workflow`        → Testing strategy
- `verification-loop`   → Verifikasi hasil implementasi

### DevOps
- `docker-patterns`     → docker-compose / Dockerfile
- `deployment-patterns` → Deploy ke VPS

### Rules (selalu ikuti)
- `common`      → naming, struktur, best practices
- `typescript`  → TypeScript strict conventions
- `react`       → React conventions
- `web`         → Web standards & accessibility
 