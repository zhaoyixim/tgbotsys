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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createRouterGuards = void 0;
var vue_router_1 = require("vue-router");
var user_1 = require("@/store/modules/user");
var asyncRoute_1 = require("@/store/modules/asyncRoute");
var mutation_types_1 = require("@/store/mutation-types");
var Storage_1 = require("@/utils/Storage");
var pageEnum_1 = require("@/enums/pageEnum");
var base_1 = require("@/router/base");
var LOGIN_PATH = pageEnum_1.PageEnum.BASE_LOGIN;
var whitePathList = [LOGIN_PATH]; // no redirect whitelist
function createRouterGuards(router) {
    var _this = this;
    var userStore = user_1.useUserStoreWidthOut();
    var asyncRouteStore = asyncRoute_1.useAsyncRouteStoreWidthOut();
    router.beforeEach(function (to, from, next) { return __awaiter(_this, void 0, void 0, function () {
        var Loading, token, redirectData, userInfo, routes, isErrorPage, redirectPath, redirect, nextData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Loading = window['$loading'] || null;
                    Loading && Loading.start();
                    if (from.path === LOGIN_PATH && to.name === 'errorPage') {
                        next(pageEnum_1.PageEnum.BASE_HOME);
                        return [2 /*return*/];
                    }
                    // Whitelist can be directly entered
                    if (whitePathList.includes(to.path)) {
                        next();
                        return [2 /*return*/];
                    }
                    token = Storage_1.storage.get(mutation_types_1.ACCESS_TOKEN);
                    if (!token) {
                        // You can access without permissions. You need to set the routing meta.ignoreAuth to true
                        if (to.meta.ignoreAuth) {
                            next();
                            return [2 /*return*/];
                        }
                        redirectData = {
                            path: LOGIN_PATH,
                            replace: true
                        };
                        if (to.path) {
                            redirectData.query = __assign(__assign({}, redirectData.query), { redirect: to.path });
                        }
                        next(redirectData);
                        return [2 /*return*/];
                    }
                    if (asyncRouteStore.getIsDynamicAddedRoute) {
                        next();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, userStore.GetInfo()];
                case 1:
                    userInfo = _a.sent();
                    return [4 /*yield*/, asyncRouteStore.generateRoutes(userInfo)];
                case 2:
                    routes = _a.sent();
                    // 动态添加可访问路由表
                    routes.forEach(function (item) {
                        router.addRoute(item);
                    });
                    isErrorPage = router.getRoutes().findIndex(function (item) { return item.name === base_1.ErrorPageRoute.name; });
                    if (isErrorPage === -1) {
                        router.addRoute(base_1.ErrorPageRoute);
                    }
                    redirectPath = (from.query.redirect || to.path);
                    redirect = decodeURIComponent(redirectPath);
                    nextData = to.path === redirect ? __assign(__assign({}, to), { replace: true }) : { path: redirect };
                    asyncRouteStore.setDynamicAddedRoute(true);
                    next(nextData);
                    Loading && Loading.finish();
                    return [2 /*return*/];
            }
        });
    }); });
    router.afterEach(function (to, _, failure) {
        var _a, _b, _c, _d;
        document.title = ((_a = to === null || to === void 0 ? void 0 : to.meta) === null || _a === void 0 ? void 0 : _a.title) || document.title;
        if (vue_router_1.isNavigationFailure(failure)) {
            //console.log('failed navigation', failure)
        }
        var asyncRouteStore = asyncRoute_1.useAsyncRouteStoreWidthOut();
        // 在这里设置需要缓存的组件名称
        var keepAliveComponents = asyncRouteStore.keepAliveComponents;
        var currentComName = (_b = to.matched.find(function (item) { return item.name == to.name; })) === null || _b === void 0 ? void 0 : _b.name;
        if (currentComName && !keepAliveComponents.includes(currentComName) && ((_c = to.meta) === null || _c === void 0 ? void 0 : _c.keepAlive)) {
            // 需要缓存的组件
            keepAliveComponents.push(currentComName);
        }
        else if (!((_d = to.meta) === null || _d === void 0 ? void 0 : _d.keepAlive) || to.name == 'Redirect') {
            // 不需要缓存的组件
            var index = asyncRouteStore.keepAliveComponents.findIndex(function (name) { return name == currentComName; });
            if (index != -1) {
                keepAliveComponents.splice(index, 1);
            }
        }
        asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
        var Loading = window['$loading'] || null;
        Loading && Loading.finish();
    });
    router.onError(function (error) {
        console.log(error, '路由错误');
    });
}
exports.createRouterGuards = createRouterGuards;
