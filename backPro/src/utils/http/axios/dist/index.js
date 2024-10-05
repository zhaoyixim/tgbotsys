"use strict";
exports.__esModule = true;
exports.http = void 0;
// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
var Axios_1 = require("./Axios");
var axios_1 = require("axios");
var checkStatus_1 = require("./checkStatus");
var helper_1 = require("./helper");
var httpEnum_1 = require("@/enums/httpEnum");
var pageEnum_1 = require("@/enums/pageEnum");
var setting_1 = require("@/hooks/setting");
var is_1 = require("@/utils/is/");
var utils_1 = require("@/utils");
var urlUtils_1 = require("@/utils/urlUtils");
var user_1 = require("@/store/modules/user");
var globSetting = setting_1.useGlobSetting();
var urlPrefix = globSetting.urlPrefix || '';
var router_1 = require("@/router");
var Storage_1 = require("@/utils/Storage");
/**
 * @description: 数据处理，方便区分多种处理方式
 */
var transform = {
    /**
     * @description: 处理请求数据
     */
    transformRequestData: function (res, options) {
        var _a;
        var _b = options.isShowMessage, isShowMessage = _b === void 0 ? true : _b, isShowErrorMessage = options.isShowErrorMessage, isShowSuccessMessage = options.isShowSuccessMessage, successMessageText = options.successMessageText, errorMessageText = options.errorMessageText, isTransformResponse = options.isTransformResponse, isReturnNativeResponse = options.isReturnNativeResponse;
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
            return res;
        }
        // 不进行任何处理，直接返回
        // 用于页面代码可能需要直接获取code，data，message这些信息时开启
        if (!isTransformResponse) {
            return res.data;
        }
        var data = res.data;
        var $dialog = window['$dialog'];
        var $message = window['$message'];
        if (!data) {
            // return '[HTTP] Request has no return value';
            throw new Error('请求出错，请稍候重试');
        }
        //  这里 code，result，message为 后台统一的字段，需要修改为项目自己的接口返回格式
        var code = data.code, result = data.result, message = data.message;
        // 请求成功
        var hasSuccess = data && Reflect.has(data, 'code') && code === httpEnum_1.ResultEnum.SUCCESS;
        // 是否显示提示信息
        if (isShowMessage) {
            if (hasSuccess && (successMessageText || isShowSuccessMessage)) {
                // 是否显示自定义信息提示
                $dialog.success({
                    type: 'success',
                    content: successMessageText || message || '操作成功！'
                });
            }
            else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) {
                // 是否显示自定义信息提示
                $message.error(message || errorMessageText || '操作失败！');
            }
            else if (!hasSuccess && options.errorMessageMode === 'modal') {
                // errorMessageMode=‘custom-modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
                $dialog.info({
                    title: '提示',
                    content: message,
                    positiveText: '确定',
                    onPositiveClick: function () { }
                });
            }
        }
        // 接口请求成功，直接返回结果
        if (code === httpEnum_1.ResultEnum.SUCCESS) {
            return result;
        }
        // 接口请求错误，统一提示错误信息 这里逻辑可以根据项目进行修改
        var errorMsg = message;
        switch (code) {
            // 请求失败
            case httpEnum_1.ResultEnum.ERROR:
                $message.error(errorMsg);
                break;
            // 登录超时
            case httpEnum_1.ResultEnum.TIMEOUT:
                var LoginName = pageEnum_1.PageEnum.BASE_LOGIN_NAME;
                var LoginPath_1 = pageEnum_1.PageEnum.BASE_LOGIN;
                if (((_a = router_1["default"].currentRoute.value) === null || _a === void 0 ? void 0 : _a.name) === LoginName)
                    return;
                // 到登录页
                errorMsg = '登录超时，请重新登录!';
                $dialog.warning({
                    title: '提示',
                    content: '登录身份已失效，请重新登录!',
                    positiveText: '确定',
                    //negativeText: '取消',
                    closable: false,
                    maskClosable: false,
                    onPositiveClick: function () {
                        Storage_1.storage.clear();
                        window.location.href = LoginPath_1;
                    },
                    onNegativeClick: function () { }
                });
                break;
        }
        throw new Error(errorMsg);
    },
    // 请求之前处理config
    beforeRequestHook: function (config, options) {
        var _a;
        var apiUrl = options.apiUrl, joinPrefix = options.joinPrefix, joinParamsToUrl = options.joinParamsToUrl, formatDate = options.formatDate, _b = options.joinTime, joinTime = _b === void 0 ? true : _b, urlPrefix = options.urlPrefix;
        var isUrlStr = utils_1.isUrl(config.url);
        if (!isUrlStr && joinPrefix) {
            config.url = "" + urlPrefix + config.url;
        }
        if (!isUrlStr && apiUrl && is_1.isString(apiUrl)) {
            config.url = "" + apiUrl + config.url;
        }
        var params = config.params || {};
        var data = config.data || false;
        if (((_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === httpEnum_1.RequestEnum.GET) {
            if (!is_1.isString(params)) {
                // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                config.params = Object.assign(params || {}, helper_1.joinTimestamp(joinTime, false));
            }
            else {
                // 兼容restful风格
                config.url = config.url + params + ("" + helper_1.joinTimestamp(joinTime, true));
                config.params = undefined;
            }
        }
        else {
            if (!is_1.isString(params)) {
                formatDate && helper_1.formatRequestDate(params);
                if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
                    config.data = data;
                    config.params = params;
                }
                else {
                    config.data = params;
                    config.params = undefined;
                }
                if (joinParamsToUrl) {
                    config.url = urlUtils_1.setObjToUrlParams(config.url, Object.assign({}, config.params, config.data));
                }
            }
            else {
                // 兼容restful风格
                config.url = config.url + params;
                config.params = undefined;
            }
        }
        return config;
    },
    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: function (config, options) {
        var _a, _b;
        // 请求之前处理config
        var userStore = user_1.useUserStoreWidthOut();
        var token = userStore.getToken;
        if (token && ((_b = (_a = config) === null || _a === void 0 ? void 0 : _a.requestOptions) === null || _b === void 0 ? void 0 : _b.withToken) !== false) {
            // jwt token
            config.headers.Authorization = options.authenticationScheme
                ? options.authenticationScheme + " " + token
                : token;
            console.log('222', options.authenticationScheme);
            console.log('111', config);
        }
        return config;
    },
    /**
     * @description: 响应错误处理
     */
    responseInterceptorsCatch: function (error) {
        var $dialog = window['$dialog'];
        var $message = window['$message'];
        var _a = error || {}, response = _a.response, code = _a.code, message = _a.message;
        // TODO 此处要根据后端接口返回格式修改
        var msg = response && response.data && response.data.message ? response.data.message : '';
        var err = error.toString();
        try {
            if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
                $message.error('接口请求超时，请刷新页面重试!');
                return;
            }
            if (err && err.includes('Network Error')) {
                $dialog.info({
                    title: '网络异常',
                    content: '请检查您的网络连接是否正常',
                    positiveText: '确定',
                    //negativeText: '取消',
                    closable: false,
                    maskClosable: false,
                    onPositiveClick: function () { },
                    onNegativeClick: function () { }
                });
                return Promise.reject(error);
            }
        }
        catch (error) {
            throw new Error(error);
        }
        // 请求是否被取消
        var isCancel = axios_1["default"].isCancel(error);
        if (!isCancel) {
            checkStatus_1.checkStatus(error.response && error.response.status, msg);
        }
        else {
            console.warn(error, '请求被取消！');
        }
        //return Promise.reject(error);
        return Promise.reject(response === null || response === void 0 ? void 0 : response.data);
    }
};
function createAxios(opt) {
    return new Axios_1.VAxios(utils_1.deepMerge({
        timeout: 10 * 1000,
        authenticationScheme: 'Bearer',
        // 接口前缀
        prefixUrl: urlPrefix,
        headers: { 'Content-Type': httpEnum_1.ContentTypeEnum.JSON },
        // 数据处理方式
        transform: transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
            // 默认将prefix 添加到url
            joinPrefix: true,
            // 是否返回原生响应头 比如：需要获取响应头时使用该属性
            isReturnNativeResponse: false,
            // 需要对返回数据进行处理
            isTransformResponse: true,
            // post请求的时候添加参数到url
            joinParamsToUrl: false,
            // 格式化提交参数时间
            formatDate: true,
            // 消息提示类型
            errorMessageMode: 'none',
            // 接口地址
            apiUrl: globSetting.apiUrl,
            // 接口拼接地址
            urlPrefix: urlPrefix,
            //  是否加入时间戳
            joinTime: true,
            // 忽略重复请求
            ignoreCancelToken: true,
            // 是否携带token
            withToken: true
        },
        withCredentials: false
    }, opt || {}));
}
exports.http = createAxios();
// 项目，多个不同 api 地址，直接在这里导出多个
// src/api ts 里面接口，就可以单独使用这个请求，
// import { httpTwo } from '@/utils/http/axios'
// export const httpTwo = createAxios({
//   requestOptions: {
//     apiUrl: 'http://localhost:9001',
//     urlPrefix: 'api',
//   },
// });
