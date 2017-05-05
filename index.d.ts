export declare class Singleton {
    private _initialized;
    private _setSingleton();
}
export declare class Cache extends Singleton {
    private static cache;
    static _instance: Cache;
    static getInstance(): Cache;
    static clone(value: any): any;
    static get(collectioName: string, itemKey: any, asObject: boolean): Promise<any>;
    static getCollection(collectioName: string, asObject: boolean): Promise<any>;
    static expire(collectioName: string, itemKey: string): void;
}
