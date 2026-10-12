"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogisticsProviders = getLogisticsProviders;
exports.getShipments = getShipments;
exports.getShipmentTracking = getShipmentTracking;
exports.updateShipmentLocation = updateShipmentLocation;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
const socket_server_1 = require("../realtime/socket.server");
const memory_db_store_1 = require("../store/memory-db.store");
function isDbAuthError(error) {
    return (error?.name === 'PrismaClientInitializationError' ||
        error?.message?.includes('Authentication failed') ||
        error?.message?.includes('database server') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.code === 'P1001');
}
const FALLBACK_PROVIDERS = [
    {
        id: 'LOG-01',
        name: 'Saurashtra Agro Logistics Pvt Ltd',
        contactPhone: '9876500001',
        rating: 4.8,
        vehicles: [{ id: 'VEH-01', vehicleType: 'Eicher Pro 2059 (14ft)', registrationNumber: 'GJ-07-AT-8821', driverName: 'Vikrambhai' }],
    },
];
const FALLBACK_SHIPMENTS = [
    {
        id: 'SHIP-DEMO-01',
        trackingNumber: 'TRK-982104',
        status: 'IN_TRANSIT',
        originLocation: 'Anand, Gujarat',
        destinationLocation: 'Vadodara APMC',
        estimatedDelivery: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        provider: FALLBACK_PROVIDERS[0],
        vehicle: FALLBACK_PROVIDERS[0].vehicles[0],
        locations: [{ latitude: 22.5645, longitude: 72.9289, speed: 45, recordedAt: new Date().toISOString() }],
    },
];
async function getLogisticsProviders(req, res) {
    try {
        const providers = await db_1.prisma.logisticsProvider.findMany({
            include: { vehicles: true },
        });
        return (0, response_util_1.sendSuccess)(res, providers);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, memory_db_store_1.memoryDbStore.getProviders());
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch providers', 500, 'SERVER_ERROR');
    }
}
async function getShipments(req, res) {
    try {
        const userId = req.user?.id || 'DEMO-FARMER-001';
        const role = req.user?.role || 'FARMER';
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
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, memory_db_store_1.memoryDbStore.getShipments());
        }
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
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, FALLBACK_SHIPMENTS[0]);
        }
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
        (0, socket_server_1.emitShipmentLocationUpdate)(shipmentId, snapshot);
        return (0, response_util_1.sendSuccess)(res, snapshot, 201);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            const snap = {
                id: `LOC-${Date.now()}`,
                shipmentId: req.params.id,
                latitude: parseFloat(req.body.latitude || 22.5645),
                longitude: parseFloat(req.body.longitude || 72.9289),
                speed: parseFloat(req.body.speed || 45),
                recordedAt: new Date().toISOString(),
            };
            return (0, response_util_1.sendSuccess)(res, snap, 201);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to record location update', 500, 'SERVER_ERROR');
    }
}
