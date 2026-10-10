"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheKey = getCacheKey;
exports.getCachedResult = getCachedResult;
exports.setCachedResult = setCachedResult;
exports.clearCache = clearCache;
const serpapi_config_1 = require("./serpapi.config");
const memoryCache = new Map();
function getCacheKey(engine, query, location) {
    return `${engine}:${query.toLowerCase().trim()}:${(location || 'default').toLowerCase().trim()}`;
}
function getCachedResult(key) {
    const entry = memoryCache.get(key);
    if (!entry) {
        return { hit: false };
    }
    const now = Date.now();
    if (now > entry.expiresAt) {
        memoryCache.delete(key);
        return { hit: false, isExpired: true };
    }
    return { hit: true, data: entry.data };
}
function setCachedResult(key, data, ttlSeconds = serpapi_config_1.serpapiConfig.cacheTtlSeconds) {
    const now = Date.now();
    memoryCache.set(key, {
        data,
        cachedAt: now,
        expiresAt: now + ttlSeconds * 1000,
    });
}
function clearCache() {
    memoryCache.clear();
}
