const CACHE = 'nook-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192x192.png', './icon-512x512.png', './icon-mark-light.png', './favicon.png'];

self.addEventListener('install', function(event){
  event.waitUntil(caches.open(CACHE).then(function(cache){ return cache.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Network-first: always try to fetch the latest version. Only fall back to the
// cached copy if the network request fails (offline). This is what makes
// GitHub updates show up immediately instead of getting stuck on whatever
// was cached the first time someone opened the app.
self.addEventListener('fetch', function(event){
  event.respondWith(
    fetch(event.request)
      .then(function(response){
        const copy = response.clone();
        caches.open(CACHE).then(function(cache){ cache.put(event.request, copy); });
        return response;
      })
      .catch(function(){
        return caches.match(event.request);
      })
  );
});
