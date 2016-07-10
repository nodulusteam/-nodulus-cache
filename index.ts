/// <reference path="./typings/main.d.ts" />
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("@nodulus/data");


export class Cache {
    private cache: any = {}

    public get(collectioName: string, tabId: any, callback: Function, asObject: boolean) {
        //single item request
        if (typeof (tabId) === 'string') {
            if (this.cache[tabId]) {
                callback(this.cache[tabId]);
                return;
            }
            else {
                dal.getSingle(collectioName, tabId, (result: any) => {
                    if (result !== null) {
                        this.cache[tabId] = result;

                        callback(this.cache[tabId]);
                        return;
                    }

                });
            }

        }
        else {
            //array item request
            var arr_for_request: any = [];
            var resultArr: any = {};

            var tabIds = tabId as string[];
            tabIds.forEach((tab_id: string) => {
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
                dal.getSet(arr_for_request, collectioName, (result: any) => {
                    if (result !== null) {
                        result.forEach((cacheItem: any) => {
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
                            var asArr: any = [];
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
