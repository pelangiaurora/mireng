# Mireng Architecture 

# High Level Architecture

```text
Frontend (Next.js)
↓
REST API (Axios)
↓
Backend (NestJS)
↓
TypeORM
↓
PostgreSQL
```

Frontend Architecture

Frontend uses:

Next.js App Router
React 19
Zustand
Axios
TailwindCSS

Structure:

frontend/src/
├── app/
├── components/
├── hooks/
├── lib/
├── store/
└── types/
Frontend Responsibilities

Frontend handles:

UI rendering
authentication state
API communication
client interactions
page routing

Frontend currently uses:

direct axios API calls
Zustand auth store
client-heavy rendering
Frontend Auth Flow
Login Form
↓
POST /auth/login
↓
JWT access token returned
↓
Token stored in cookies
↓
Axios interceptor injects bearer token
↓
GET /auth/profile
↓
User state stored in Zustand
Backend Architecture

Backend uses:

NestJS modular architecture
TypeORM
PostgreSQL
JWT authentication

Structure:

backend/src/
├── auth/
├── users/
├── stores/
├── products/
├── product-images/
├── cart/
├── orders/
├── categories/
├── addresses/
├── upload/
├── common/
└── ...
Backend Pattern

Mireng backend primarily uses:

Controller
↓
Service
↓
Entity
↓
Database

Responsibilities:

Controller → HTTP/API layer
Service → business logic
Entity → database mapping
DTO → request validation
Existing Backend Modules
auth

Handles:

login
JWT auth
profile
role protection
users

Handles:

user data
profile information
seller roles
stores

Handles:

seller stores
store profile
store metadata
products

Handles:

product CRUD
product upload
seller products
product gallery
digital/physical/service products
product-images

Handles:

product image entities
gallery management
thumbnails
cart

Handles:

cart system
checkout preparation
orders

Handles:

checkout
order creation
order detail
order history
categories

Handles:

product categories
addresses

Handles:

buyer addresses
shipping preparation
upload

Handles:

upload handling
file processing
storage preparation
Product System Architecture

Current product system supports:

physical products
digital products
services

Product relations:

User (Seller)
↓
Store
↓
Products
↓
ProductImages

Products include:

dimensions
stock
SKU
digital file support
ratings
seller relation
category relation
Order System Architecture

Current order flow:

User
↓
Cart
↓
Checkout
↓
Order
↓
OrderItems

Current implementation:

basic checkout
basic order storage

Not fully implemented yet:

payment gateway
escrow
logistics
refund
invoice system
Seller System Architecture

Current seller foundation:

User
↓
Seller Role
↓
Store
↓
Products

Current seller features:

seller role
store ownership
KYC fields
verification fields

Planned future systems:

seller tier
analytics
seller reputation
wallet
moderation
Upload Architecture

Current upload system:

multer
diskStorage
memoryStorage
partial R2 integration

Upload architecture is still evolving.

AI should avoid major upload rewrites without permission.

Database Architecture

Database:

PostgreSQL
TypeORM entities
manual migration strategy

Important:

synchronize = false

Meaning:

schema changes must be intentional
AI MUST NOT carelessly modify entities
migrations should remain controlled
API Architecture

Current API style:

REST API
modular routes
JWT protected endpoints

Examples:

/auth/*
/products/*
/orders/*
/stores/*
Current Feature Status

IMPLEMENTED:

auth
products
stores
uploads
cart
orders basic

PARTIAL:

checkout
KYC
review foundation
admin foundation
R2 integration

PLANNED:

Midtrans
RajaOngkir
wallet
seller tier
websocket
realtime chat
notification
wishlist
voucher
flash sale
escrow
Development Philosophy

Mireng architecture intentionally balances:

practical development
maintainability
future scalability

Project intentionally avoids:

premature microservices
excessive abstraction
unnecessary enterprise complexity
AI Safety Rules

AI MUST:

preserve module boundaries
preserve API consistency
preserve existing architecture style
make incremental changes

AI MUST ASK PERMISSION before:

large refactor
dependency installation
auth changes
schema changes
architecture restructuring
Future Direction

Mireng is expected to evolve into:

scalable hybrid marketplace
multi-vendor ecosystem
realtime commerce platform

Future planned systems:

escrow
wallet
realtime communication
logistics integration
seller analytics
advanced moderation
notification infrastructure

AI should preserve future scalability while keeping current implementation practical.