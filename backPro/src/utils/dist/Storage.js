"use strict";
exports.__esModule = true;
exports.storage = exports.createStorage = void 0;
// 默认缓存期限为7天
var DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;
/**
 * 创建本地缓存对象
 * @param {string=} prefixKey -
 * @param {Object} [storage=localStorage] - sessionStorage | localStorage
 */
exports.createStorage = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.prefixKey, prefixKey = _c === void 0 ? '' : _c, _d = _b.storage, storage = _d === void 0 ? localStorage : _d;
    /**
     * 本地缓存类
     * @class Storage
     */
    var Storage = /** @class */ (function () {
        function class_1() {
            this.storage = storage;
            this.prefixKey = prefixKey;
        }
        class_1.prototype.getKey = function (key) {
            return ("" + this.prefixKey + key).toUpperCase();
        };
        /**
         * @description 设置缓存
         * @param {string} key 缓存键
         * @param {*} value 缓存值
         * @param expire
         */
        class_1.prototype.set = function (key, value, expire) {
            if (expire === void 0) { expire = DEFAULT_CACHE_TIME; }
            var stringData = JSON.stringify({
                value: value,
                expire: expire !== null ? new Date().getTime() + expire * 1000 : null
            });
            this.storage.setItem(this.getKey(key), stringData);
        };
        /**
         * 读取缓存
         * @param {string} key 缓存键
         * @param {*=} def 默认值
         */
        class_1.prototype.get = function (key, def) {
            if (def === void 0) { def = null; }
            var item = this.storage.getItem(this.getKey(key));
            if (item) {
                try {
                    var data = JSON.parse(item);
                    var value = data.value, expire = data.expire;
                    // 在有效期内直接返回
                    if (expire === null || expire >= Date.now()) {
                        return value;
                    }
                    this.remove(key);
                }
                catch (e) {
                    return def;
                }
            }
            return def;
        };
        /**
         * 从缓存删除某项
         * @param {string} key
         */
        class_1.prototype.remove = function (key) {
            this.storage.removeItem(this.getKey(key));
        };
        /**
         * 清空所有缓存
         * @memberOf Cache
         */
        class_1.prototype.clear = function () {
            this.storage.clear();
        };
        /**
         * 设置cookie
         * @param {string} name cookie 名称
         * @param {*} value cookie 值
         * @param {number=} expire 过期时间
         * 如果过期时间未设置，默认关闭浏览器自动删除
         * @example
         */
        class_1.prototype.setCookie = function (name, value, expire) {
            if (expire === void 0) { expire = DEFAULT_CACHE_TIME; }
            document.cookie = this.getKey(name) + "=" + value + "; Max-Age=" + expire;
        };
        /**
         * 根据名字获取cookie值
         * @param name
         */
        class_1.prototype.getCookie = function (name) {
            var cookieArr = document.cookie.split('; ');
            for (var i = 0, length = cookieArr.length; i < length; i++) {
                var kv = cookieArr[i].split('=');
                if (kv[0] === this.getKey(name)) {
                    return kv[1];
                }
            }
            return '';
        };
        /**
         * 根据名字删除指定的cookie
         * @param {string} key
         */
        class_1.prototype.removeCookie = function (key) {
            this.setCookie(key, 1, -1);
        };
        /**
         * 清空cookie，使所有cookie失效
         */
        class_1.prototype.clearCookie = function () {
            var keys = document.cookie.match(/[^ =;]+(?==)/g);
            if (keys) {
                for (var i = keys.length; i--;) {
                    document.cookie = keys[i] + '=0;expire=' + new Date(0).toUTCString();
                }
            }
        };
        return class_1;
    }());
    return new Storage();
};
exports.storage = exports.createStorage();
exports["default"] = Storage;
