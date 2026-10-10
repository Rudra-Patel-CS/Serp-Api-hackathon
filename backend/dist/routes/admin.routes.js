"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// All admin routes strictly enforced with authorize(Role.ADMIN)
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.ADMIN));
router.get('/dashboard', admin_controller_1.getAdminDashboardStats);
router.get('/users', admin_controller_1.getAdminUsers);
router.patch('/users/:id/status', admin_controller_1.updateUserStatus);
router.get('/audit-logs', admin_controller_1.getAuditLogs);
router.get('/system-health', admin_controller_1.getSystemHealth);
exports.default = router;
