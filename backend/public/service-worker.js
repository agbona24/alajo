// Service Worker for Alajo PWA
const CACHE_NAME = 'alajo-v1.0.0';
const RUNTIME_CACHE = 'alajo-runtime';
const API_CACHE = 'alajo-api';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install event');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate event');

  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, API_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !currentCaches.includes(cacheName))
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE)
        .then((cache) => {
          return fetch(request)
            .then((response) => {
              // Cache successful GET requests
              if (request.method === 'GET' && response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Return cached version if available
              return cache.match(request)
                .then((cachedResponse) => {
                  if (cachedResponse) {
                    return cachedResponse;
                  }
                  // Return offline response for API
                  return new Response(
                    JSON.stringify({
                      error: 'Offline',
                      message: 'You are currently offline. Please check your connection.'
                    }),
                    {
                      status: 503,
                      headers: { 'Content-Type': 'application/json' }
                    }
                  );
                });
            });
        })
    );
    return;
  }

  // Static assets - Cache first, network fallback
  if (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.open(RUNTIME_CACHE)
            .then((cache) => {
              return fetch(request)
                .then((response) => {
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

  // HTML pages - Network first, cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the HTML page
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Return cached page or offline page
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Default - try network, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-contributions') {
    event.waitUntil(syncContributions());
  }

  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');

  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Alajo Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'general',
    data: data.data || {},
    actions: data.actions || [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click:', event.action);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Focus existing window if available
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
    );
  }
});

// Helper function to sync contributions
async function syncContributions() {
  try {
    // Get pending contributions from IndexedDB
    const db = await openDB();
    const pendingContributions = await db.getAll('pending-contributions');

    // Sync each contribution
    for (const contribution of pendingContributions) {
      try {
        const response = await fetch('/api/ajo/groups/' + contribution.groupId + '/contribute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + contribution.token
          },
          body: JSON.stringify(contribution.data)
        });

        if (response.ok) {
          // Remove from pending queue
          await db.delete('pending-contributions', contribution.id);
          console.log('[ServiceWorker] Contribution synced:', contribution.id);
        }
      } catch (error) {
        console.error('[ServiceWorker] Failed to sync contribution:', error);
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync contributions failed:', error);
  }
}

// Helper function to sync transactions
async function syncTransactions() {
  try {
    // Similar to syncContributions
    console.log('[ServiceWorker] Syncing transactions...');
  } catch (error) {
    console.error('[ServiceWorker] Sync transactions failed:', error);
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('alajo-offline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('pending-contributions')) {
        db.createObjectStore('pending-contributions', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('pending-transactions')) {
        db.createObjectStore('pending-transactions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

console.log('[ServiceWorker] Loaded successfully');
