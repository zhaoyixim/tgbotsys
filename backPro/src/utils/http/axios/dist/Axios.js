"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.VAxios = void 0;
var axios_1 = require("axios");
var axiosCancel_1 = require("./axiosCancel");
var is_1 = require("@/utils/is");
var lodash_es_1 = require("lodash-es");
var httpEnum_1 = require("@/enums/httpEnum");
__exportStar(require("./axiosTransform"), exports);
/**
 * @description:  axios模块
 */
var VAxios = /** @class */ (function () {
    function VAxios(options) {
        this.options = options;
        this.axiosInstance = axios_1["default"].create(options);
        this.setupInterceptors();
    }
    VAxios.prototype.getAxios = function () {
        return this.axiosInstance;
    };
    /**
     * @description: 重新配置axios
     */
    VAxios.prototype.configAxios = function (config) {
        if (!this.axiosInstance) {
            return;
        }
        this.createAxios(config);
    };
    /**
     * @description: 设置通用header
     */
    VAxios.prototype.setHeader = function (headers) {
        if (!this.axiosInstance) {
            return;
        }
        Object.assign(this.axiosInstance.defaults.headers, headers);
    };
    /**
     * @description:   请求方法
     */
    VAxios.prototype.request = function (config, options) {
        var _this = this;
        var conf = lodash_es_1.cloneDeep(config);
        var transform = this.getTransform();
        var requestOptions = this.options.requestOptions;
        var opt = Object.assign({}, requestOptions, options);
        var _a = transform || {}, beforeRequestHook = _a.beforeRequestHook, requestCatch = _a.requestCatch, transformRequestData = _a.transformRequestData;
        if (beforeRequestHook && is_1.isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt);
        }
        //这里重新 赋值成最新的配置
        // @ts-ignore
        conf.requestOptions = opt;
        return new Promise(function (resolve, reject) {
            _this.axiosInstance
                .request(conf)
                .then(function (res) {
                // 请求是否被取消
                var isCancel = axios_1["default"].isCancel(res);
                if (transformRequestData && is_1.isFunction(transformRequestData) && !isCancel) {
                    try {
                        var ret = transformRequestData(res, opt);
                        resolve(ret);
                    }
                    catch (err) {
                        reject(err || new Error('request error!'));
                    }
                    return;
                }
                resolve(res);
            })["catch"](function (e) {
                if (requestCatch && is_1.isFunction(requestCatch)) {
                    reject(requestCatch(e));
                    return;
                }
                reject(e);
            });
        });
    };
    /**
     * @description:  创建axios实例
     */
    VAxios.prototype.createAxios = function (config) {
        this.axiosInstance = axios_1["default"].create(config);
    };
    VAxios.prototype.getTransform = function () {
        var transform = this.options.transform;
        return transform;
    };
    /**
     * @description:  文件上传
     */
    VAxios.prototype.uploadFile = function (config, params) {
        var formData = new window.FormData();
        var customFilename = params.name || 'file';
        if (params.filename) {
            formData.append(customFilename, params.file, params.filename);
        }
        else {
            formData.append(customFilename, params.file);
        }
        if (params.data) {
            Object.keys(params.data).forEach(function (key) {
                var value = params.data[key];
                if (Array.isArray(value)) {
                    value.forEach(function (item) {
                        formData.append(key + "[]", item);
                    });
                    return;
                }
                formData.append(key, params.data[key]);
            });
        }
        return this.axiosInstance.request(__assign({ method: 'POST', data: formData, headers: {
                'Content-type': httpEnum_1.ContentTypeEnum.FORM_DATA,
                ignoreCancelToken: true
            } }, config));
    };
    /**
     * @description: 拦截器配置
     */
    VAxios.prototype.setupInterceptors = function () {
        var _this = this;
        var transform = this.getTransform();
        if (!transform) {
            return;
        }
        var requestInterceptors = transform.requestInterceptors, requestInterceptorsCatch = transform.requestInterceptorsCatch, responseInterceptors = transform.responseInterceptors, responseInterceptorsCatch = transform.responseInterceptorsCatch;
        var axiosCanceler = new axiosCancel_1.AxiosCanceler();
        // 请求拦截器配置处理
        this.axiosInstance.interceptors.request.use(function (config) {
            var _a;
            var ignoreCancelToken = config.headers.ignoreCancelToken;
            var ignoreCancel = ignoreCancelToken !== undefined
                ? ignoreCancelToken
                : (_a = _this.options.requestOptions) === null || _a === void 0 ? void 0 : _a.ignoreCancelToken;
            !ignoreCancel && axiosCanceler.addPending(config);
            if (requestInterceptors && is_1.isFunction(requestInterceptors)) {
                config = requestInterceptors(config, _this.options);
            }
            return config;
        }, undefined);
        // 请求拦截器错误捕获
        requestInterceptorsCatch &&
            is_1.isFunction(requestInterceptorsCatch) &&
            this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);
        // 响应结果拦截器处理
        this.axiosInstance.interceptors.response.use(function (res) {
            res && axiosCanceler.removePending(res.config);
            if (responseInterceptors && is_1.isFunction(responseInterceptors)) {
                res = responseInterceptors(res);
            }
            return res;
        }, undefined);
        // 响应结果拦截器错误捕获
        responseInterceptorsCatch &&
            is_1.isFunction(responseInterceptorsCatch) &&
            this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
    };
    return VAxios;
}());
exports.VAxios = VAxios;
