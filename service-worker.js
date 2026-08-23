const CACHE = 'nook-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192x192.png', './icon-512x512.png', './favicon.png'];

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

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request);
    })
  );
});
