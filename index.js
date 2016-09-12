var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./typings/main.d.ts" />
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("@nodulus/data");
var Singleton = (function () {
    function Singleton() {
    }
    Singleton.prototype._setSingleton = function () {
        if (this._initialized)
            throw Error('Singleton is already initialized.');
        this._initialized = true;
    };
    return Singleton;
}());
var cache = (function (_super) {
    __extends(cache, _super);
    function cache() {
        _super.apply(this, arguments);
        this.cache = {};
    }
    cache.getInstance = function () {
        return cache._instance;
    };
    cache.prototype.get = function (collectioName, itemKey, callback, asObject) {
        var _this = this;
        //single item request
        if (typeof (itemKey) === 'string') {
            if (this.cache[collectioName] && this.cache[collectioName][itemKey]) {
                callback(this.cache[collectioName][itemKey]);
                return;
            }
            else {
                dal.getSingle(collectioName, itemKey, function (result) {
                    if (result !== null) {
                        if (!_this.cache[collectioName])
                            _this.cache[collectioName] = {};
                        _this.cache[collectioName][itemKey] = result;
                        callback(JSON.parse(JSON.stringify(_this.cache[collectioName][itemKey])));
                        return;
                    }
                });
            }
        }
        else {
            //array item request
            var arr_for_request = [];
            var resultArr = {};
            var tabIds = itemKey;
            tabIds.forEach(function (tab_id) {
                if (!_this.cache[collectioName] || !_this.cache[collectioName][tab_id] && tab_id !== null) {
                    arr_for_request.push(tab_id);
                }
                else
                    resultArr[tab_id] = _this.cache[collectioName][tab_id];
            });
            if (arr_for_request.length === 0) {
                if (asObject) {
                    callback(resultArr);
                    return;
                }
                else {
                    var asArr1 = [];
                    for (var cname in resultArr) {
                        asArr1.push(resultArr[cname]);
                    }
                    callback(JSON.parse(JSON.stringify(asArr1)));
                    return;
                }
            }
            else {
                dal.getSet(arr_for_request, collectioName, function (result) {
                    if (result !== null) {
                        result.forEach(function (cacheItem) {
                            if (!_this.cache[collectioName])
                                _this.cache[collectioName] = {};
                            _this.cache[collectioName][cacheItem._id] = cacheItem;
                            resultArr[cacheItem._id] = cacheItem;
                        });
                        if (asObject) {
                            callback(JSON.parse(JSON.stringify(resultArr)));
                            return;
                        }
                        else {
                            var asArr = [];
                            for (var cname in resultArr) {
                                asArr.push(resultArr[cname]);
                            }
                            callback(JSON.parse(JSON.stringify(asArr)));
                            return;
                        }
                    }
                });
            }
        }
    };
    cache.prototype.getCollection = function (collectioName, asObject, callback) {
        var _this = this;
        if (this.cache[collectioName]) {
            if (asObject) {
                var obj = {};
                this.cache[collectioName].forEach(function (item) {
                    obj[item._id] = item;
                });
                callback(obj);
            }
            else
                callback(JSON.parse(JSON.stringify(this.cache[collectioName])));
            return;
        }
        else {
            dal.getCollection(collectioName, function (result) {
                if (result !== null) {
                    _this.cache[collectioName] = result;
                    if (asObject) {
                        var obj = {};
                        _this.cache[collectioName].forEach(function (item) {
                            obj[item._id] = item;
                        });
                        callback(JSON.parse(JSON.stringify(obj)));
                    }
                    else
                        callback(JSON.parse(JSON.stringify(_this.cache[collectioName])));
                    return;
                }
            });
        }
    };
    cache.prototype.expire = function (collectioName, itemKey) {
        if (itemKey.toString)
            itemKey = itemKey.toString();
        if (this.cache[collectioName] && this.cache[collectioName][itemKey])
            delete this.cache[collectioName][itemKey];
    };
    cache._instance = new cache();
    return cache;
}(Singleton));
exports = module.exports = cache.getInstance();
