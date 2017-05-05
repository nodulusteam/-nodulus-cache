"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require('util');
const fs = require('fs');
const path = require('path');
const dal = require('@nodulus/data');
class Singleton {
    _setSingleton() {
        if (this._initialized)
            throw Error('Singleton is already initialized.');
        this._initialized = true;
    }
}
exports.Singleton = Singleton;
class Cache extends Singleton {
    static getInstance() {
        if (!this._instance)
            this._instance = new Cache();
        return this._instance;
    }
    static clone(value) {
        return JSON.parse(JSON.stringify(value));
    }
    static get(collectioName, itemKey, asObject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (itemKey) === 'string') {
                if (this.cache[collectioName] && this.cache[collectioName][itemKey]) {
                    return this.clone(this.cache[collectioName][itemKey]);
                }
                else {
                    let result = yield dal.getSingle(collectioName, itemKey);
                    if (result) {
                        if (!this.cache[collectioName])
                            this.cache[collectioName] = {};
                        this.cache[collectioName][itemKey] = result;
                        return this.clone(this.cache[collectioName][itemKey]);
                    }
                }
            }
            else {
                var arr_for_request = [];
                var resultArr = {};
                var tabIds = itemKey;
                tabIds.forEach((tab_id) => {
                    if (!this.cache[collectioName] || !this.cache[collectioName][tab_id] && tab_id !== null) {
                        arr_for_request.push(tab_id);
                    }
                    else
                        resultArr[tab_id] = this.cache[collectioName][tab_id];
                });
                if (arr_for_request.length === 0) {
                    if (asObject) {
                        return resultArr;
                    }
                    else {
                        var asArr1 = [];
                        for (var cname in resultArr) {
                            asArr1.push(resultArr[cname]);
                        }
                        return this.clone(asArr1);
                    }
                }
                else {
                    let result = yield dal.getSet(arr_for_request, collectioName, (result) => {
                        if (result !== null) {
                            result.forEach((cacheItem) => {
                                if (!this.cache[collectioName])
                                    this.cache[collectioName] = {};
                                this.cache[collectioName][cacheItem._id] = cacheItem;
                                resultArr[cacheItem._id] = cacheItem;
                            });
                            if (asObject) {
                                return this.clone(resultArr);
                            }
                            else {
                                var asArr = [];
                                for (var cname in resultArr) {
                                    asArr.push(resultArr[cname]);
                                }
                                return this.clone(asArr);
                            }
                        }
                    });
                }
            }
        });
    }
    static getCollection(collectioName, asObject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache[collectioName]) {
                if (asObject) {
                    var obj = {};
                    this.cache[collectioName].forEach((item) => {
                        obj[item._id] = item;
                    });
                    return obj;
                }
                else
                    return this.clone(this.cache[collectioName]);
            }
            else {
                let result = yield dal.getCollection(collectioName);
                if (result !== null) {
                    this.cache[collectioName] = result;
                    if (asObject) {
                        var obj = {};
                        this.cache[collectioName].forEach((item) => {
                            obj[item._id] = item;
                        });
                        return this.clone(obj);
                    }
                    else
                        return this.clone(this.cache[collectioName]);
                }
            }
        });
    }
    static expire(collectioName, itemKey) {
        if (itemKey.toString)
            itemKey = itemKey.toString();
        if (this.cache[collectioName] && this.cache[collectioName][itemKey])
            delete this.cache[collectioName][itemKey];
    }
}
Cache.cache = {};
exports.Cache = Cache;
//# sourceMappingURL=index.js.map