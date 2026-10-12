"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotifications = getUserNotifications;
exports.markNotificationRead = markNotificationRead;
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
const FALLBACK_ALERTS = [
    {
        id: 'ALT-01',
        title: 'Tomato Mandi Price Rally',
        message: 'Rajkot APMC Tomato modal price surged +4.8% to ₹3,620/qtl based on SerpApi live signal.',
        type: 'PRICE_ALERT',
        read: false,
        createdAt: new Date().toISOString(),
    },
];
async function getUserNotifications(req, res) {
    try {
        const userId = req.user?.id || 'DEMO-FARMER-001';
        const notifications = await db_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return (0, response_util_1.sendSuccess)(res, notifications);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, memory_db_store_1.memoryDbStore.getAlerts());
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to fetch notifications', 500, 'SERVER_ERROR');
    }
}
async function markNotificationRead(req, res) {
    try {
        const alertId = req.params.id;
        const notification = await db_1.prisma.notification.update({
            where: { id: alertId },
            data: { read: true },
        });
        return (0, response_util_1.sendSuccess)(res, notification);
    }
    catch (error) {
        if (isDbAuthError(error)) {
            return (0, response_util_1.sendSuccess)(res, { id: req.params.id, read: true });
        }
        return (0, response_util_1.sendError)(res, error.message || 'Failed to mark notification as read', 500, 'SERVER_ERROR');
    }
}
