// Service Worker for 8-Bit ALU Portfolio
// Provides offline support and performance optimizations

const CACHE_NAME = 'alu-portfolio-v1';
const RUNTIME_CACHE = 'alu-runtime-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/viewer',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network-first strategy for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Network-first for API calls
  if (request.method !== 'GET') {
    return;
  }

  // Cache-first for images and static assets
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME_CACHE).then((cache) => {
          return fetch(request).then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Network-first for HTML and scripts
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Return offline page if available
          return caches.match('/');
        });
      })
  );
});

// Background sync for analytics and metrics
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Placeholder for analytics sync
  console.log('Syncing analytics...');
}

// Push notification support (optional for future)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || '8-Bit ALU Update';
  const options = {
    body: data.body || 'Check out new content!',
    icon: '/media/images/hero/hero_system_photo.png',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: 'alu-notification',
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
