// This is the "Offline page" service worker for PWABuilder

const CACHE_NAME = "wingo-pwa-cache-v2";
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

self.addEventListener("fetch", function (event) {
  // Bypass service worker for non-GET requests or API requests
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/v1/") ||
    event.request.url.includes("api.wingosignals.com")
  ) {
    return;
  }

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

