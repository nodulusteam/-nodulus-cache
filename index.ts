/// <reference path="./typings/main.d.ts" />
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("@nodulus/data");



class Singleton {
    private _initialized: boolean;

    private _setSingleton(): void {
        if (this._initialized) throw Error('Singleton is already initialized.');
        this._initialized = true;
    }

    //get setSingleton() { return this._setSingleton; }
}



class cache extends Singleton {
    private cache: any = {}
    private static _instance: cache = new cache();
    public static getInstance(): cache {
        return cache._instance;
    }

    public get(collectioName: string, tabId: any, callback: Function, asObject: boolean) {
        //single item request
        if (typeof (tabId) === 'string') {
            if (this.cache[collectioName] && this.cache[collectioName][tabId]) {
                callback(this.cache[collectioName][tabId]);
                return;
            }
            else {
                dal.getSingle(collectioName, tabId, (result: any) => {
                    if (result !== null) {
                        this.cache[collectioName][tabId] = result;
                        callback(this.cache[collectioName][tabId]);
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
                if (!this.cache[collectioName][tab_id] && tab_id !== null) {
                    arr_for_request.push(tab_id);
                }
                else
                    resultArr[tab_id] = this.cache[collectioName][tab_id];
            });


            if (arr_for_request.length === 0) {


                if (asObject) {
                    callback(resultArr);
                    return;
                }
                else {
                    var asArr1: any = [];
                    for (var cname in resultArr) {
                        asArr1.push(resultArr[cname]);
                    }
                    callback(asArr1);
                    return;
                }




            }
            else {
                dal.getSet(arr_for_request, collectioName, (result: any) => {
                    if (result !== null) {
                        result.forEach((cacheItem: any) => {
                            this.cache[collectioName][cacheItem._id] = cacheItem;
                            resultArr[cacheItem._id] = cacheItem;
                        });


                        if (asObject) {
                            callback(resultArr);
                            return;
                        }
                        else {
                            var asArr: any = [];
                            for (var cname in resultArr) {
                                asArr.push(resultArr[cname]);
                            }
                            callback(asArr);
                            return;
                        }
                    }
                });
            }
        }
    }




    public getCollection(collectioName: string, asObject: boolean, callback: Function) {



        if (this.cache[collectioName]) {
            if (asObject) {
                var obj: any = {};
                this.cache[collectioName].forEach((item: any) => {
                    obj[item._id] = item;

                });
                callback(obj);
            }
            else
                callback(this.cache[collectioName]);
            return;
        }
        else {
            dal.getCollection(collectioName, (result: any) => {
                if (result !== null) {
                    this.cache[collectioName] = result;


                    if (asObject) {
                        var obj: any = {};
                        this.cache[collectioName].forEach((item: any) => {
                            obj[item._id] = item;

                        });
                        callback(obj);
                    }
                    else
                        callback(this.cache[collectioName]);
                    return;
                }

            });
        }




    }


}

exports.cache = cache.getInstance();