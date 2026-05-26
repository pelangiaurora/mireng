# Mireng Feature Status

# Legend

IMPLEMENTED
= sudah tersedia dan digunakan

PARTIAL
= sudah ada fondasi namun belum lengkap

PLANNED
= masih roadmap / PRD / belum dibuat

EXPERIMENTAL
= masih percobaan / belum stabil

---

# Core System

| Feature | Status | Notes |
|---|---|---|
| Authentication | IMPLEMENTED | JWT auth + profile |
| User System | IMPLEMENTED | basic user profile |
| Seller Role | IMPLEMENTED | string-based role |
| Store System | IMPLEMENTED | seller store foundation |
| Product System | IMPLEMENTED | physical + digital + service |
| Product Upload | IMPLEMENTED | multer upload |
| Product Gallery | IMPLEMENTED | image support |
| Category System | IMPLEMENTED | category relation |
| Cart System | IMPLEMENTED | basic cart |
| Order System | IMPLEMENTED | basic checkout/order |

---

# Partial Features

| Feature | Status | Notes |
|---|---|---|
| Checkout Flow | PARTIAL | basic checkout only |
| KYC System | PARTIAL | fields exist, workflow incomplete |
| Admin Foundation | PARTIAL | role foundation exists |
| Review Foundation | PARTIAL | rating fields exist |
| Cloudflare R2 | PARTIAL | integration not finalized |
| Upload Architecture | PARTIAL | hybrid storage approach |

---

# Planned Features

| Feature | Status | Notes |
|---|---|---|
| Midtrans Payment | PLANNED | payment gateway integration |
| RajaOngkir | PLANNED | shipping integration |
| Wallet System | PLANNED | seller/buyer balance |
| Escrow System | PLANNED | payment holding |
| Seller Tier | PLANNED | seller reputation system |
| Voucher System | PLANNED | platform/store vouchers |
| Flash Sale | PLANNED | promotional campaign |
| Wishlist | PLANNED | user favorite products |
| Follow Store | PLANNED | seller following |
| Notification System | PLANNED | realtime + in-app |
| Realtime Chat | PLANNED | buyer/seller communication |
| Websocket System | PLANNED | realtime infrastructure |
| Seller Analytics | PLANNED | dashboard analytics |
| Refund System | PLANNED | dispute/refund flow |
| Shipping Tracking | PLANNED | logistics tracking |

---

# Current Architecture Reality

Mireng is currently:
- marketplace foundation stage
- actively evolving
- architecture still growing

AI MUST understand:
- not all PRD features are implemented
- roadmap != existing implementation
- some systems are still experimental/evolving

---

# Existing Technical Reality

Current backend:
- modular NestJS
- TypeORM
- PostgreSQL
- JWT auth

Current frontend:
- Next.js App Router
- Zustand auth
- Axios API communication

Current upload:
- multer
- diskStorage
- memoryStorage
- partial R2 integration

---

# Important AI Notes

AI MUST:
- check actual implementation before assuming
- preserve current architecture style
- avoid rewriting stable systems unnecessarily

AI SHOULD:
- extend incrementally
- reuse existing patterns
- preserve compatibility

---

# Planned Long-Term Direction

Mireng aims to become:
- scalable hybrid marketplace
- multi-vendor ecosystem
- realtime commerce platform

Future systems expected:
- escrow
- wallet
- realtime communication
- advanced moderation
- seller reputation ecosystem
- scalable logistics/payment infrastructure