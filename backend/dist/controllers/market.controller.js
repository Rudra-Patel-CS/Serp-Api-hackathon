"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarkets = getMarkets;
exports.getMarketPrices = getMarketPrices;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
async function getMarkets(req, res) {
    try {
        const markets = await db_1.prisma.market.findMany({
            include: {
                prices: {
                    orderBy: { observedAt: 'desc' },
                    take: 10,
                    include: { crop: true },
                },
            },
        });
        const crops = await db_1.prisma.crop.findMany();
        return (0, response_util_1.sendSuccess)(res, { markets, crops });
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch markets', 500, 'SERVER_ERROR');
    }
}
async function getMarketPrices(req, res) {
    try {
        const marketId = req.params.id;
        const { cropId } = req.query;
        const prices = await db_1.prisma.marketPrice.findMany({
            where: {
                marketId,
                ...(cropId ? { cropId: cropId } : {}),
            },
            include: { crop: true, market: true },
            orderBy: { observedAt: 'desc' },
            take: 30,
        });
        return (0, response_util_1.sendSuccess)(res, prices);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch market prices', 500, 'SERVER_ERROR');
    }
}
