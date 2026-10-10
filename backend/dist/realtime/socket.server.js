"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = initSocketServer;
exports.emitShipmentLocationUpdate = emitShipmentLocationUpdate;
exports.emitOfferEvent = emitOfferEvent;
exports.emitNotificationEvent = emitNotificationEvent;
const socket_io_1 = require("socket.io");
const config_1 = require("../config");
let io = null;
function initSocketServer(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [config_1.config.frontendUrl, 'http://localhost:3000', 'http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log(`📡 Socket connected: ${socket.id}`);
        socket.on('join_user_channel', (userId) => {
            socket.join(`user:${userId}`);
            console.log(`User socket ${socket.id} joined channel user:${userId}`);
        });
        socket.on('join_shipment_track', (shipmentId) => {
            socket.join(`shipment:${shipmentId}`);
            console.log(`Socket ${socket.id} joined tracking for shipment:${shipmentId}`);
        });
        socket.on('leave_shipment_track', (shipmentId) => {
            socket.leave(`shipment:${shipmentId}`);
        });
        socket.on('disconnect', () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });
    return io;
}
function emitShipmentLocationUpdate(shipmentId, locationData) {
    if (io) {
        io.to(`shipment:${shipmentId}`).emit('shipment_location_updated', {
            shipmentId,
            ...locationData,
            recordedAt: new Date().toISOString(),
        });
    }
}
function emitOfferEvent(userId, offerData) {
    if (io) {
        io.to(`user:${userId}`).emit('offer_updated', offerData);
    }
}
function emitNotificationEvent(userId, notificationData) {
    if (io) {
        io.to(`user:${userId}`).emit('new_notification', notificationData);
    }
}
