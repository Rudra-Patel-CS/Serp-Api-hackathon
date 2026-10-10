"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const response_util_1 = require("../utils/response.util");
function authenticate(req, res, next) {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            return (0, response_util_1.sendError)(res, 'Authentication token required', 401, 'UNAUTHORIZED');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return (0, response_util_1.sendError)(res, 'Invalid or expired authentication token', 401, 'UNAUTHORIZED');
    }
}
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_util_1.sendError)(res, 'Authentication required', 401, 'UNAUTHORIZED');
        }
        if (!allowedRoles.includes(req.user.role)) {
            return (0, response_util_1.sendError)(res, `Access denied. Required role: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`, 403, 'FORBIDDEN');
        }
        next();
    };
}
