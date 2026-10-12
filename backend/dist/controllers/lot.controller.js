"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLots = getLots;
exports.getLotById = getLotById;
exports.createLot = createLot;
exports.updateLot = updateLot;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
const client_1 = require("@prisma/client");
const memory_db_store_1 = require("../store/memory-db.store");
function isDbAuthError(error) {
    return (error?.name === 'PrismaClientInitializationError' ||
        error?.message?.includes('Authentication failed') ||
        error?.message?.includes('database server') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.code === 'P1001');
}
async function getLots(req, res) {
    try {
        const { status, cropId, farmerId, fpoId } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (cropId)
            where.cropId = cropId;
        if (farmerId)
            where.farmerId = farmerId;
        if (fpoId)
            where.fpoId = fpoId;
        if (req.user?.role === 'FARMER') {
            where.farmerId = req.user.id;
        }
        const lots = await db_1.prisma.harvestLot.findMany({
            where,
            include: {
                crop: true,
                farmer: {
                    select: { id: true, name: true, phone: true, avatarUrl: true },
                },
                fpo: true,
                offers: {
                    include: { buyer: true },
                },
                shipments: {
                    include: { provider: true, vehicle: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_util_1.sendSuccess)(res, lots);
    }
    catch (error) {
        console.error('getLots DB Error:', error?.message);
        if (isDbAuthError(error)) {
            const fallbackFarmerId = req.user?.role === 'FARMER' ? (req.user.id || 'DEMO-FARMER-001') : req.query.farmerId;
            const fallbackLots = memory_db_store_1.memoryDbStore.getLots({ farmerId: fallbackFarmerId });
            return (0, response_util_1.sendSuccess)(res, fallbackLots);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch lots', 500, 'SERVER_ERROR');
    }
}
async function getLotById(req, res) {
    try {
        const lotId = req.params.id;
        const lot = await db_1.prisma.harvestLot.findUnique({
            where: { id: lotId },
            include: {
                crop: true,
                farmer: { include: { farmerProfile: true } },
                fpo: true,
                offers: { include: { buyer: true } },
                shipments: { include: { provider: true, vehicle: true, locations: true } },
            },
        });
        if (!lot) {
            return (0, response_util_1.sendError)(res, 'Harvest lot not found', 404, 'NOT_FOUND');
        }
        return (0, response_util_1.sendSuccess)(res, lot);
    }
    catch (error) {
        console.error('getLotById DB Error:', error?.message);
        if (isDbAuthError(error)) {
            const fallbackLot = memory_db_store_1.memoryDbStore.getLotById(req.params.id);
            if (fallbackLot)
                return (0, response_util_1.sendSuccess)(res, fallbackLot);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch lot', 500, 'SERVER_ERROR');
    }
}
async function createLot(req, res) {
    try {
        const userId = req.user?.id || 'DEMO-FARMER-001';
        const { cropId, quantityKg, grade, moisture, farmPlot, harvestDate, location } = req.body;
        if (!cropId || !quantityKg || !grade) {
            return (0, response_util_1.sendError)(res, 'cropId, quantityKg, and grade are required', 400, 'VALIDATION_ERROR');
        }
        const membership = await db_1.prisma.fPOMember.findFirst({
            where: { farmerId: userId, status: 'ACTIVE' },
        });
        const lotNumber = `LOT-${Date.now().toString().slice(-6)}`;
        const newLot = await db_1.prisma.harvestLot.create({
            data: {
                lotNumber,
                farmerId: userId,
                fpoId: membership ? membership.fpoId : null,
                cropId,
                quantityKg: parseFloat(quantityKg),
                grade: grade || 'Grade A',
                moisture: moisture || '14%',
                farmPlot: farmPlot || 'Plot 1',
                harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
                location: location || 'Anand, Gujarat',
                status: client_1.LotStatus.READY,
            },
            include: {
                crop: true,
                farmer: { select: { id: true, name: true } },
            },
        });
        await db_1.prisma.auditLog.create({
            data: {
                userId,
                action: 'LOT_CREATED',
                entityType: 'HarvestLot',
                entityId: newLot.id,
                metadata: JSON.stringify({ lotNumber, cropId, quantityKg }),
                ipAddress: req.ip,
            },
        });
        return (0, response_util_1.sendSuccess)(res, newLot, 201);
    }
    catch (error) {
        console.error('createLot DB Error:', error?.message);
        if (isDbAuthError(error)) {
            const createdFallbackLot = memory_db_store_1.memoryDbStore.createLot({
                farmerId: req.user?.id || 'DEMO-FARMER-001',
                cropId: req.body.cropId,
                quantityKg: req.body.quantityKg,
                grade: req.body.grade,
                moisture: req.body.moisture,
                farmPlot: req.body.farmPlot,
                location: req.body.location,
            });
            return (0, response_util_1.sendSuccess)(res, createdFallbackLot, 201);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to create lot', 500, 'SERVER_ERROR');
    }
}
async function updateLot(req, res) {
    try {
        const lotId = req.params.id;
        const { status, grade, quantityKg, location } = req.body;
        const existingLot = await db_1.prisma.harvestLot.findUnique({ where: { id: lotId } });
        if (!existingLot) {
            return (0, response_util_1.sendError)(res, 'Lot not found', 404, 'NOT_FOUND');
        }
        if (req.user?.role === 'FARMER' && existingLot.farmerId !== req.user.id) {
            return (0, response_util_1.sendError)(res, 'Unauthorized access to another farmer lot', 403, 'FORBIDDEN');
        }
        const updatedLot = await db_1.prisma.harvestLot.update({
            where: { id: lotId },
            data: {
                ...(status ? { status: status } : {}),
                ...(grade ? { grade } : {}),
                ...(quantityKg ? { quantityKg: parseFloat(quantityKg) } : {}),
                ...(location ? { location } : {}),
            },
            include: { crop: true, farmer: true },
        });
        return (0, response_util_1.sendSuccess)(res, updatedLot);
    }
    catch (error) {
        console.error('updateLot DB Error:', error?.message);
        if (isDbAuthError(error)) {
            const fallbackLot = memory_db_store_1.memoryDbStore.getLotById(req.params.id);
            if (fallbackLot) {
                if (req.body.status)
                    fallbackLot.status = req.body.status;
                if (req.body.grade)
                    fallbackLot.grade = req.body.grade;
                if (req.body.quantityKg)
                    fallbackLot.quantityKg = parseFloat(req.body.quantityKg);
                if (req.body.location)
                    fallbackLot.location = req.body.location;
                return (0, response_util_1.sendSuccess)(res, fallbackLot);
            }
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to update lot', 500, 'SERVER_ERROR');
    }
}
