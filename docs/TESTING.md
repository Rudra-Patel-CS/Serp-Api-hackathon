# KRISHIINTEL — TESTING & VERIFICATION SUITE

---

## 1. Test Verification Scenarios

### Authentication & Role Pre-Selection
- [x] Pre-selecting role on `/auth/role` stores selected role in state and passes `?role=` query parameter.
- [x] Logging in with matching role grants access to respective dashboard (`/farmer/dashboard`, `/fpo/dashboard`, `/admin/dashboard`).
- [x] Role mismatch attempt (e.g. logging in as Farmer while selecting FPO Manager) is blocked with an explicit error message.
- [x] Public registration permits Farmer and FPO Manager roles; public Admin registration is forbidden.

### RBAC Route Protection
- [x] Direct URL navigation to `/admin/*` by non-admin accounts returns 403 Forbidden.
- [x] Direct API requests to `/api/admin/*` without an Admin bearer token are rejected.
- [x] Farmers can only access and edit their own harvest lots (`lot.farmerId === user.id`).

### Market Intelligence & Calculations
- [x] Net Realization formula correctly subtracts transport freight, handling, mandi cess, and moisture shrinkage.
- [x] Opportunity score breakdown (0-100) displays price signal, buyer availability, demand, logistics, and stability.
- [x] SerpApi evidence service returns verified market news records.

### Real-Time Fleet Tracking
- [x] Active shipments stream location snapshots via Socket.IO.
- [x] Map UI displays vehicle telemetry, ETA, and "Last updated X seconds ago".
