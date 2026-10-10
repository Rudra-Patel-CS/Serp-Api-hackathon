"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const buyer_controller_1 = require("../controllers/buyer.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, buyer_controller_1.getBuyers);
router.get('/:id', auth_middleware_1.authenticate, buyer_controller_1.getBuyerById);
exports.default = router;
