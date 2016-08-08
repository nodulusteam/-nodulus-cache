# @nodulus/cache

 cache component for nodulus.
    

 ### install
 `npm install @nodulus/cache`
 
 
 ### usage
 ```
 
 var cache=require("@nodulus/cache").cache;
 

 ```


`public get(collection_name: string, array_of_keys:[string] || single_key:string, callback: Function, asObject: boolean)`

```
 cache.get(collection_name:string, array_of_keys:[string] || single_key:string, callback(result) {
        var my_array = result;
 }, false);


 
 ```  