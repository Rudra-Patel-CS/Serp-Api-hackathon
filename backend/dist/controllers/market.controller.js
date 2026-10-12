"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarkets = getMarkets;
exports.getMarketPrices = getMarketPrices;
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
const FALLBACK_MARKETS = [
    { id: 'APMC-ANAND-01', name: 'Anand APMC Mandi', city: 'Anand', distanceKm: 14, prices: [] },
    { id: 'APMC-AHMEDABAD-02', name: 'Ahmedabad APMC (Vasna)', city: 'Ahmedabad', distanceKm: 68, prices: [] },
    { id: 'APMC-VADODARA-03', name: 'Vadodara APMC (Sayajipura)', city: 'Vadodara', distanceKm: 42, prices: [] },
    { id: 'APMC-RAJKOT-04', name: 'Rajkot APMC Market', city: 'Rajkot', distanceKm: 185, prices: [] },
];
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
        console.error('getMarkets DB Error:', error?.message);
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, {
                markets: FALLBACK_MARKETS,
                crops: memory_db_store_1.memoryDbStore.getCrops(),
            });
        }
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
        console.error('getMarketPrices DB Error:', error?.message);
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, []);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch market prices', 500, 'SERVER_ERROR');
    }
}
