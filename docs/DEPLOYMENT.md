# KRISHIINTEL — PRODUCTION DEPLOYMENT GUIDE

---

## 1. Modular Monolith Deployment Strategy

KrishiIntel is designed for affordable production deployment:
- **Frontend Service**: Next.js App Router deployed to Vercel, Render, or Node server.
- **Backend API Service**: Express Node.js process deployed to Render, AWS EC2, or DigitalOcean App Platform.
- **Database**: Managed MySQL (AWS RDS, PlanetScale, or DigitalOcean Managed MySQL).

---

## 2. Environment Setup & Deployment Commands

```bash
# 1. Install Workspace Dependencies
pnpm install

# 2. Build Frontend & Backend Packages
pnpm build

# 3. Database Migration Deployment
pnpm db:migrate

# 4. Start Production Services
pnpm start
```
