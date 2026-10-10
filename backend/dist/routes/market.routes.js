"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const market_controller_1 = require("../controllers/market.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, market_controller_1.getMarkets);
router.get('/:id/prices', auth_middleware_1.authenticate, market_controller_1.getMarketPrices);
exports.default = router;
