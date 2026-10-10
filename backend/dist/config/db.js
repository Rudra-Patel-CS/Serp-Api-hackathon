"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
// Load environment variables from backend/.env and root .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
dotenv_1.default.config();
let dbUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/krishiintel';
// Guard against legacy file:./dev.db sqlite URLs when Prisma schema requires MySQL
if (!dbUrl || dbUrl.startsWith('file:')) {
    dbUrl = 'mysql://root:password@localhost:3306/krishiintel';
}
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
