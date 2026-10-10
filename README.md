# 🌾 KrishiIntel — Agricultural Market Intelligence & Transaction Platform

> **Hackathon Edition powered by SerpApi & Real-Time Logistics Intelligence**  
> *Know where, when, and to whom to sell your harvest. Compare APMC markets, calculate net realization, find verified buyers, and track live dispatches across Gujarat.*

---

## 🌟 Key Features & Hackathon Highlights

- 🔎 **SerpApi Google News Intelligence**: Real-time integration querying Google News (`tbm=nws`) for APMC arrival alerts, trader demand shifts, and logistics news per crop & region.
- 🧮 **Net Realization & Opportunity Score Engine**: Calculates actual money in hand after accounting for transport freight, loading fees, market commission, distance, and spoilage risk.
- 🔐 **Role-Based Access Control (RBAC)**: Secure multi-portal system supporting **Farmers**, **FPO Managers**, and **Platform Admins**.
- 🗄️ **Zero-Setup Database Architecture**: Default SQLite database (`dev.db`) — clone, seed, and run with **0 database configuration or passwords required**! (Optionally supports MySQL).
- 🛰️ **Real-Time Logistics Telemetry**: Live vehicle dispatch & GPS snapshot tracking powered by Socket.IO.

---

## 🚀 Quick Start Guide for Collaborators

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** (comes bundled with Node.js)

### 2. Clone & Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd Serp-Api-hackathon

# Install dependencies across all monorepo workspaces
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 3. Initialize & Seed Database (1-Command Setup)
```bash
# Generate Prisma Client & populate SQLite database with demo data
npm run db:generate
npm run db:seed
```

### 4. Configure Environment Variables (Optional)
The `.env` file is pre-configured with zero-setup defaults (`file:./dev.db`).  
To enable **live SerpApi search**:
1. Get a free API key at [SerpApi.com](https://serpapi.com).
2. Open `.env` and `.env/backend` and update your key:
```env
SERPAPI_KEY="your_actual_serpapi_key_here"
```

### 5. Run the Platform
```bash
# Start both Express Backend (Port 5000) and Next.js Frontend (Port 3000) concurrently
npm run dev
```

Visit **http://localhost:3000** in your browser!

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Default Portal |
|---|---|---|---|
| **Farmer** | `farmer@demo.krishiintel.local` | `Farmer123!` | `/farmer/dashboard` |
| **FPO Manager** | `fpo@demo.krishiintel.local` | `Fpo123!` | `/fpo/dashboard` |
| **Administrator** | `admin@demo.krishiintel.local` | `Admin123!` | `/admin/dashboard` |

---

## 🔍 How SerpApi Powers KrishiIntel

SerpApi is the central market signal verification engine in KrishiIntel:

1. **Backend Integration**: Located in [`backend/src/integrations/serpapi/serpapi.service.ts`](./backend/src/integrations/serpapi/serpapi.service.ts).
2. **Dynamic Endpoint**: When checking market opportunity scores ([`backend/src/controllers/intelligence.controller.ts`](./backend/src/controllers/intelligence.controller.ts)), the system calls SerpApi with location and crop parameters.
3. **Evidence Panel**: Search results feed into the **Market News Intelligence & Signal Verification** card on the Farmer & FPO dashboards to give farmers verified news proof alongside price quotes.

---

## 📁 Repository Structure

```
Serp-Api-hackathon/
├── backend/                  # Express REST API + Socket.IO Server
│   ├── prisma/               # Database Schema (schema.prisma) & Seed Script (seed.ts)
│   ├── src/
│   │   ├── auth/             # JWT & RBAC Controller
│   │   ├── controllers/      # Market, Farmer, FPO, Buyer, Logistics Controllers
│   │   ├── integrations/     # SerpApi Search Client (serpapi.service.ts)
│   │   ├── realtime/         # Socket.IO Gateway
│   │   └── services/         # Net Realization & Opportunity Score Algorithms
├── frontend/                 # Next.js 16 (App Router) Client Application
│   ├── app/
│   │   ├── admin/            # Admin Management Console
│   │   ├── auth/             # Login, Register & Role Pre-Selection Gateway
│   │   ├── farmer/           # Farmer Mobile Portal
│   │   └── fpo/              # FPO Manager Operations Portal
│   ├── context/              # Authentication Context Provider
│   └── services/             # API Client Gateway
├── docs/                     # Full Technical Documentation Architecture
└── .env                      # Workspace Environment Configuration
```

---

## 📚 Technical Documentation Suite

For deeper implementation details, review the detailed documents in the `docs/` folder:

- [`docs/ARCHITECTURE-AUDIT.md`](./docs/ARCHITECTURE-AUDIT.md) - Codebase Audit & Platform Overhaul Summary
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - Full System Architecture & Data Flows
- [`docs/API.md`](./docs/API.md) - Complete REST API Endpoint Reference
- [`docs/DATABASE.md`](./docs/DATABASE.md) - Prisma Schema & Data Models
- [`docs/RBAC.md`](./docs/RBAC.md) - Access Control & Role Permission Matrix
- [`docs/REALTIME.md`](./docs/REALTIME.md) - Socket.IO Live Telemetry & Dispatch Tracking
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) - Production Deployment Guide
- [`docs/TESTING.md`](./docs/TESTING.md) - Verification & Test Execution Guide

---

## ⚡ Useful NPM Commands

| Command | Description |
|---|---|
| `npm run dev` | Runs Frontend (Port 3000) & Backend (Port 5000) concurrently |
| `npm run db:generate` | Generates Prisma Client types |
| `npm run db:seed` | Resets & seeds SQLite database with demo data |
| `npm run build` | Builds both Frontend & Backend for production |
