"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serpapiConfig = void 0;
const config_1 = require("../../config");
exports.serpapiConfig = {
    apiKey: process.env.SERPAPI_KEY || config_1.config.serpapiKey || '',
    enabled: process.env.SERPAPI_ENABLED ? process.env.SERPAPI_ENABLED === 'true' : true,
    timeoutMs: parseInt(process.env.SERPAPI_TIMEOUT_MS || '10000', 10),
    cacheTtlSeconds: parseInt(process.env.SERPAPI_CACHE_TTL_SECONDS || '1800', 10), // 30 mins
    maxRetries: 2,
    retryDelayMs: 1000,
    baseUrl: 'https://serpapi.com/search.json',
    locationDefault: 'Gujarat, India',
    countryDefault: 'in',
    languageDefault: 'en',
};
