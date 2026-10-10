# KRISHIINTEL — PLATFORM SYSTEM ARCHITECTURE

**System Version:** 1.0.0  
**Architecture Model:** Modular Monolith (Next.js 16 + Express API + MySQL + Socket.IO)  

---

## 1. High-Level Architecture Overview

KrishiIntel is an agricultural market intelligence and transaction platform structured as a clean modular monorepo containing:
- **`frontend/`**: Next.js 16 App Router application rendering public landing pages, role selection gateways, and 3 distinct role-tailored workspaces (`/farmer/*`, `/fpo/*`, `/admin/*`).
- **`backend/`**: Node.js & Express REST API server in TypeScript backed by Prisma ORM and MySQL, managing authentication, RBAC middleware, SerpApi intelligence discovery, and Socket.IO real-time event broadcasts.

```text
                               +-----------------------------------+
                               |       Public Landing Page (/)     |
                               +-----------------+-----------------+
                                                 |
                               +-----------------v-----------------+
                               |    Role Selection (/auth/role)    |
                               +-----------------+-----------------+
                                                 |
                               +-----------------v-----------------+
                               |   Role Verification & Auth Gate   |
                               +-----------------+-----------------+
                                                 |
            +------------------------------------+------------------------------------+
            |                                    |                                    |
+-----------v-----------+            +-----------v-----------+            +-----------v-----------+
|     Farmer Portal     |            |   FPO Manager Portal  |            |     Admin Console     |
|  (/farmer/dashboard)  |            |    (/fpo/dashboard)   |            |   (/admin/dashboard)  |
+-----------+-----------+            +-----------+-----------+            +-----------+-----------+
            |                                    |                                    |
            +------------------------------------+------------------------------------+
                                                 |
                                    [REST API & Socket.IO Telemetry]
                                                 |
                               +-----------------v-----------------+
                               |    Express Backend API Gateway    |
                               |  - Authentication & JWT Middleware |
                               |  - RBAC Security Middleware        |
                               |  - Net Realization Engine         |
                               |  - Opportunity Scoring Engine     |
                               |  - SerpApi News & Intelligence    |
                               |  - Socket.IO Telemetry Engine     |
                               +-----------------+-----------------+
                                                 |
                               +-----------------v-----------------+
                               |     MySQL + Prisma ORM Layer      |
                               +-----------------------------------+
```

---

## 2. Core Architectural Components

### 2.1 Frontend Architecture (`frontend/`)
- **App Router Layouts**: Central `AuthProvider` wrapping application state with localStorage session restoration and `/api/auth/me` token validation.
- **Role-Tailored Portals**:
  - **Farmer Workspace**: Simple, mobile-first design answering primary selling questions ("What do I have?", "Where to sell?", "Who will buy?", "How much will I get?").
  - **FPO Workspace**: Operational co-operative manager console handling member aggregation, procurement, lot batching, and WhatsApp Kisan Bahi realization ledger export.
  - **Admin Workspace**: Operations console providing real-time database metric charts, user activation/suspension, audit logging, and system health checks.

### 2.2 Backend Architecture (`backend/`)
- **Express Server**: Listens on Port 5000 with CORS protection, Helmet headers, cookie parser, and global error handling.
- **Prisma ORM**: Interfaces directly with MySQL database with 15 normalized domain models.
- **Socket.IO Real-Time Engine**: Manages channels for live GPS fleet tracking snapshot streams (`shipment:id`) and instant offer notifications (`user:id`).
- **SerpApi Intelligence Gateway**: Server-side Web News & Market Search integration hiding secret API keys from the client bundle.
