const CACHE_NAME = "bedvault-v2";

const STATIC_CACHE = [
"./",
"./index.html",
"./manifest.json"
];

self.addEventListener("install", event => {

self.skipWaiting();

event.waitUntil(
caches.open(CACHE_NAME).then(cache=>{
return cache.addAll(STATIC_CACHE);
})
);

});

self.addEventListener("activate", event => {

event.waitUntil(
caches.keys().then(keys=>{
return Promise.all(
keys.filter(key=>key!==CACHE_NAME)
.map(key=>caches.delete(key))
)
})
);

});

/* FETCH */

self.addEventListener("fetch", event => {

const url = event.request.url;

/* CACHE .bed FILES */

if(url.endsWith(".bed")){

event.respondWith(

caches.open("bed-files").then(cache=>{

return cache.match(event.request).then(res=>{

return res || fetch(event.request).then(net=>{

cache.put(event.request, net.clone());

return net;

});

});

})

);

return;

}

/* NORMAL FILES */

event.respondWith(

caches.match(event.request).then(res=>{
return res || fetch(event.request);
})

);

});
