

# @nodulus/cache

   
[![NPM](https://nodei.co/npm/@nodulus/cache.png)](https://npmjs.org/package/@nodulus/cache)

![Alt text](https://travis-ci.org/nodulusteam/-nodulus-cache.svg?branch=master "build")
![Alt text](https://david-dm.org/nodulusteam/-nodulus-cache.svg "dependencies")
 



 cache component for nodulus.
    

 ### install
 `npm install @nodulus/cache`
 
 
 ### usage
 ```
 
 var cache=require("@nodulus/cache");
 

 ```


`public get(collection_name: string, array_of_keys:[string] || single_key:string,  asObject: boolean)`

```
 let result = await cache.get("my-collection", "12345678", false);
 
 ```  




`public getCollection(collection_name: string,  asObject: boolean)`

```
  let result = await cache.get("my-collection", false);
 
 ```  

 
