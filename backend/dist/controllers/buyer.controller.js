"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuyers = getBuyers;
exports.getBuyerById = getBuyerById;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
const memory_db_store_1 = require("../store/memory-db.store");
function isDbAuthError(error) {
    return (error?.name === 'PrismaClientInitializationError' ||
        error?.message?.includes('Authentication failed') ||
        error?.message?.includes('database server') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.code === 'P1001');
}
async function getBuyers(req, res) {
    try {
        const { buyerType, cropId } = req.query;
        const buyers = await db_1.prisma.buyer.findMany({
            where: {
                ...(buyerType ? { buyerType: buyerType } : {}),
                ...(cropId ? { requirements: { some: { cropId: cropId, active: true } } } : {}),
            },
            include: {
                requirements: { include: { crop: true } },
            },
            orderBy: { rating: 'desc' },
        });
        return (0, response_util_1.sendSuccess)(res, buyers);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, memory_db_store_1.memoryDbStore.getBuyers());
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch buyers', 500, 'SERVER_ERROR');
    }
}
async function getBuyerById(req, res) {
    try {
        const buyerId = req.params.id;
        const buyer = await db_1.prisma.buyer.findUnique({
            where: { id: buyerId },
            include: {
                requirements: { include: { crop: true } },
                offers: { include: { lot: true } },
            },
        });
        if (!buyer) {
            return (0, response_util_1.sendError)(res, 'Buyer not found', 404, 'NOT_FOUND');
        }
        return (0, response_util_1.sendSuccess)(res, buyer);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            const b = memory_db_store_1.memoryDbStore.getBuyers().find((b) => b.id === req.params.id) || memory_db_store_1.memoryDbStore.getBuyers()[0];
            return (0, response_util_1.sendSuccess)(res, b);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch buyer details', 500, 'SERVER_ERROR');
    }
}
