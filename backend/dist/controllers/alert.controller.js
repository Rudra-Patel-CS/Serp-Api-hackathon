"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotifications = getUserNotifications;
exports.markNotificationRead = markNotificationRead;
const db_1 = require("../config/db");
const response_util_1 = require("../utils/response.util");
async function getUserNotifications(req, res) {
    try {
        const userId = req.user.id;
        const notifications = await db_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return (0, response_util_1.sendSuccess)(res, notifications);
    }
    catch (error) {
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
        return (0, response_util_1.sendError)(res, error.message || 'Failed to mark notification as read', 500, 'SERVER_ERROR');
    }
}
