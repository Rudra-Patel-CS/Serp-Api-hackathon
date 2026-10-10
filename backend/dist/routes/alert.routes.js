"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alert_controller_1 = require("../controllers/alert.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, alert_controller_1.getUserNotifications);
router.patch('/:id/read', auth_middleware_1.authenticate, alert_controller_1.markNotificationRead);
exports.default = router;
