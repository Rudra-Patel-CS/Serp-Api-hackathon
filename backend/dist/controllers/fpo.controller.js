"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFpos = getFpos;
exports.getFpoById = getFpoById;
exports.getFpoFarmers = getFpoFarmers;
exports.getFpoLots = getFpoLots;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
async function getFpos(req, res) {
    try {
        const fpos = await db_1.prisma.fPO.findMany({
            include: {
                manager: {
                    select: { id: true, name: true, phone: true, email: true },
                },
                members: true,
            },
        });
        return (0, response_util_1.sendSuccess)(res, fpos);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to list FPOs', 500, 'SERVER_ERROR');
    }
}
async function getFpoById(req, res) {
    try {
        const fpoId = req.params.id;
        const fpo = await db_1.prisma.fPO.findUnique({
            where: { id: fpoId },
            include: {
                manager: true,
                members: {
                    include: {
                        farmer: {
                            include: { farmerProfile: true },
                        },
                    },
                },
                harvestLots: {
                    include: { crop: true, farmer: true },
                },
            },
        });
        if (!fpo) {
            return (0, response_util_1.sendError)(res, 'FPO record not found', 404, 'NOT_FOUND');
        }
        return (0, response_util_1.sendSuccess)(res, fpo);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch FPO details', 500, 'SERVER_ERROR');
    }
}
async function getFpoFarmers(req, res) {
    try {
        const userId = req.user.id;
        const fpo = await db_1.prisma.fPO.findFirst({
            where: { managerUserId: userId },
        });
        if (!fpo) {
            return (0, response_util_1.sendError)(res, 'Managed FPO not found for current user', 404, 'NOT_FOUND');
        }
        const members = await db_1.prisma.fPOMember.findMany({
            where: { fpoId: fpo.id },
            include: {
                farmer: {
                    include: {
                        farmerProfile: true,
                        harvestLots: {
                            include: { crop: true },
                        },
                    },
                },
            },
        });
        return (0, response_util_1.sendSuccess)(res, members);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch FPO farmers', 500, 'SERVER_ERROR');
    }
}
async function getFpoLots(req, res) {
    try {
        const userId = req.user.id;
        const fpo = await db_1.prisma.fPO.findFirst({
            where: { managerUserId: userId },
        });
        if (!fpo) {
            return (0, response_util_1.sendError)(res, 'Managed FPO not found', 404, 'NOT_FOUND');
        }
        const lots = await db_1.prisma.harvestLot.findMany({
            where: { fpoId: fpo.id },
            include: {
                crop: true,
                farmer: {
                    select: { id: true, name: true, phone: true },
                },
                offers: {
                    include: { buyer: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_util_1.sendSuccess)(res, lots);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch FPO lots', 500, 'SERVER_ERROR');
    }
}
