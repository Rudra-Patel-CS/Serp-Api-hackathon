"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffers = getOffers;
exports.createOffer = createOffer;
exports.updateOfferStatus = updateOfferStatus;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
const client_1 = require("@prisma/client");
const socket_server_1 = require("../realtime/socket.server");
const memory_db_store_1 = require("../store/memory-db.store");
function isDbAuthError(error) {
    return (error?.name === 'PrismaClientInitializationError' ||
        error?.message?.includes('Authentication failed') ||
        error?.message?.includes('database server') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.code === 'P1001');
}
async function getOffers(req, res) {
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
        const offers = await db_1.prisma.offer.findMany({
            where,
            include: {
                buyer: true,
                lot: {
                    include: { crop: true, farmer: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_util_1.sendSuccess)(res, offers);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, memory_db_store_1.memoryDbStore.getOffers());
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch offers', 500, 'SERVER_ERROR');
    }
}
async function createOffer(req, res) {
    try {
        const { lotId, buyerId, offeredPrice, quantityKg } = req.body;
        if (!lotId || !buyerId || !offeredPrice || !quantityKg) {
            return (0, response_util_1.sendError)(res, 'lotId, buyerId, offeredPrice, and quantityKg are required', 400, 'VALIDATION_ERROR');
        }
        const lot = await db_1.prisma.harvestLot.findUnique({ where: { id: lotId } });
        if (!lot) {
            return (0, response_util_1.sendError)(res, 'Harvest lot not found', 404, 'NOT_FOUND');
        }
        const offer = await db_1.prisma.offer.create({
            data: {
                lotId,
                buyerId,
                offeredPrice: parseFloat(offeredPrice),
                quantityKg: parseFloat(quantityKg),
                status: client_1.OfferStatus.PENDING,
                expiresAt: new Date(Date.now() + 48 * 3600 * 1000),
            },
            include: { buyer: true, lot: true },
        });
        (0, socket_server_1.emitNotificationEvent)(lot.farmerId, {
            title: 'New Offer Received!',
            message: `Buyer ${offer.buyer.businessName} made an offer of ₹${offeredPrice}/kg for Lot #${lot.lotNumber}`,
            entityType: 'Offer',
            entityId: offer.id,
        });
        await db_1.prisma.notification.create({
            data: {
                userId: lot.farmerId,
                type: 'OFFER_RECEIVED',
                title: 'New Offer Received!',
                message: `Buyer ${offer.buyer.businessName} made an offer of ₹${offeredPrice}/kg for Lot #${lot.lotNumber}`,
                entityType: 'Offer',
                entityId: offer.id,
            },
        });
        return (0, response_util_1.sendSuccess)(res, offer, 201);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            const createdOffer = memory_db_store_1.memoryDbStore.createOffer(req.body);
            return (0, response_util_1.sendSuccess)(res, createdOffer, 201);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to create offer', 500, 'SERVER_ERROR');
    }
}
async function updateOfferStatus(req, res) {
    try {
        const offerId = req.params.id;
        const { status } = req.body;
        if (!status || !['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
            return (0, response_util_1.sendError)(res, 'Invalid offer status', 400, 'VALIDATION_ERROR');
        }
        const offer = await db_1.prisma.offer.findUnique({
            where: { id: offerId },
            include: { lot: true, buyer: true },
        });
        if (!offer) {
            return (0, response_util_1.sendError)(res, 'Offer not found', 404, 'NOT_FOUND');
        }
        const updatedOffer = await db_1.prisma.offer.update({
            where: { id: offerId },
            data: { status: status },
            include: { buyer: true, lot: true },
        });
        if (status === 'ACCEPTED') {
            await db_1.prisma.harvestLot.update({
                where: { id: offer.lotId },
                data: { status: client_1.LotStatus.SOLD },
            });
        }
        (0, socket_server_1.emitOfferEvent)(offer.lot.farmerId, updatedOffer);
        await db_1.prisma.auditLog.create({
            data: {
                userId: req.user?.id || 'DEMO-FARMER-001',
                action: `OFFER_${status}`,
                entityType: 'Offer',
                entityId: offer.id,
                metadata: JSON.stringify({ offeredPrice: offer.offeredPrice, lotId: offer.lotId }),
                ipAddress: req.ip,
            },
        });
        return (0, response_util_1.sendSuccess)(res, updatedOffer);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            const fallbackOffers = memory_db_store_1.memoryDbStore.getOffers();
            const off = fallbackOffers.find((o) => o.id === req.params.id) || fallbackOffers[0];
            if (off)
                off.status = req.body.status;
            return (0, response_util_1.sendSuccess)(res, off || { id: req.params.id, status: req.body.status });
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to update offer', 500, 'SERVER_ERROR');
    }
}
