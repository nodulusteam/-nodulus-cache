"use strict";
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("@nodulus/data");
class Cache {
    constructor() {
        this.cache = {};
    }
    get(collectioName, tabId, callback, asObject) {
        if (typeof (tabId) === 'string') {
            if (this.cache[tabId]) {
                callback(this.cache[tabId]);
                return;
            }
            else {
                dal.getSingle(collectioName, tabId, (result) => {
                    if (result !== null) {
                        this.cache[tabId] = result;
                        callback(this.cache[tabId]);
                        return;
                    }
                });
            }
        }
        else {
            var arr_for_request = [];
            var resultArr = {};
            var tabIds = tabId;
            tabIds.forEach((tab_id) => {
                if (!this.cache[tab_id] && tab_id !== null) {
                    arr_for_request.push(tab_id);
                }
                else
                    resultArr[tab_id] = this.cache[tab_id];
            });
            if (arr_for_request.length === 0) {
                callback(resultArr);
                return;
            }
            else {
                dal.getSet(arr_for_request, collectioName, (result) => {
                    if (result !== null) {
                        result.forEach((cacheItem) => {
                            this.cache[cacheItem._id] = cacheItem;
                            resultArr[cacheItem._id] = cacheItem;
                        });
                        for (var cname in resultArr) {
                        }
                        if (asObject) {
                            callback(resultArr);
                            return;
                        }
                        else {
                            var asArr = [];
                            for (var cname in resultArr) {
                                asArr.push(resultArr);
                            }
                            callback(asArr);
                            return;
                        }
                    }
                });
            }
        }
    }
}
exports.Cache = Cache;
