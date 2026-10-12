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

## 🔍 SerpApi Feature-by-Feature Integration Mapping

KrishiIntel leverages **SerpApi** across multiple core features to provide real-time, external web intelligence directly to farmers and FPO managers:

| Platform Feature | SerpApi Engine Used | How It Works & Value Delivered |
|---|---|---|
| **1. APMC Mandi Price Intelligence & Trends** | **Google Search (`engine=google`)** | Fetches live wholesale market price bulletins, arrival volumes, and commodity trends across regional Gujarat mandis (Rajkot, Gondal, Unjha, Surat, Ahmedabad) to supplement local database records. |
| **2. Agri News, Disruption & Policy Alerts** | **Google News (`engine=google_news`)** | Scrapes real-time agricultural news, monsoon/weather updates, export duty changes, and supply-chain disruption alerts so farmers can decide the optimal day to harvest and sell. |
| **3. Direct Buyer & Food Processor Discovery** | **Google Maps (`engine=google_maps`)** | Discovers regional food processing plants, agro-exporters, grain millers, and wholesale traders. Extracts verified business names, addresses, phone contacts, ratings, and GPS coordinates. |
| **4. Cold Storage & Warehouse Locator** | **Google Maps (`engine=google_maps`)** | Identifies nearby commercial cold storage facilities and warehouse units with capacity indicators to minimize post-harvest crop spoilage during price dips. |
| **5. Local Logistics & Transporter Matching** | **Google Maps (`engine=google_maps`)** | Finds local agricultural transport operators, mini-truck aggregators, and freight booking offices along the selected transit route to accurately calculate net realization. |

> 🔒 **Security Guarantee:** All SerpApi calls are executed strictly server-side through [`backend/src/integrations/serpapi/`](./backend/src/integrations/serpapi/). The `SERPAPI_KEY` is never exposed to the client browser, and results are cached with a 30-minute in-memory TTL to conserve API quotas.

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

## 👨‍💻 Creators & Team

- **Rudra Patel**
- **Abhishek Chikhaliya**

---

## 📄 License & Attribution

Developed for KrishiIntel Agricultural Market Intelligence Platform. Powered by [SerpApi](https://serpapi.com).
