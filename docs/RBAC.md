# KRISHIINTEL — ROLE-BASED ACCESS CONTROL (RBAC) MATRIX

---

## 1. Primary Platform Roles

1. **`FARMER`**: Individual harvest lot seller.
2. **`FPO_MANAGER`**: Co-operative manager aggregating member produce and coordinating dispatches.
3. **`ADMIN`**: Platform administrator with system-wide governance, audit log access, and user control.

---

## 2. Capabilities Authorization Matrix

| Platform Capability | FARMER | FPO_MANAGER | ADMIN | Authorization Rule |
|---|:---:|:---:|:---:|---|
| **Access Farmer Portal (`/farmer/*`)** | ✓ | — | ✓ | `authorize('FARMER', 'ADMIN')` |
| **Access FPO Portal (`/fpo/*`)** | — | ✓ | ✓ | `authorize('FPO_MANAGER', 'ADMIN')` |
| **Access Admin Console (`/admin/*`)** | — | — | ✓ | `authorize('ADMIN')` |
| **Create & Update Personal Lots** | ✓ | — | ✓ | Ownership Check (`lot.farmerId === user.id`) |
| **Approve Member Procurement** | — | ✓ | ✓ | FPO Membership Check |
| **Aggregate Lot Pooling** | — | ✓ | ✓ | `authorize('FPO_MANAGER', 'ADMIN')` |
| **Accept / Reject Buyer Offers** | ✓ | ✓ | View | Offer Ownership Check |
| **User Status Activation / Suspension** | — | — | ✓ | `authorize('ADMIN')` |
| **View Audit Logs & System Health** | — | — | ✓ | `authorize('ADMIN')` |

---

## 3. Role Pre-Selection Flow Security Rule

To prevent privilege escalation:
1. User selects role on `/auth/role`.
2. Selected role is sent during login API call (`/api/auth/login`).
3. Backend validates password hash AND verifies that `user.role === selectedRole`.
4. If role does not match, request is rejected with `ROLE_MISMATCH` (HTTP 400).
