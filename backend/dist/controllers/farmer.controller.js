"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmerProfile = getFarmerProfile;
exports.updateFarmerProfile = updateFarmerProfile;
exports.getFarmerLots = getFarmerLots;
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
async function getFarmerProfile(req, res) {
    try {
        const userId = req.user?.id || 'DEMO-FARMER-001';
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                farmerProfile: true,
                fpoMemberships: {
                    include: {
                        fpo: true,
                    },
                },
            },
        });
        if (!user) {
            return (0, response_util_1.sendError)(res, 'Farmer profile not found', 404, 'NOT_FOUND');
        }
        return (0, response_util_1.sendSuccess)(res, user);
    }
    catch (error) {
        console.error('getFarmerProfile DB Error:', error?.message);
        if (isDbAuthError(error)) {
            const fallbackUser = memory_db_store_1.memoryDbStore.getUserById(req.user?.id || 'DEMO-FARMER-001') || memory_db_store_1.memoryDbStore.getUsers()[0];
            return (0, response_util_1.sendSuccess)(res, fallbackUser);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch farmer profile', 500, 'SERVER_ERROR');
    }
}
async function updateFarmerProfile(req, res) {
    try {
        const userId = req.user?.id || 'DEMO-FARMER-001';
        const { name, village, taluka, district, state, pincode, landArea, landUnit, primaryCrops } = req.body;
        const updatedUser = await db_1.prisma.user.update({
            where: { id: userId },
            data: {
                ...(name ? { name } : {}),
                farmerProfile: {
                    update: {
                        ...(village ? { village } : {}),
                        ...(taluka ? { taluka } : {}),
                        ...(district ? { district } : {}),
                        ...(state ? { state } : {}),
                        ...(pincode ? { pincode } : {}),
                        ...(landArea ? { landArea: parseFloat(landArea) } : {}),
                        ...(landUnit ? { landUnit } : {}),
                        ...(primaryCrops ? { primaryCrops } : {}),
                    },
                },
            },
            include: { farmerProfile: true },
        });
        return (0, response_util_1.sendSuccess)(res, updatedUser);
    }
    catch (error) {
        console.error('updateFarmerProfile DB Error:', error?.message);
        if (isDbAuthError(error)) {
            const fallbackUser = memory_db_store_1.memoryDbStore.getUserById(req.user?.id || 'DEMO-FARMER-001') || memory_db_store_1.memoryDbStore.getUsers()[0];
            if (req.body.name)
                fallbackUser.name = req.body.name;
            if (!fallbackUser.farmerProfile)
                fallbackUser.farmerProfile = {};
            if (req.body.village)
                fallbackUser.farmerProfile.village = req.body.village;
            if (req.body.district)
                fallbackUser.farmerProfile.district = req.body.district;
            if (req.body.state)
                fallbackUser.farmerProfile.state = req.body.state;
            if (req.body.landArea)
                fallbackUser.farmerProfile.landArea = parseFloat(req.body.landArea);
            if (req.body.primaryCrops)
                fallbackUser.farmerProfile.primaryCrops = req.body.primaryCrops;
            return (0, response_util_1.sendSuccess)(res, fallbackUser);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to update profile', 500, 'SERVER_ERROR');
    }
}
async function getFarmerLots(req, res) {
    try {
        const userId = req.user?.id || 'DEMO-FARMER-001';
        const lots = await db_1.prisma.harvestLot.findMany({
            where: { farmerId: userId },
            include: {
                crop: true,
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
        console.error('getFarmerLots DB Error:', error?.message);
        if (isDbAuthError(error)) {
            const farmerId = req.user?.id || 'DEMO-FARMER-001';
            const fallbackLots = memory_db_store_1.memoryDbStore.getLots({ farmerId });
            return (0, response_util_1.sendSuccess)(res, fallbackLots);
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch farmer lots', 500, 'SERVER_ERROR');
    }
}
