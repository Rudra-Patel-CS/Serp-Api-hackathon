"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const socket_server_1 = require("./realtime/socket.server");
const server = http_1.default.createServer(app_1.default);
(0, socket_server_1.initSocketServer)(server);
server.listen(config_1.config.port, () => {
    console.log(`🚀 KrishiIntel Backend Server running on port ${config_1.config.port}`);
    console.log(`🌐 API Endpoint: ${config_1.config.backendUrl}/api`);
    console.log(`📡 Socket.IO Listening for Real-Time Connections`);
});
