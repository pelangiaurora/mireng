# Mireng AI Agent System

## Project Identity

Mireng adalah marketplace multi-vendor Indonesia untuk:
- produk fisik
- produk digital
- jasa/service

Project ini memiliki arah:
- Tokopedia/Shopee style architecture
- hybrid commerce ecosystem
- scalable marketplace platform

---

# Current Project Status

Project saat ini berada di tahap:

FOUNDATION MARKETPLACE STAGE

Artinya:
- core marketplace foundation sudah ada
- auth sudah ada
- product system sudah ada
- store system sudah ada
- order system basic sudah ada

Namun beberapa fitur masih:
- partial
- planned
- belum implemented

AI HARUS membedakan:
- implemented feature
- planned feature
- PRD vision

Jangan menganggap semua fitur di PRD sudah ada di codebase.

---

# Tech Stack

## Frontend
- Next.js 16
- React 19
- TypeScript
- TailwindCSS v4
- Zustand
- Axios

## Backend
- NestJS 11
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger
- Multer Upload

## Storage
- Cloudflare R2 (partial implementation)

---

# Architecture Overview

Frontend:
- Next.js App Router
- Client-heavy architecture
- Zustand auth state
- Axios API communication

Backend:
- Modular NestJS architecture
- Controller → Service → Entity pattern
- TypeORM entities
- PostgreSQL database

Authentication:
- JWT based
- Token stored in client cookies
- Axios interceptor injects bearer token

Database:
- synchronize: false
- manual migration approach
- AI MUST NOT modify schema carelessly

---

# Current Implemented Features

IMPLEMENTED:
- Authentication
- User system
- Store system
- Product CRUD
- Product upload
- Cart basic
- Order basic
- Category system

PARTIAL:
- Checkout flow
- KYC
- Review foundation
- Admin foundation
- R2 integration

PLANNED:
- Midtrans
- RajaOngkir
- Wallet
- Seller tier
- Chat realtime
- Notification
- Wishlist
- Follow store
- Flash sale
- Voucher
- Websocket
- Escrow system

---

# Development Philosophy

Mireng uses HYBRID architecture.

Meaning:
- practical development speed
- structured core architecture
- scalable when needed
- avoid over-engineering

Core systems should remain structured:
- auth
- orders
- payment
- database
- API contracts

UI and non-critical systems may remain practical/simple.

---

# AI Behavior Rules

## IMPORTANT

AI MUST:
- understand existing architecture first
- preserve architecture consistency
- avoid unnecessary refactor
- avoid over-engineering
- modify only what is necessary

AI MUST ASK PERMISSION before:
- major refactor
- architecture changes
- installing dependencies
- changing auth flow
- modifying database schema
- renaming major files/folders
- changing API contracts

---

# Dependency Policy

Default policy:
- minimize dependencies
- prefer existing stack first

AI MAY suggest new dependency ONLY IF:
- clearly justified
- explanation is provided
- permission is requested first

---

# TypeScript Policy

Use:
- strict typing for core systems
- pragmatic typing for rapid UI development

Avoid uncontrolled `any` usage in:
- auth
- orders
- payment
- DTOs
- API contracts

---

# API Philosophy

Backend uses REST API style.

Patterns:
- /auth/*
- /products/*
- /orders/*
- /stores/*

Response format is partially standardized.

AI SHOULD preserve existing API response style.

---

# Upload System

Upload system is evolving.

Current implementation includes:
- diskStorage
- memoryStorage
- partial R2 integration

AI MUST NOT rewrite upload architecture carelessly.

---

# Important Notes For AI

Mireng is NOT:
- simple CRUD app
- tutorial project
- prototype-only project

Mireng IS:
- long-term marketplace ecosystem
- scalable multi-vendor platform
- hybrid physical + digital marketplace

AI should prioritize:
- maintainability
- consistency
- incremental improvement
- safe modifications

---

# Workflow Before Coding

Before making changes, AI SHOULD:
1. Read AGENTS.md
2. Read PROJECT_CONTEXT.md
3. Read FEATURE_STATUS.md
4. Read ARCHITECTURE.md
5. Analyze existing module first

Do NOT make assumptions before reading the existing implementation.

---

# Safe Development Mode

Default approach:
- small safe changes
- incremental improvement
- preserve existing functionality

Avoid:
- massive rewrites
- unnecessary abstraction
- premature enterprise complexity

---

# Future Direction

Planned future systems:
- escrow payment
- wallet
- realtime chat
- seller tier system
- logistics integration
- advanced seller ecosystem
- notification system
- analytics
- admin moderation tools

AI should design changes with future scalability in mind.