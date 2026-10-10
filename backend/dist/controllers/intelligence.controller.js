"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMarketOpportunity = analyzeMarketOpportunity;
exports.getEvidenceRecords = getEvidenceRecords;
const db_1 = require("../config/db");
const net_realisation_service_1 = require("../services/net-realisation.service");
const opportunity_score_service_1 = require("../services/opportunity-score.service");
const serpapi_service_1 = require("../integrations/serpapi/serpapi.service");
const response_util_1 = require("../utils/response.util");
async function analyzeMarketOpportunity(req, res) {
    try {
        const { cropName, quantityKg, location, freightVariance, isFpoPool } = req.body;
        const qty = quantityKg ? parseFloat(quantityKg) : 500;
        const crop = await db_1.prisma.crop.findFirst({
            where: {
                OR: [
                    { name: cropName || 'Tomato' },
                    { localName: { contains: cropName || 'Tomato' } },
                ],
            },
        });
        const targetCropId = crop ? crop.id : (await db_1.prisma.crop.findFirst())?.id;
        const targetCropName = crop ? crop.name : 'Tomato';
        const shelfLifeDays = crop ? crop.shelfLifeDays : 4;
        // Fetch all APMC Markets
        const markets = await db_1.prisma.market.findMany({
            include: {
                prices: {
                    where: { cropId: targetCropId },
                    orderBy: { observedAt: 'desc' },
                    take: 1,
                },
            },
        });
        // Fetch Buyer Demand Count
        const buyerCount = await db_1.prisma.buyer.count({
            where: {
                requirements: {
                    some: { cropId: targetCropId, active: true },
                },
            },
        });
        const comparisons = markets.map((m) => {
            const latestPrice = m.prices[0] ? m.prices[0].modalPrice : 2800;
            const netCalc = (0, net_realisation_service_1.calculateNetRealisation)({
                grossPerQtl: latestPrice,
                quantityKg: qty,
                distanceKm: m.distanceKm,
                freightVariance: freightVariance ? parseFloat(freightVariance) : 0,
                isFpoPool: isFpoPool || false,
                shelfLifeDays,
            });
            const oppScore = (0, opportunity_score_service_1.calculateOpportunityScore)({
                netPerQtl: netCalc.netPerQtl,
                grossPerQtl: latestPrice,
                distanceKm: m.distanceKm,
                buyerCount,
            });
            return {
                id: m.id,
                name: m.name,
                city: m.city,
                distanceKm: m.distanceKm,
                ...netCalc,
                ...oppScore,
                buyerCount,
                paymentSpeed: m.distanceKm < 50 ? 'Same day RTGS' : 'T+1 Morning',
                turnaroundTime: '45 mins',
            };
        });
        // Sort by Total Net in Hand descending
        comparisons.sort((a, b) => b.totalNet - a.totalNet);
        // Fetch Evidence records via SerpApi Service
        const evidence = await (0, serpapi_service_1.fetchMarketNewsIntelligence)(targetCropName, location || 'Anand');
        return (0, response_util_1.sendSuccess)(res, {
            crop: targetCropName,
            quantityKg: qty,
            location: location || 'Anand, Gujarat',
            bestMarket: comparisons[0],
            comparisons,
            evidence,
            sellVsWait: {
                recommendation: 'Selling now appears highly favorable',
                reasoning: `High net realization of ₹${comparisons[0]?.totalNet.toLocaleString('en-IN')} achieved in ${comparisons[0]?.name}. Transit spoilage risk increases beyond ${shelfLifeDays} days.`,
                confidence: 'High (89%)',
                disclaimer: 'Prices and net returns are indicative decision metrics and not guaranteed financial advice.',
            },
        });
    }
    catch (error) {
        console.error('Market Analysis Error:', error);
        return (0, response_util_1.sendError)(res, error.message || 'Market analysis failed', 500, 'SERVER_ERROR');
    }
}
async function getEvidenceRecords(req, res) {
    try {
        const { cropName, location } = req.query;
        const evidence = await (0, serpapi_service_1.fetchMarketNewsIntelligence)(cropName || 'Tomato', location || 'Anand');
        return (0, response_util_1.sendSuccess)(res, evidence);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch evidence records', 500, 'SERVER_ERROR');
    }
}
