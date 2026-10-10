# KRISHIINTEL — DATABASE DOCUMENTATION

**ORM:** Prisma ORM  
**Database Engine:** MySQL  
**Schema File:** `backend/prisma/schema.prisma`  

---

## 1. Relational Entity Schema Summary

1. **`User`**: Base identity storing name, email, phone, passwordHash, role (`FARMER`, `FPO_MANAGER`, `ADMIN`), and status (`ACTIVE`, `SUSPENDED`).
2. **`FarmerProfile`**: Profile extending User with village, taluka, district, state, pincode, landArea, landUnit, primaryCrops.
3. **`FPO`**: Co-operative entity storing registrationNumber, managerUserId, district, location coordinates, contact info.
4. **`FPOMember`**: Junction table mapping farmers to FPOs.
5. **`Crop`**: Agricultural crop master storing localName, gujaratiName, hindiName, category, shelfLifeDays.
6. **`HarvestLot`**: Produce lots with lotNumber, farmerId, fpoId, cropId, quantityKg, grade, moisture, harvestDate, location, status.
7. **`Market`**: APMC markets and regional yards with distanceKm from Anand hub.
8. **`MarketPrice`**: Timestamped price observations (minPrice, maxPrice, modalPrice) for market charts and trends.
9. **`Buyer`**: Verified buyer business directory with buyerType (`WHOLESALER`, `TRADER`, `PROCESSOR`, `RETAILER`).
10. **`BuyerCropRequirement`**: Active buying requirements per crop with target prices and grade criteria.
11. **`Offer`**: Offers made on harvest lots with status (`PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`).
12. **`LogisticsProvider` & `TransportVehicle`**: Transport providers and vehicle fleets.
13. **`Shipment` & `ShipmentLocation`**: Dispatches with periodic GPS snapshot coordinates for live tracking.
14. **`Notification`**: In-app user notifications.
15. **`AuditLog`**: Security audit log records.

---

## 2. Seed & Migration Commands

```bash
# Generate Prisma Client
pnpm --filter backend db:generate

# Execute Migration
pnpm --filter backend db:migrate

# Seed Database
pnpm --filter backend db:seed
```
