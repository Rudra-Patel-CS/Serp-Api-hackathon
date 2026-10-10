# KRISHIINTEL — REAL-TIME ARCHITECTURE & SOCKET.IO DOCUMENTATION

---

## 1. Real-Time Telemetry Design

To maintain affordability and prevent database write bloat, live GPS tracking uses periodic snapshots (every 15–60 seconds) sent to the backend endpoint `POST /api/logistics/shipments/:id/location`.

The backend immediately broadcasts the snapshot over Socket.IO to connected client dashboards.

---

## 2. Socket.IO Channels & Rooms

- `shipment:<shipmentId>`: Listens for vehicle location updates (`shipment_location_updated`).
- `user:<userId>`: Listens for personal offer status updates (`offer_updated`) and alerts (`new_notification`).

```javascript
// Example Frontend Subscription
const socket = io('http://localhost:5000', { withCredentials: true });
socket.emit('join_shipment_track', shipmentId);
socket.on('shipment_location_updated', (data) => {
  // Update map coordinates dynamically
});
```
