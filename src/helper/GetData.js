// const getdata = async (apiUrl, storageName) => {
//     // set cache lifetime in seconds
//     var cachelife = 5000;
//     //get cached data from local storage
//     var localStorageData = localStorage.getItem(storageName);
//     var cacheddata = await JSON.parse(localStorageData);
//     if (cacheddata) {
//         return cacheddata.data;
//         var expired = Date.now() / 1000 - cacheddata.cachetime > cachelife;
//     }
//     //If cached data available and not expired return them. 
//     if (cacheddata && (!expired)) {
//         return cacheddata.data;
//     } else {
//         //otherwise fetch data from api then save the data in localstorage 
//         const res = await fetch(apiUrl);
//         var posts = await res.json();
//         var json = { data: posts, cachetime: Date.now() / 1000 }
//         localStorage.setItem(storageName, JSON.stringify(json));
//         return posts;
//     }
// }