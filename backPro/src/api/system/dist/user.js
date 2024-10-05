"use strict";
exports.__esModule = true;
exports.logout = exports.changePassword = exports.login = exports.getUserInfo = void 0;
var axios_1 = require("@/utils/http/axios");
/**
 * @description: 获取用户信息
 */
function getUserInfo() {
    return axios_1.http.request({
        url: '/user/admininfo',
        method: 'get'
    });
}
exports.getUserInfo = getUserInfo;
/**
 * @description: 用户登录
 */
function login(params) {
    return axios_1.http.request({
        url: '/user/login',
        method: 'POST',
        params: params
    }, {
        isTransformResponse: false
    });
}
exports.login = login;
/**
 * @description: 用户修改密码
 */
function changePassword(params, uid) {
    return axios_1.http.request({
        url: "/user/u" + uid + "/changepw",
        method: 'POST',
        params: params
    }, {
        isTransformResponse: false
    });
}
exports.changePassword = changePassword;
/**
 * @description: 用户登出
 */
function logout(params) {
    return axios_1.http.request({
        url: '/login/logout',
        method: 'POST',
        params: params
    });
}
exports.logout = logout;
