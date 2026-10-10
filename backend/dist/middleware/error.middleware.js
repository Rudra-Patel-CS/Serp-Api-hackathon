"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const response_util_1 = require("../utils/response.util");
function errorHandler(err, req, res, next) {
    console.error('🔥 Server Error Exception:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    return (0, response_util_1.sendError)(res, message, statusCode, code, err.details);
}
