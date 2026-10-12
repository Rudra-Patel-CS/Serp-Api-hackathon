# 🌾 KrishiIntel — Agricultural Market Intelligence & Transaction Platform

> **Hackathon Edition powered by SerpApi (Google Search, Google News, Google Maps) & Real-Time Intelligence**  
> *Know where, when, and to whom to sell your harvest. Compare APMC markets, calculate net realization, discover bulk buyers, and track live dispatches across Gujarat.*

---

## 🌟 Key Features & Hackathon Highlights

- 🔎 **SerpApi 3-Engine Intelligence Architecture**:
  - **Google Search (`engine=google`)**: Discovers wholesale market reports, regional crop demand signals, and market arrivals.
  - **Google News (`engine=google_news`)**: Fetches fresh agricultural news, supply disruptions, and APMC arrival alerts.
  - **Google Maps (`engine=google_maps`)**: Discovers bulk buyers, food processing plants, cold storage units, and transport logistics.
- 🏷️ **Clear Data Source Badging**:
  - `LIVE WEB EVIDENCE` / `CACHED WEB EVIDENCE`: Real-time web intelligence retrieved via backend SerpApi endpoints.
  - `OFFICIAL MARKET DATA`: Verified APMC mandi price records.
  - `DEMO DATA`: Marked fallback data when API credentials are unconfigured or unavailable.
  - Candidate leads from Google Maps remain candidate buyer leads until verified by authorized users.
- 🧮 **Net Realization & Opportunity Score Engine**: Calculates actual money in hand after accounting for transport freight, loading fees, market commission, distance, and spoilage risk (1 Quintal = 100 kg).
- 🔐 **Role-Based Access Control (RBAC)**: Enforced server-side for **Farmers**, **FPO Managers**, and **Platform Admins**.
- 🗄️ **MySQL Database Integration**: Configured with Prisma (`schema.prisma` using `provider = "mysql"`).
- 🛰️ **Real-Time Logistics Telemetry**: Live vehicle dispatch & GPS snapshot tracking powered by Socket.IO.

---
Check the Deployed Site:
https://krishi-intel-cody.onrender.com
---
## 🚀 Quick Start Guide for Collaborators

### 1. Prerequisites
- **Node.js** >= 18.x
- **MySQL Server** (running locally or remotely)
- **npm** (comes bundled with Node.js)

### 2. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Rudra-Patel-CS/Serp-Api-hackathon.git
cd Serp-Api-hackathon

# Install dependencies across all monorepo workspaces
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 3. Database Configuration (`.env`)
Create or edit `backend/.env` with your MySQL connection string and SerpApi key:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/krishiintel"
JWT_SECRET="krishiintel_super_secret_jwt_key_2026"

# SerpApi Configuration
SERPAPI_KEY="your_serpapi_key_here"
SERPAPI_ENABLED=true
SERPAPI_TIMEOUT_MS=10000
SERPAPI_CACHE_TTL_SECONDS=1800
```

Generate Prisma client and seed initial data:
```bash
npm --prefix backend run db:generate
npm --prefix backend run db:seed
```

### 4. Run the Application
```bash
# Start Express Backend (Port 5000) and Next.js Frontend (Port 3000) concurrently
npm run dev
```

Visit **http://localhost:3000** in your browser!

---

## 🧪 Testing & Verification Commands

| Command | Description |
|---|---|
| `npm --prefix backend test` | Runs the full automated unit test suite (caching, net realization, unit conversion, fallback data) |
| `npm --prefix backend run test:serpapi` | CLI Live Smoke Test script executing Google Search, News, and Maps engines |
| `npm --prefix backend run build` | Verifies TypeScript compilation for Express backend |
| `npm --prefix frontend run build` | Builds production bundle for Next.js frontend |

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Default Portal |
|---|---|---|---|
| **Farmer** | `farmer@demo.krishiintel.local` | `Farmer123!` | `/farmer/dashboard` |
| **FPO Manager** | `fpo@demo.krishiintel.local` | `Fpo123!` | `/fpo/dashboard` |
| **Administrator** | `admin@demo.krishiintel.local` | `Admin123!` | `/admin/dashboard` |

---

## 🔍 SerpApi Integration Details

SerpApi requests are handled **100% server-side** in [`backend/src/integrations/serpapi/`](./backend/src/integrations/serpapi/):
- **`serpapi.client.ts`**: Shared HTTP client with timeouts, status code handling, retries, and API key protection.
- **`serpapi-cache.service.ts`**: In-memory TTL caching (30 min default) to prevent unnecessary API quota consumption.
- **`google-search.service.ts`**: Normalizes `engine=google` search results into `NormalizedEvidence`.
- **`google-news.service.ts`**: Normalizes `engine=google_news` results into `NormalizedEvidence`.
- **`google-maps.service.ts`**: Discovers candidate leads (`DiscoveredLead`) for buyers, processing plants, cold storage, and logistics.

`SERPAPI_KEY` is **never** sent to the client browser or exposed in frontend bundles.

---

## 📁 Repository Structure

```
Serp-Api-hackathon/
├── AUDIT.md                  # Complete System & SerpApi Integration Audit
├── backend/                  # Express REST API + Socket.IO Server
│   ├── prisma/               # Database Schema (schema.prisma) & Seed Script (seed.ts)
│   ├── src/
│   │   ├── auth/             # JWT & RBAC Controller
│   │   ├── controllers/      # Intelligence, Market, Farmer, FPO Controllers
│   │   ├── integrations/     # SerpApi Search, News, Maps Integration
│   │   ├── scripts/          # Live SerpApi Smoke Test Script
│   │   ├── tests/            # Automated Integration & Unit Tests
│   │   └── services/         # Net Realization & Opportunity Score Algorithms
├── frontend/                 # Next.js 16 (App Router) Client Application
│   ├── app/
│   │   ├── admin/            # Admin Console
│   │   ├── farmer/           # Farmer Portal & Markets Analysis View
│   │   └── fpo/              # FPO Manager Portal
│   ├── components/           # UI Components & Language Selector
│   ├── context/              # Auth & Language Context Providers
│   └── services/             # API Client Gateway
├── docs/                     # Full Technical Documentation Architecture
└── README.md
```

---

## 📄 License & Attribution

Developed for KrishiIntel Agricultural Market Intelligence Platform. Powered by [SerpApi](https://serpapi.com).
