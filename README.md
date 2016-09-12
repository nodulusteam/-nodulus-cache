# @nodulus/cache

 cache component for nodulus.
    

 ### install
 `npm install @nodulus/cache`
 
 
 ### usage
 ```
 
 var cache=require("@nodulus/cache");
 

 ```


`public get(collection_name: string, array_of_keys:[string] || single_key:string, callback: Function, asObject: boolean)`

```
 cache.get("my-collection", "12345678", function(result) {
        var my_array = result;
 }, false);
 
 ```  




`public getCollection(collection_name: string, callback: Function, asObject: boolean)`

```
 cache.get("my-collection", function(result) {
        var my_array = result;
 }, false);
 
 ```  

 
