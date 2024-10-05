"use strict";
exports.__esModule = true;
exports.isProdMode = exports.isDevMode = exports.getEnv = exports.prodMode = exports.devMode = exports.getAppEnvConfig = exports.getStorageShortName = exports.getCommonStoragePrefix = void 0;
var log_1 = require("@/utils/log");
var package_json_1 = require("../../package.json");
var getConfigFileName_1 = require("../../build/getConfigFileName");
function getCommonStoragePrefix() {
    var VITE_GLOB_APP_SHORT_NAME = getAppEnvConfig().VITE_GLOB_APP_SHORT_NAME;
    return (VITE_GLOB_APP_SHORT_NAME + "__" + getEnv()).toUpperCase();
}
exports.getCommonStoragePrefix = getCommonStoragePrefix;
// Generate cache key according to version
function getStorageShortName() {
    return ("" + getCommonStoragePrefix() + ("__" + package_json_1["default"].version) + "__").toUpperCase();
}
exports.getStorageShortName = getStorageShortName;
function getAppEnvConfig() {
    var ENV_NAME = getConfigFileName_1.getConfigFileName(import.meta.env);
    var ENV = (import.meta.env.DEV
        ? // Get the global configuration (the configuration will be extracted independently when packaging)
            import.meta.env
        : window[ENV_NAME]);
    var VITE_GLOB_APP_TITLE = ENV.VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL = ENV.VITE_GLOB_API_URL, VITE_GLOB_APP_SHORT_NAME = ENV.VITE_GLOB_APP_SHORT_NAME, VITE_GLOB_API_URL_PREFIX = ENV.VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL = ENV.VITE_GLOB_UPLOAD_URL, VITE_GLOB_PROD_MOCK = ENV.VITE_GLOB_PROD_MOCK, VITE_GLOB_IMG_URL = ENV.VITE_GLOB_IMG_URL;
    if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
        log_1.warn("VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.");
    }
    return {
        VITE_GLOB_APP_TITLE: VITE_GLOB_APP_TITLE,
        VITE_GLOB_API_URL: VITE_GLOB_API_URL,
        VITE_GLOB_APP_SHORT_NAME: VITE_GLOB_APP_SHORT_NAME,
        VITE_GLOB_API_URL_PREFIX: VITE_GLOB_API_URL_PREFIX,
        VITE_GLOB_UPLOAD_URL: VITE_GLOB_UPLOAD_URL,
        VITE_GLOB_PROD_MOCK: VITE_GLOB_PROD_MOCK,
        VITE_GLOB_IMG_URL: VITE_GLOB_IMG_URL
    };
}
exports.getAppEnvConfig = getAppEnvConfig;
/**
 * @description: Development model
 */
exports.devMode = 'development';
/**
 * @description: Production mode
 */
exports.prodMode = 'production';
/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
function getEnv() {
    return import.meta.env.MODE;
}
exports.getEnv = getEnv;
/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
function isDevMode() {
    return import.meta.env.DEV;
}
exports.isDevMode = isDevMode;
/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
function isProdMode() {
    return import.meta.env.PROD;
}
exports.isProdMode = isProdMode;
