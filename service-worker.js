const CACHE_NAME = 'budget-tracker-offline-v1';

// Resources to cache immediately on install
const PRECACHE_URLS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  // Core Libraries
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0',
  'https://aistudiocdn.com/recharts@^3.4.1',
  'https://aistudiocdn.com/lucide-react@^0.554.0',
  'https://aistudiocdn.com/react-router-dom@^7.9.6'
];

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests that aren't our CDNs or local files
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('cdn.tailwindcss.com') && 
      !event.request.url.includes('aistudiocdn.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network and cache it
      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // Clone the response to put it in the cache
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If network fails and not in cache (offline)
        // We could return a custom offline page here if we had one
        console.log('Offline: Resource not found in cache', event.request.url);
      });
    })
  );
});