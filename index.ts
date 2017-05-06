const util = require('util');
const fs = require('fs');
const path = require('path');
const dal = require('@nodulus/data');



export class Singleton {
    private _initialized: boolean;

    private _setSingleton(): void {
        if (this._initialized) throw Error('Singleton is already initialized.');
        this._initialized = true;
    }

    //get setSingleton() { return this._setSingleton; }
}
export class Cache extends Singleton {
    private static cache: any = {}
    public static _instance: Cache;
    public static getInstance(): Cache {
        if (!this._instance)
            this._instance = new Cache();

        return this._instance;
    }
    public static clone(value: any) {
        return JSON.parse(JSON.stringify(value));

    }
    public static async get(collectioName: string, itemKey: any, asObject: boolean) {
        //single item request
        if (typeof (itemKey) === 'string') {
            if (this.cache[collectioName] && this.cache[collectioName][itemKey]) {
                return this.clone(this.cache[collectioName][itemKey]);

            }
            else {
                let result = await dal.getSingle(collectioName, itemKey);
                if (result) {
                    if (!this.cache[collectioName])
                        this.cache[collectioName] = {};
                    this.cache[collectioName][itemKey] = result;
                    return this.clone(this.cache[collectioName][itemKey]);
                }
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
                    return resultArr;

                }
                else {
                    var asArr1: any = [];
                    for (var cname in resultArr) {
                        asArr1.push(resultArr[cname]);
                    }
                    return this.clone(asArr1);

                }




            }
            else {
                let result = await dal.getSet(arr_for_request, collectioName);

                if (result) {
                    result.forEach((cacheItem: any) => {
                        if (!this.cache[collectioName])
                            this.cache[collectioName] = {};

                        this.cache[collectioName][cacheItem._id] = cacheItem;
                        resultArr[cacheItem._id] = cacheItem;
                    });


                    if (asObject) {
                        return this.clone(resultArr);

                    }
                    else {
                        var asArr: any = [];
                        for (var cname in resultArr) {
                            asArr.push(resultArr[cname]);
                        }
                        return this.clone(asArr);

                    }
                }

            }
        }
    }




    public static async getCollection(collectioName: string, asObject: boolean) {
        if (this.cache[collectioName]) {
            if (asObject) {
                var obj: any = {};
                this.cache[collectioName].forEach((item: any) => {
                    obj[item._id] = item;

                });
                return obj;
            }
            else
                return this.clone(this.cache[collectioName]);

        }
        else {
            let result = await dal.getCollection(collectioName);
            if (result !== null) {
                this.cache[collectioName] = result;
                if (asObject) {
                    var obj: any = {};
                    this.cache[collectioName].forEach((item: any) => {
                        obj[item._id] = item;

                    });
                    return this.clone(obj);
                }
                else
                    return this.clone(this.cache[collectioName]);
            }
        }
    }


    public static expire(collectioName: string, itemKey: string) {
        if (itemKey.toString)
            itemKey = itemKey.toString();

        if (this.cache[collectioName] && this.cache[collectioName][itemKey])
            delete this.cache[collectioName][itemKey];
    }
}