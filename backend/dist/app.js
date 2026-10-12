"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const farmer_routes_1 = __importDefault(require("./routes/farmer.routes"));
const fpo_routes_1 = __importDefault(require("./routes/fpo.routes"));
const lot_routes_1 = __importDefault(require("./routes/lot.routes"));
const market_routes_1 = __importDefault(require("./routes/market.routes"));
const intelligence_routes_1 = __importDefault(require("./routes/intelligence.routes"));
const buyer_routes_1 = __importDefault(require("./routes/buyer.routes"));
const offer_routes_1 = __importDefault(require("./routes/offer.routes"));
const logistics_routes_1 = __importDefault(require("./routes/logistics.routes"));
const alert_routes_1 = __importDefault(require("./routes/alert.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
app.use((0, cors_1.default)({
    origin: [config_1.config.frontendUrl, 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Root & Healthcheck Routes
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'KrishiIntel Backend API Server is running successfully.',
        healthCheck: '/api/health',
        timestamp: new Date(),
    });
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', system: 'KrishiIntel Express Backend API', timestamp: new Date() });
});
// API Domain Routers
app.use('/api/auth', auth_routes_1.default);
app.use('/api/farmers', farmer_routes_1.default);
app.use('/api/fpos', fpo_routes_1.default);
app.use('/api/lots', lot_routes_1.default);
app.use('/api/markets', market_routes_1.default);
app.use('/api/market-intelligence', intelligence_routes_1.default);
app.use('/api/buyers', buyer_routes_1.default);
app.use('/api/offers', offer_routes_1.default);
app.use('/api/logistics', logistics_routes_1.default);
app.use('/api/alerts', alert_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Error Handler Middleware
app.use(error_middleware_1.errorHandler);
exports.default = app;
