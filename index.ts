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

    public get(collectioName: string, itemKey: any, callback: Function, asObject: boolean) {
        //single item request
        if (typeof (itemKey) === 'string') {
            if (this.cache[collectioName] && this.cache[collectioName][itemKey]) {
                callback(this.cache[collectioName][itemKey]);
                return;
            }
            else {
                dal.getSingle(collectioName, itemKey, (result: any) => {
                    if (result !== null) {
                        if (!this.cache[collectioName])
                            this.cache[collectioName] = {};
                        this.cache[collectioName][itemKey] = result;

                        callback(JSON.parse(JSON.stringify(this.cache[collectioName][itemKey])));
                        return;
                    }
                });
            }
        }
        else {
            //array item request
            var arr_for_request: any = [];
            var resultArr: any = {};

            var tabIds = itemKey as string[];
            tabIds.forEach((tab_id: string) => {
                if (!this.cache[collectioName] || !this.cache[collectioName][tab_id] && tab_id !== null) {
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
                    callback(JSON.parse(JSON.stringify(asArr1)));
                    return;
                }




            }
            else {
                dal.getSet(arr_for_request, collectioName, (result: any) => {
                    if (result !== null) {
                        result.forEach((cacheItem: any) => {
                            if (!this.cache[collectioName])
                                this.cache[collectioName] = {};

                            this.cache[collectioName][cacheItem._id] = cacheItem;
                            resultArr[cacheItem._id] = cacheItem;
                        });


                        if (asObject) {
                            callback(JSON.parse(JSON.stringify(resultArr)));
                            return;
                        }
                        else {
                            var asArr: any = [];
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
                callback(JSON.parse(JSON.stringify(this.cache[collectioName])));
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
                        callback(JSON.parse(JSON.stringify(obj)));
                    }
                    else
                        callback(JSON.parse(JSON.stringify(this.cache[collectioName])));
                    return;
                }

            });
        }




    }




    public expire(collectioName: string, itemKey: string) {
        if (itemKey.toString)
            itemKey = itemKey.toString();

        if (this.cache[collectioName] && this.cache[collectioName][itemKey])
            delete this.cache[collectioName][itemKey];
    }
}
exports = module.exports = cache.getInstance();
