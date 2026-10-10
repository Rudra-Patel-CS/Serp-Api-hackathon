"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogisticsProviders = getLogisticsProviders;
exports.getShipments = getShipments;
exports.getShipmentTracking = getShipmentTracking;
exports.updateShipmentLocation = updateShipmentLocation;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
const socket_server_1 = require("../realtime/socket.server");
async function getLogisticsProviders(req, res) {
    try {
        const providers = await db_1.prisma.logisticsProvider.findMany({
            include: { vehicles: true },
        });
        return (0, response_util_1.sendSuccess)(res, providers);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch providers', 500, 'SERVER_ERROR');
    }
}
async function getShipments(req, res) {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let where = {};
        if (role === 'FARMER') {
            where.lot = { farmerId: userId };
        }
        else if (role === 'FPO_MANAGER') {
            const fpo = await db_1.prisma.fPO.findFirst({ where: { managerUserId: userId } });
            if (fpo) {
                where.lot = { fpoId: fpo.id };
            }
        }
        const shipments = await db_1.prisma.shipment.findMany({
            where,
            include: {
                lot: { include: { crop: true, farmer: true } },
                provider: true,
                vehicle: true,
                locations: {
                    orderBy: { recordedAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_util_1.sendSuccess)(res, shipments);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch shipments', 500, 'SERVER_ERROR');
    }
}
async function getShipmentTracking(req, res) {
    try {
        const shipmentId = req.params.id;
        const shipment = await db_1.prisma.shipment.findUnique({
            where: { id: shipmentId },
            include: {
                lot: { include: { crop: true, farmer: true } },
                provider: true,
                vehicle: true,
                locations: {
                    orderBy: { recordedAt: 'asc' },
                },
            },
        });
        if (!shipment) {
            return (0, response_util_1.sendError)(res, 'Shipment not found', 404, 'NOT_FOUND');
        }
        return (0, response_util_1.sendSuccess)(res, shipment);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch shipment tracking', 500, 'SERVER_ERROR');
    }
}
async function updateShipmentLocation(req, res) {
    try {
        const shipmentId = req.params.id;
        const { latitude, longitude, speed, heading, accuracy } = req.body;
        if (!latitude || !longitude) {
            return (0, response_util_1.sendError)(res, 'latitude and longitude are required', 400, 'VALIDATION_ERROR');
        }
        const snapshot = await db_1.prisma.shipmentLocation.create({
            data: {
                shipmentId,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                speed: speed ? parseFloat(speed) : 45,
                heading: heading ? parseFloat(heading) : 315,
                accuracy: accuracy ? parseFloat(accuracy) : 5,
            },
        });
        // Emit live location update over Socket.IO room `shipment:${shipmentId}`
        (0, socket_server_1.emitShipmentLocationUpdate)(shipmentId, snapshot);
        return (0, response_util_1.sendSuccess)(res, snapshot, 201);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to record location update', 500, 'SERVER_ERROR');
    }
}
