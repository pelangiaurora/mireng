# Mireng Development Rules 

# Core Philosophy

Mireng development prioritizes:
- maintainability
- practical implementation
- safe incremental improvement
- long-term scalability

Project intentionally avoids:
- unnecessary complexity
- over-engineering
- premature abstraction
- architecture rewriting without strong reason

---

# AI Safety Rules

AI MUST:
- analyze existing implementation first
- preserve architecture consistency
- reuse existing patterns
- make incremental changes
- minimize unintended side effects

AI MUST ASK PERMISSION before:
- major refactor
- changing architecture
- modifying auth flow
- changing database schema
- installing dependencies
- changing API contracts
- renaming important files/folders

---

# Backend Rules

Backend architecture uses:
```text
Controller
↓
Service
↓
Entity
```

Rules:

Controllers handle HTTP/API layer only
Services contain business logic
Entities map database structure
DTOs validate requests

Avoid:

business logic inside controllers
massive controllers
duplicated business logic
Frontend Rules

Frontend philosophy:

practical
scalable when needed
avoid unnecessary abstraction

Frontend currently uses:

Zustand
Axios
App Router

Rules:

reuse existing component patterns
keep UI components modular
avoid excessive global state
avoid premature architecture complexity
TypeScript Rules

Preferred:

strict typing for core systems
pragmatic typing for temporary UI logic

Avoid uncontrolled any usage in:

auth
DTOs
orders
payments
API contracts

Prefer:

interfaces
typed DTOs
typed API responses
API Rules

Current API style:

REST API
modular routes

Patterns:

/auth/*
/products/*
/orders/*
/stores/*

Rules:

preserve existing route style
preserve response consistency
avoid breaking API contracts
avoid silent response structure changes
Database Rules

Database uses:

PostgreSQL
TypeORM
manual migrations

Important:

synchronize = false

Rules:

schema changes must be intentional
avoid careless entity modification
avoid destructive schema changes
migration safety is important

AI MUST ask permission before:

changing entities
changing relations
destructive migration changes
Upload System Rules

Current upload system:

multer
diskStorage
memoryStorage
partial R2 integration

Rules:

preserve compatibility
avoid rewriting upload flow unnecessarily
avoid changing storage strategy without permission
Dependency Rules

Default policy:

minimize dependencies
prefer existing stack first

Before adding dependency:

explain why needed
explain alternatives
ask permission first

Avoid:

dependency bloat
overlapping libraries
unnecessary heavy packages
Refactor Rules

Allowed:

small safe refactors
cleanup
incremental improvement
readability improvement

Not allowed without permission:

architecture rewrites
module restructuring
large-scale abstraction
changing folder structure
changing auth system
Naming Rules

Prefer:

clear descriptive naming
modular naming consistency
feature-based naming

Avoid:

unclear abbreviations
random utility naming
inconsistent file naming
Feature Development Rules

Before implementing features:

analyze existing modules first
reuse patterns
preserve compatibility
consider future scalability

AI SHOULD:

extend existing systems first
avoid duplicate systems
preserve backward compatibility
Marketplace Awareness

Mireng is:

multi-vendor marketplace
hybrid commerce system
long-term evolving platform

AI MUST consider:

seller/buyer separation
future payment systems
scalability
future realtime systems
future logistics integration
Safe Development Workflow

Before coding:

Read AGENTS.md
Read PROJECT_CONTEXT.md
Read ARCHITECTURE.md
Read FEATURE_STATUS.md
Analyze related module first

Before major changes:

Explain proposed changes
Explain risks
Request permission
Long-Term Direction

Mireng is expected to evolve into:

scalable marketplace ecosystem
realtime commerce platform
advanced seller platform

Development should:

preserve maintainability
preserve scalability
remain practical
avoid unnecessary enterprise complexity