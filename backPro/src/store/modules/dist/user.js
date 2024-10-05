"use strict";
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
exports.useUserStoreWidthOut = exports.useUserStore = void 0;
var pinia_1 = require("pinia");
var store_1 = require("@/store");
var mutation_types_1 = require("@/store/mutation-types");
var httpEnum_1 = require("@/enums/httpEnum");
var user_1 = require("@/api/system/user");
var Storage_1 = require("@/utils/Storage");
exports.useUserStore = pinia_1.defineStore({
    id: 'app-user',
    state: function () { return ({
        token: Storage_1.storage.get(mutation_types_1.ACCESS_TOKEN, ''),
        username: '',
        welcome: '',
        avatar: '',
        permissions: [],
        info: Storage_1.storage.get(mutation_types_1.CURRENT_USER, {})
    }); },
    getters: {
        getToken: function () {
            return this.token;
        },
        getAvatar: function () {
            return this.avatar;
        },
        getNickname: function () {
            return this.username;
        },
        getPermissions: function () {
            return this.permissions;
        },
        getUserInfo: function () {
            return this.info;
        }
    },
    actions: {
        setToken: function (token) {
            this.token = token;
        },
        setAvatar: function (avatar) {
            this.avatar = avatar;
        },
        setPermissions: function (permissions) {
            this.permissions = permissions;
        },
        setUserInfo: function (info) {
            this.info = info;
        },
        // 登录
        login: function (userInfo) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result, code, ex, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, user_1.login(userInfo)];
                        case 1:
                            response = _a.sent();
                            result = response.result, code = response.code;
                            if (code === httpEnum_1.ResultEnum.SUCCESS) {
                                ex = 7 * 24 * 60 * 60;
                                Storage_1.storage.set(mutation_types_1.ACCESS_TOKEN, result.token, ex);
                                console.log('tioken', result.token);
                                Storage_1.storage.set(mutation_types_1.CURRENT_USER, result, ex);
                                Storage_1.storage.set(mutation_types_1.IS_LOCKSCREEN, false);
                                this.setToken(result.token);
                                this.setUserInfo(result);
                            }
                            return [2 /*return*/, Promise.resolve(response)];
                        case 2:
                            e_1 = _a.sent();
                            return [2 /*return*/, Promise.reject(e_1)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        // 获取用户信息
        GetInfo: function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                user_1.getUserInfo()
                    .then(function (res) {
                    var result = res;
                    if (result.permissions && result.permissions.length) {
                        var permissionsList = result.permissions;
                        that.setPermissions(permissionsList);
                        that.setUserInfo(result);
                    }
                    else {
                        reject(new Error('getInfo: permissionsList must be a non-null array !'));
                    }
                    that.setAvatar(result.avatar);
                    resolve(res);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        },
        // 登出
        logout: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.setPermissions([]);
                    this.setUserInfo('');
                    Storage_1.storage.remove(mutation_types_1.ACCESS_TOKEN);
                    Storage_1.storage.remove(mutation_types_1.CURRENT_USER);
                    return [2 /*return*/, Promise.resolve('')];
                });
            });
        }
    }
});
// Need to be used outside the setup
function useUserStoreWidthOut() {
    return exports.useUserStore(store_1.store);
}
exports.useUserStoreWidthOut = useUserStoreWidthOut;
