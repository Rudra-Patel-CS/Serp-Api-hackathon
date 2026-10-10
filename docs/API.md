# KRISHIINTEL — API DOCUMENTATION

**Base URL:** `http://localhost:5000/api`  
**Authentication Format:** `Authorization: Bearer <token>` or HTTP-only cookie `token`  

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new user account (Farmer or FPO Manager).
```json
{
  "name": "Ramesh Patel",
  "phone": "9876543210",
  "password": "Farmer123!",
  "role": "FARMER",
  "village": "Mogri",
  "district": "Anand",
  "state": "Gujarat",
  "primaryCrops": "Tomato",
  "landArea": 4.5
}
```

### `POST /api/auth/login`
Authenticates a user and verifies that the chosen role matches their database record.
```json
{
  "identifier": "farmer@demo.krishiintel.local",
  "password": "Farmer123!",
  "selectedRole": "FARMER"
}
```

---

## 2. Market Intelligence Endpoints

### `POST /api/market-intelligence/analyze`
Executes server-side net realization calculation and opportunity scoring across APMC markets.
```json
{
  "cropName": "Tomato",
  "quantityKg": 500,
  "location": "Anand, Gujarat",
  "isFpoPool": false
}
```

---

## 3. Harvest Lot Endpoints

- `GET /api/lots` - List lots (scoped by role)
- `POST /api/lots` - Create harvest lot
- `GET /api/lots/:id` - Fetch lot details
- `PATCH /api/lots/:id` - Update lot status

---

## 4. Admin Governance Endpoints

- `GET /api/admin/dashboard` - Platform metrics (`authorize('ADMIN')`)
- `GET /api/admin/users` - Search platform user directory
- `PATCH /api/admin/users/:id/status` - Activate or suspend user
- `GET /api/admin/audit-logs` - View security audit log stream
- `GET /api/admin/system-health` - Check database latency & memory usage
