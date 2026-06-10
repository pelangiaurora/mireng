# Mireng Project Context 

## Project Summary

Mireng adalah marketplace multi-vendor Indonesia yang mendukung:
- produk fisik
- produk digital
- jasa/service

Mireng memiliki visi menjadi:
- hybrid commerce ecosystem
- scalable seller platform
- marketplace jangka panjang

Project memiliki arah seperti:
- Tokopedia
- Shopee
- hybrid digital marketplace

Namun tetap menggunakan development style yang practical dan incremental.

---

# Current Development Stage

Current stage:
FOUNDATION MARKETPLACE STAGE

Core marketplace foundation sudah tersedia:
- authentication
- product system
- store system
- upload system
- cart system
- order basic

Namun ecosystem marketplace masih berkembang.

---

# Current Backend Architecture

Backend:
- NestJS 11
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger
- Multer Upload

Architecture style:
- modular NestJS modules
- controller → service → entity
- REST API approach

Database:
- synchronize: false
- manual migration strategy

---

# Current Frontend Architecture

Frontend:
- Next.js 16
- React 19
- TailwindCSS v4
- Zustand
- Axios

Architecture style:
- App Router
- client-heavy rendering
- practical/simple frontend structure

Auth flow:
- login via API
- JWT token stored in cookies
- axios interceptor injects bearer token
- Zustand stores auth state

---

# Existing Core Modules

Backend modules currently available:
- auth
- users
- stores
- products
- product-images
- cart
- orders
- categories
- addresses
- upload

---

# Existing Product System

Current product system supports:
- physical products
- digital products
- service products

Current product features:
- category
- stock
- dimensions
- SKU
- image upload
- digital file fields
- seller relation
- store relation

---

# Existing Seller System

Current seller foundation:
- seller role
- store entity
- KYC fields
- store verification fields

Seller tier ecosystem is still planned.

---

# Current Authentication

Current authentication:
- JWT based
- bearer token
- role guard system
- seller protected endpoints

Roles currently exist but are still simple string-based roles.

---

# Current Upload System

Upload system currently uses:
- multer
- diskStorage
- memoryStorage
- partial Cloudflare R2 integration

Upload architecture is still evolving.

AI should avoid major upload rewrites without permission.

---

# Current API Philosophy

Backend uses REST API patterns:
- /auth/*
- /products/*
- /orders/*
- /stores/*

Response format is partially standardized.

Frontend currently uses:
- direct axios calls
- minimal abstraction
- Zustand auth state

---

# Current Development Philosophy

Mireng prioritizes:
- balanced development
- maintainability
- practical implementation
- scalable core systems

Project intentionally avoids:
- premature enterprise complexity
- unnecessary abstraction
- over-engineering

---

# AI Development Rules

AI SHOULD:
- preserve architecture consistency
- make incremental changes
- analyze existing implementation first
- reuse existing patterns

AI SHOULD NOT:
- massively rewrite modules
- introduce complex abstraction unnecessarily
- modify schema carelessly
- install dependencies without permission

---

# Feature Status Overview

IMPLEMENTED:
- auth
- stores
- products
- uploads
- cart
- basic order system

PARTIAL:
- checkout
- KYC
- admin foundation
- review foundation
- R2 integration

PLANNED:
- Midtrans
- RajaOngkir
- wallet
- seller tier
- realtime chat
- websocket
- notification system
- voucher system
- wishlist
- follow store
- flash sale
- escrow system

---

# Future Marketplace Direction

Planned future ecosystem:
- escrow payment flow
- wallet & balance system
- seller analytics
- realtime communication
- logistics integration
- advanced moderation
- seller reputation/tier system
- advanced notification system
- scalable marketplace infrastructure

AI should keep future scalability in mind while preserving current simplicity.

---

# Important Reality Check

Mireng is currently:
- actively evolving
- architecture still growing
- feature set still incomplete

AI MUST distinguish:
- implemented code
- partial implementation
- future roadmap
- PRD vision

Do not assume roadmap features already exist in the codebase.