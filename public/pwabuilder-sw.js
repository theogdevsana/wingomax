// This is the "Offline page" service worker for PWABuilder

const CACHE_NAME = "wingo-pwa-cache-v1";
const offlineFallbackPage = "/offline.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.add(offlineFallbackPage);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

// If any page cannot be fetched, we show the offline page
self.addEventListener("fetch", function (event) {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(function (error) {
        return caches.open(CACHE_NAME).then(function (cache) {
          return cache.match(offlineFallbackPage);
        });
      })
    );
  } else {
    // Respond from cache if available, otherwise fetch from network
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});
