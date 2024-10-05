"use strict";
exports.__esModule = true;
exports.useGlobSetting = void 0;
var log_1 = require("@/utils/log");
var env_1 = require("@/utils/env");
exports.useGlobSetting = function () {
    var _a = env_1.getAppEnvConfig(), VITE_GLOB_APP_TITLE = _a.VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL = _a.VITE_GLOB_API_URL, VITE_GLOB_APP_SHORT_NAME = _a.VITE_GLOB_APP_SHORT_NAME, VITE_GLOB_API_URL_PREFIX = _a.VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL = _a.VITE_GLOB_UPLOAD_URL, VITE_GLOB_PROD_MOCK = _a.VITE_GLOB_PROD_MOCK, VITE_GLOB_IMG_URL = _a.VITE_GLOB_IMG_URL;
    if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
        log_1.warn("VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.");
    }
    // Take global configuration
    var glob = {
        title: VITE_GLOB_APP_TITLE,
        apiUrl: VITE_GLOB_API_URL,
        shortName: VITE_GLOB_APP_SHORT_NAME,
        urlPrefix: VITE_GLOB_API_URL_PREFIX,
        uploadUrl: VITE_GLOB_UPLOAD_URL,
        prodMock: VITE_GLOB_PROD_MOCK,
        imgUrl: VITE_GLOB_IMG_URL
    };
    return glob;
};
