"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmerProfile = getFarmerProfile;
exports.updateFarmerProfile = updateFarmerProfile;
exports.getFarmerLots = getFarmerLots;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
async function getFarmerProfile(req, res) {
    try {
        const userId = req.user.id;
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
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch farmer profile', 500, 'SERVER_ERROR');
    }
}
async function updateFarmerProfile(req, res) {
    try {
        const userId = req.user.id;
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
        return (0, response_util_1.sendError)(res, error.message || 'Failed to update profile', 500, 'SERVER_ERROR');
    }
}
async function getFarmerLots(req, res) {
    try {
        const userId = req.user.id;
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
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch farmer lots', 500, 'SERVER_ERROR');
    }
}
