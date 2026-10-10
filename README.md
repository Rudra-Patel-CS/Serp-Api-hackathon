# 🌾 KrishiIntel — Agricultural Market Intelligence & Transaction Platform

Know where, when, and to whom to sell your harvest. Compare APMC markets, calculate net realization, find verified buyers, and track live dispatches across Gujarat.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18.x
- pnpm package manager (`npm install -g pnpm`)
- MySQL database instance running locally or via cloud

### 2. Installation & Workspace Setup
```bash
# Install all workspace dependencies
pnpm install

# Setup Environment Variables
cp .env.example .env
```

### 3. Database Initialization & Seeding
```bash
# Generate Prisma Client & Run Migrations
pnpm db:generate
pnpm db:seed
```

### 4. Running the Platform
```bash
# Start both Frontend (Port 3000) and Express Backend (Port 5000) in parallel
pnpm dev
```

---

## 🔑 Demo Accounts (Development)

| Role | Email / Phone | Password | Workspace URL |
|---|---|---|---|
| **Farmer** | `farmer@demo.krishiintel.local` (or `9876543210`) | `Farmer123!` | `/farmer/dashboard` |
| **FPO Manager** | `fpo@demo.krishiintel.local` (or `9876543211`) | `Fpo123!` | `/fpo/dashboard` |
| **Administrator** | `admin@demo.krishiintel.local` (or `9876543212`) | `Admin123!` | `/admin/dashboard` |

---

## 📚 Platform Documentation

- [`docs/ARCHITECTURE-AUDIT.md`](./docs/ARCHITECTURE-AUDIT.md) - Full Codebase Audit & Migration Strategy
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - Platform System Architecture Diagram & Components
- [`docs/API.md`](./docs/API.md) - Express REST API Endpoint Specifications
- [`docs/DATABASE.md`](./docs/DATABASE.md) - MySQL Schema & Prisma ORM Models
- [`docs/RBAC.md`](./docs/RBAC.md) - Role-Based Access Control Security Matrix
- [`docs/REALTIME.md`](./docs/REALTIME.md) - Socket.IO Live Telemetry Architecture
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) - Production Deployment Guide
- [`docs/TESTING.md`](./docs/TESTING.md) - Testing & Verification Suite
