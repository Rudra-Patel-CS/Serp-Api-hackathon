"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardStats = getAdminDashboardStats;
exports.getAdminUsers = getAdminUsers;
exports.updateUserStatus = updateUserStatus;
exports.getAuditLogs = getAuditLogs;
exports.getSystemHealth = getSystemHealth;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
async function getAdminDashboardStats(req, res) {
    try {
        const totalUsers = await db_1.prisma.user.count();
        const activeFarmers = await db_1.prisma.user.count({ where: { role: 'FARMER', status: 'ACTIVE' } });
        const activeFpos = await db_1.prisma.fPO.count({ where: { status: 'ACTIVE' } });
        const verifiedBuyers = await db_1.prisma.buyer.count({ where: { verified: true } });
        const totalLots = await db_1.prisma.harvestLot.count();
        const activeShipments = await db_1.prisma.shipment.count({ where: { status: 'IN_TRANSIT' } });
        const produceSum = await db_1.prisma.harvestLot.aggregate({
            _sum: { quantityKg: true },
        });
        const totalProduceKg = produceSum._sum.quantityKg || 0;
        const acceptedOffers = await db_1.prisma.offer.findMany({
            where: { status: 'ACCEPTED' },
        });
        const totalTransactionValue = acceptedOffers.reduce((acc, curr) => acc + curr.offeredPrice * curr.quantityKg, 0);
        const recentAuditLogs = await db_1.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 6,
            include: {
                user: { select: { name: true, email: true, role: true } },
            },
        });
        return (0, response_util_1.sendSuccess)(res, {
            metrics: {
                totalUsers,
                activeFarmers,
                activeFpos,
                verifiedBuyers,
                totalLots,
                activeShipments,
                totalProduceKg,
                totalTransactionValue,
            },
            recentAuditLogs,
        });
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch admin stats', 500, 'SERVER_ERROR');
    }
}
async function getAdminUsers(req, res) {
    try {
        const { role, status, search } = req.query;
        const where = {};
        if (role)
            where.role = role;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
            ];
        }
        const users = await db_1.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                lastLoginAt: true,
                farmerProfile: true,
                managedFpo: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_util_1.sendSuccess)(res, users);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch users', 500, 'SERVER_ERROR');
    }
}
async function updateUserStatus(req, res) {
    try {
        const userId = req.params.id;
        const { status } = req.body;
        if (!status || !['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) {
            return (0, response_util_1.sendError)(res, 'Invalid user status', 400, 'VALIDATION_ERROR');
        }
        const updatedUser = await db_1.prisma.user.update({
            where: { id: userId },
            data: { status: status },
            select: { id: true, name: true, email: true, role: true, status: true },
        });
        await db_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: `USER_STATUS_${status}`,
                entityType: 'User',
                entityId: userId,
                metadata: JSON.stringify({ updatedStatus: status }),
                ipAddress: req.ip,
            },
        });
        return (0, response_util_1.sendSuccess)(res, updatedUser);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to update user status', 500, 'SERVER_ERROR');
    }
}
async function getAuditLogs(req, res) {
    try {
        const logs = await db_1.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: { select: { id: true, name: true, email: true, role: true } },
            },
        });
        return (0, response_util_1.sendSuccess)(res, logs);
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch audit logs', 500, 'SERVER_ERROR');
    }
}
async function getSystemHealth(req, res) {
    try {
        const dbPingStart = Date.now();
        await db_1.prisma.$queryRaw `SELECT 1`;
        const dbLatencyMs = Date.now() - dbPingStart;
        return (0, response_util_1.sendSuccess)(res, {
            status: 'HEALTHY',
            uptimeSeconds: process.uptime(),
            database: {
                status: 'CONNECTED',
                latencyMs: dbLatencyMs,
            },
            memoryUsage: process.memoryUsage(),
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, 'Database connection healthcheck failed', 500, 'DATABASE_UNHEALTHY');
    }
}
