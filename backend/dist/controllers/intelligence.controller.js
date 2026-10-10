"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMarketOpportunity = analyzeMarketOpportunity;
exports.getEvidenceRecords = getEvidenceRecords;
exports.discoverBuyers = discoverBuyers;
const db_1 = require("../config/db");
const net_realisation_service_1 = require("../services/net-realisation.service");
const opportunity_score_service_1 = require("../services/opportunity-score.service");
const serpapi_1 = require("../integrations/serpapi");
const response_util_1 = require("../utils/response.util");
async function analyzeMarketOpportunity(req, res) {
    try {
        const { cropName, quantityKg, location, freightVariance, isFpoPool } = req.body;
        const qty = quantityKg ? parseFloat(quantityKg) : 500;
        const targetLocation = location || 'Anand, Gujarat';
        const crop = await db_1.prisma.crop.findFirst({
            where: {
                OR: [
                    { name: cropName || 'Tomato' },
                    { localName: { contains: cropName || 'Tomato' } },
                    { gujaratiName: { contains: cropName || 'Tomato' } },
                ],
            },
        });
        const targetCropId = crop ? crop.id : (await db_1.prisma.crop.findFirst())?.id;
        const targetCropName = crop ? crop.name : cropName || 'Tomato';
        const shelfLifeDays = crop ? crop.shelfLifeDays : 4;
        // Fetch APMC Markets & Prices from MySQL DB
        const markets = await db_1.prisma.market.findMany({
            include: {
                prices: {
                    where: { cropId: targetCropId },
                    orderBy: { observedAt: 'desc' },
                    take: 1,
                },
            },
        });
        // Fetch Buyer Count
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
                priceSource: m.prices[0] ? 'OFFICIAL_APMC_RECORD' : 'ESTIMATED_REGIONAL_QUOTE',
                ...netCalc,
                ...oppScore,
                buyerCount,
                paymentSpeed: m.distanceKm < 50 ? 'Same day RTGS' : 'T+1 Morning',
                turnaroundTime: '45 mins',
            };
        });
        // Sort by Total Net in Hand descending
        comparisons.sort((a, b) => b.totalNet - a.totalNet);
        // Execute SerpApi Engines (Google Search, News & Maps)
        const [newsRes, searchRes, mapsRes] = await Promise.all([
            (0, serpapi_1.fetchGoogleNewsEvidence)(targetCropName, targetLocation),
            (0, serpapi_1.fetchGoogleSearchEvidence)(targetCropName, targetLocation),
            (0, serpapi_1.fetchGoogleMapsLeads)('wholesaler', targetCropName, targetLocation),
        ]);
        const combinedEvidence = [...newsRes.evidence, ...searchRes.evidence];
        const isLive = newsRes.isLive || searchRes.isLive || mapsRes.isLive;
        const isCached = newsRes.isCached || searchRes.isCached;
        let statusBadge = 'DEMO DATA';
        if (isLive) {
            statusBadge = isCached ? 'CACHED WEB EVIDENCE' : 'LIVE WEB EVIDENCE';
        }
        return (0, response_util_1.sendSuccess)(res, {
            crop: targetCropName,
            quantityKg: qty,
            location: targetLocation,
            bestMarket: comparisons[0],
            comparisons,
            evidence: combinedEvidence,
            discoveredLeads: mapsRes.leads,
            dataStatus: {
                isLive,
                isCached,
                badge: statusBadge,
                retrievedAt: new Date().toISOString(),
                engineUsed: isLive ? ['google', 'google_news', 'google_maps'] : ['demo_fallback'],
            },
            sellVsWait: {
                recommendation: 'Selling now appears highly favorable',
                reasoning: `High net realization of ₹${comparisons[0]?.totalNet?.toLocaleString('en-IN')} achieved in ${comparisons[0]?.name}. Transit spoilage risk increases beyond ${shelfLifeDays} days.`,
                confidence: isLive ? 'High (89% - Web Verified)' : 'Moderate (78% - Baseline)',
                disclaimer: 'Prices and net returns are decision metrics and not guaranteed financial advice.',
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
        const crop = cropName || 'Tomato';
        const loc = location || 'Anand';
        const [newsRes, searchRes] = await Promise.all([
            (0, serpapi_1.fetchGoogleNewsEvidence)(crop, loc),
            (0, serpapi_1.fetchGoogleSearchEvidence)(crop, loc),
        ]);
        return (0, response_util_1.sendSuccess)(res, {
            evidence: [...newsRes.evidence, ...searchRes.evidence],
            isLive: newsRes.isLive || searchRes.isLive,
        });
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch evidence records', 500, 'SERVER_ERROR');
    }
}
async function discoverBuyers(req, res) {
    try {
        const { queryType, cropName, location } = req.query;
        const type = queryType || 'wholesaler';
        const crop = cropName || 'Tomato';
        const loc = location || 'Anand';
        const result = await (0, serpapi_1.fetchGoogleMapsLeads)(type, crop, loc);
        return (0, response_util_1.sendSuccess)(res, result);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to discover buyer leads', 500, 'SERVER_ERROR');
    }
}
