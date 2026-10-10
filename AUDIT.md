# KRISHIINTEL — AUDIT & ARCHITECTURE REVIEW

## 1. Existing Architecture
- **Monorepo Structure**: `frontend/` (Next.js 16 App Router with TailwindCSS), `backend/` (Express REST API with Socket.IO real-time server), `docs/` (Architecture, API & DB docs), `backend/prisma/` (Prisma ORM schema & seed script).
- **Authentication & Authorization**: JWT-based HTTP headers/cookie tokens, role-based authorization middleware (`authorize('FARMER')`, `authorize('FPO_MANAGER')`, `authorize('ADMIN')`).
- **Database Engine**: Configured with Prisma ORM supporting MySQL and SQLite datasources.
- **Real-time Engine**: Socket.IO server mounted on port 5000 broadcasting shipment location telemetry and notification updates.

## 2. Existing Working Features
- Role selection gateway (`/auth/role`), login (`/auth/login`), and registration (`/auth/register`).
- Role-specific portals for Farmers (`/farmer/*`), FPO Managers (`/fpo/*`), and Admins (`/admin/*`).
- Net Realisation calculator (`calculateNetRealisation`) estimating gross value minus transport, handling, storage, and spoilage risk.
- Opportunity Score engine (`calculateOpportunityScore`) combining net return, gross market price, distance, and buyer demand.
- Public landing page with multi-language Gujarati, Hindi, and English context provider.

## 3. Existing Incomplete or Broken Features Identified
- **SerpApi Integration**: Currently single-file mock/fetch implementation in `backend/src/integrations/serpapi/serpapi.service.ts`. Lacks structured multi-engine support (`google`, `google_news`, `google_maps`), caching, rate limiting, request deduplication, and buyer lead discovery.
- **Buyer & Logistics Discovery**: No automated Google Maps lead discovery for wholesalers, processors, cold storages, or transport providers.
- **Evidence Model**: Lacks normalized TypeScript schema distinguishing official APMC market prices from web mentions, news signals, and candidate buyer leads.
- **Status Badges**: Frontend dashboards need explicit data-quality badges (`LIVE WEB EVIDENCE`, `CACHED WEB EVIDENCE`, `OFFICIAL MARKET DATA`, `DEMO DATA`).

## 4. Existing SerpApi Implementation Analysis
- Single `fetchMarketNewsIntelligence(cropName, location)` function querying `https://serpapi.com/search.json?q=...&tbm=nws`.
- No engine parameterization (`google`, `google_news`, `google_maps`).
- No server-side caching (TTL), request timeout handling, or retries.

## 5. Database Migration Requirements
- Update `backend/prisma/schema.prisma` to support MySQL (`provider = "mysql"`) as primary datasource with environment variable fallback.
- Add models for `EvidenceCache` (storing cached SerpApi responses) and `DiscoveredBuyerLead` (candidate leads from Google Maps awaiting review).
- Seed script compatibility for MySQL & SQLite test environments.

## 6. Proposed File-Level Changes
### Backend Architecture:
- `backend/src/integrations/serpapi/`
  - `serpapi.config.ts`: Config variables (`SERPAPI_KEY`, `SERPAPI_ENABLED`, `SERPAPI_TIMEOUT_MS`, `SERPAPI_CACHE_TTL_SECONDS`).
  - `serpapi.types.ts`: Engine params & normalized evidence models.
  - `serpapi.client.ts`: Resilient HTTP fetch wrapper with rate limiting, timeouts, retries, and error handling.
  - `serpapi-cache.service.ts`: In-memory & DB caching service with TTL and deduplication.
  - `google-search.service.ts`: Google Search engine (`google`) client.
  - `google-news.service.ts`: Google News engine (`google_news`) client.
  - `google-maps.service.ts`: Google Maps engine (`google_maps`) buyer & logistics lead discovery.
  - `index.ts`: Unified SerpApi gateway exporter.
- `backend/src/services/`
  - `market-intelligence.service.ts`: Unified pipeline combining MySQL APMC prices, Search, News, Maps, Net Realisation, and Opportunity Scoring.
  - `buyer-discovery.service.ts`: Lead review and candidate discovery service.
- `backend/src/controllers/intelligence.controller.ts`: Refactored controller exposing `/api/intelligence/analyze`, `/api/intelligence/evidence`, `/api/intelligence/discover-buyers`, and `/api/intelligence/lead-review`.
- `backend/src/routes/intelligence.routes.ts`: Routes with authorization & rate-limiting middleware.
- `backend/src/scripts/serpapi-smoke-test.ts`: Live CLI smoke testing script for SerpApi.

### Frontend Integration:
- `frontend/services/api/krishi-api.ts`: API client connecting to backend endpoints.
- `frontend/app/farmer/markets/page.tsx` & `frontend/app/farmer/dashboard/page.tsx`: Enhanced intelligence UI with status badges (`LIVE WEB EVIDENCE`, `CACHED WEB EVIDENCE`, `OFFICIAL MARKET DATA`, `DEMO DATA`).
- `frontend/app/farmer/buyers/page.tsx` & `frontend/app/fpo/buyers/page.tsx`: Discovered buyer lead review interface.

## 7. Testing and Verification Strategy
- Automated unit tests for SerpApi client, cache hit/miss, mock responses, and calculations.
- Live smoke test script (`npm run test:serpapi`) requiring `SERPAPI_KEY`.
- End-to-end verification of Next.js frontend build & Express backend compilation.
