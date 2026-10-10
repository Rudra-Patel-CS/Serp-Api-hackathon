# KRISHIINTEL — ARCHITECTURE AUDIT & MIGRATION STRATEGY

**Date:** October 10, 2026  
**System:** KrishiIntel Agricultural Market Intelligence & Transaction Platform  
**Auditor:** Senior Full-Stack Architect  

---

## 1. Executive Summary

KrishiIntel was initially constructed as a single-page Next.js client application (`/app/page.tsx`) wrapping a rich suite of visual views (`KrishiDashboardView`, `KrishiMarketIntelView`, `KrishiExtraViews`, `KrishiModals`) and purely client-side state hooks (`useState`, `useMemo`). While the frontend design, multi-language support (English, Gujarati, Hindi), and market calculation formulas (`computeMandiRealization`) are well-crafted, the architecture lacked backend integration, persistent storage, role-based access control (RBAC), database schemas, and authentic multi-role workflows.

This document presents a comprehensive audit of the legacy codebase and outlines the modular architecture and migration strategy to transform KrishiIntel into an enterprise-grade, database-driven platform powered by Next.js, Express, Prisma ORM, MySQL, and Socket.IO.

---

## 2. Legacy Codebase Analysis

### 2.1 Existing File Map
- **`app/page.tsx`**: Single entry point loading `<KrishiApp />`.
- **`components/krishi/krishi-app.tsx`**: Monolithic state holder managing tab navigation, modal visibility, active harvest lot, and mock calculation state.
- **`components/krishi/krishi-dashboard-view.tsx`**: Combined dashboard rendering key metric cards, opportunity banners, price alerts, and market action buttons.
- **`components/krishi/krishi-market-intel-view.tsx`**: Market intelligence view showing net realization calculations, mandi comparison tables, and buyer matching.
- **`components/krishi/krishi-extra-views.tsx`**: Views for buyers directory, crop inventory, logistics providers, FPO pooling, evidence records, sell-vs-wait scenario models, and system alerts.
- **`components/krishi/krishi-modals.tsx`**: Modals for Kisan Bahi realization vouchers, Kisan AI assistant, lot registration, route protocol, driver booking, cold storage, FPO pooling, buyer contact, mandi cess schedules, and rate dispute forms.
- **`lib/market-service.ts`**: Hardcoded initial lots, static base rates, and client-side `computeMandiRealization` calculations.
- **`lib/i18n.ts` & `lib/translations.ts`**: Localization dictionary supporting `en`, `gu`, and `hi`.
- **`public/images/`**: High-quality authentic agricultural assets (`gujarat-farm.png`, `mandi-yard.jpg`, `ramesh-patel.jpg`, `tomato-lot.jpg`).

### 2.2 Identified Technical Debt & Deficiencies
1. **Lack of Backend & Database**: All harvest lots, buyer records, market prices, and shipment states reside in volatile React state (`useState`). Refreshing the browser resets all state.
2. **Missing Role-Based Access Control (RBAC)**: All roles (Farmer, FPO Manager, Buyer) access the exact same single page with a cosmetic tab toggle. There is no server-side token validation or route protection.
3. **No Authentic Authentication Flow**: Login buttons merely toggle dummy flags. There are no password hashing (`bcrypt`/`argon2`), secure HTTP-only cookies, or JWT verification mechanisms.
4. **Client-Side Calculation Logic**: Net realization formulas and opportunity scores are executed directly in browser memory, making pricing calculations insecure and untraceable.
5. **No Real-Time Infrastructure**: Logistics tracking relies on simulated static values rather than live Socket.IO websocket feeds or location snapshot streams.
6. **Unsafe SerpApi Exposure Risk**: External intelligence logic lacked a server-side gateway to hide secret API keys.

---

## 3. Migration Strategy

To evolve KrishiIntel without losing its aesthetic value, we employ an incremental modular migration approach:

1. **Decouple Frontend and Backend**:
   - Establish `frontend/` (Next.js 16 App Router) and `backend/` (Node.js/Express + TypeScript) workspace packages.
2. **Database Schema & ORM Layer**:
   - Introduce MySQL as the source of truth with Prisma ORM (`backend/prisma/schema.prisma`).
   - Define normalized entities: `User`, `FarmerProfile`, `FPO`, `FPOMember`, `Crop`, `HarvestLot`, `Market`, `MarketPrice`, `Buyer`, `BuyerCropRequirement`, `Offer`, `LogisticsProvider`, `TransportVehicle`, `Shipment`, `ShipmentLocation`, `Notification`, `AuditLog`.
3. **Authentication & RBAC Architecture**:
   - Implement role pre-selection (`/auth/role`), secure login (`/auth/login`), and role-specific registration (`/auth/register`).
   - Enforce server-side role validation matching the user's persisted DB role against selected role.
   - Enforce route protection guards and API authorization middleware (`authorize('FARMER')`, `authorize('FPO_MANAGER')`, `authorize('ADMIN')`).
4. **Backend Business Services**:
   - Port market analysis, net realization calculation, opportunity scoring, and buyer matching into dedicated backend services (`net-realisation.service.ts`, `opportunity-score.service.ts`, `buyer-matching.service.ts`).
5. **Role-Tailored Frontend Portals**:
   - **Farmer Portal (`/farmer/*`)**: Simplified mobile-first design answering "What do I have?", "Where to sell?", "Who will buy?", "How much will I get?".
   - **FPO Manager Portal (`/fpo/*`)**: Operational procurement management, farmer aggregation, lot pooling, shared realization ledger exports (WhatsApp/Bahi).
   - **Admin Console (`/admin/*`)**: System-wide operations console with live analytics, user activation/suspension, audit logging, and health monitoring.
6. **Real-Time Logistics & Socket.IO**:
   - Event-driven Socket.IO server emitting shipment updates and driver location snapshots, with graceful fallback polling.
7. **SerpApi Intelligence Gateway**:
   - Server-side SerpApi integration service returning verified evidence records with query, source URL, observed timestamp, and relevance metrics.

---

## 4. Target Architecture Diagram

```text
                               +-----------------------------------+
                               |     KrishiIntel Public Portal     |
                               |          Landing Page (/)          |
                               +-----------------+-----------------+
                                                 |
                                     [Role Selection Flow]
                                                 |
                               +-----------------+-----------------+
                               |    Role Selection (/auth/role)    |
                               +-----------------+-----------------+
                                                 |
                                     [Login / Authentication]
                                                 |
                               +-----------------+-----------------+
                               |    Auth Gateway (/auth/login)     |
                               +-----------------+-----------------+
                                                 |
                      +--------------------------+--------------------------+
                      |                          |                          |
          +-----------v-----------+  +-----------v-----------+  +-----------v-----------+
          |     Farmer Portal     |  |   FPO Manager Portal  |  |     Admin Console     |
          |  (/farmer/dashboard)  |  |    (/fpo/dashboard)   |  |   (/admin/dashboard)  |
          +-----------+-----------+  +-----------+-----------+  +-----------+-----------+
                      |                          |                          |
                      +--------------------------+--------------------------+
                                                 |
                                      [REST & WebSocket APIs]
                                                 |
                               +-----------------+-----------------+
                               |      Node.js / Express Backend    |
                               |  - Auth & RBAC Middleware         |
                               |  - Market Intelligence Service    |
                               |  - Buyer Matching Engine          |
                               |  - Real-Time Socket.IO Server     |
                               +--------+-----------------+--------+
                                        |                 |
                   +--------------------+                 +--------------------+
                   |                                                           |
       +-----------v-----------+                                   +-----------v-----------+
       |   MySQL + Prisma ORM  |                                   |  SerpApi Web Gateway  |
       |  Normalized Platform  |                                   | Live Evidence & News  |
       |     Data Store        |                                   |   Market Intelligence |
       +-----------------------+                                   +-----------------------+
```

---

## 5. Security & RBAC Matrix Audit

| Capability | Farmer | FPO Manager | Admin | Verification Strategy |
|---|:---:|:---:|:---:|---|
| **View Own Dashboard & Profile** | Yes | Yes | Yes | `authenticate()` session middleware |
| **Manage Personal Lots** | Yes (Own) | No | Yes | `authorize('FARMER')` + Ownership check (`lot.farmerId == user.id`) |
| **Aggregate Farmer Lots** | No | Yes (FPO) | Yes | `authorize('FPO_MANAGER')` + FPO membership check |
| **Procurement Workflow** | Submits | Approves/Procures | Overrides | `authorize('FPO_MANAGER', 'ADMIN')` |
| **Buyer Match Discovery** | Yes | Yes | Yes | Server-side matching engine query |
| **Create & Accept Offers** | Yes (Own) | Yes (FPO) | View/Manage | Backend transaction lock + offer ownership check |
| **Track Active Logistics** | Yes (Own) | Yes (FPO) | All Platform | Socket.IO room channel authorization |
| **User Activation / Suspension** | No | No | Yes | `authorize('ADMIN')` |
| **Audit Logs & System Health** | No | No | Yes | `authorize('ADMIN')` + DB AuditLog write |

---

## 6. Next Steps & Execution Roadmap

1. Establish workspace layout with `frontend/` and `backend/` packages.
2. Initialize Prisma ORM schema and seed script containing demo users, farmers, FPOs, crops, markets, buyers, and lots.
3. Construct Express backend API with JWT authentication, Argon2/bcrypt password hashing, RBAC middleware, and Socket.IO.
4. Build public KrishiIntel landing page (`/`) featuring authentic Indian agricultural visual identity and role login flow (`/auth/role`).
5. Develop role-specific dashboards (`/farmer/*`, `/fpo/*`, `/admin/*`) powered by backend REST endpoints.
6. Integrate live logistics tracking, market intelligence, SerpApi evidence services, and multi-language support.
7. Conduct full build validation (`pnpm dev`, `pnpm build`) and document platform operation in `docs/`.
