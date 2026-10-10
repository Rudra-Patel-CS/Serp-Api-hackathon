"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
dotenv_1.default.config();
exports.config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
    databaseUrl: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/krishiintel',
    jwtSecret: process.env.JWT_SECRET || 'krishiintel_jwt_secret_key_development_only',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    serpapiKey: process.env.SERPAPI_KEY || '',
};
