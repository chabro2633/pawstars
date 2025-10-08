self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic offline fallback (network-first)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        return response;
      } catch {
        try {
          const cache = await caches.open('pawstars-runtime');
          const cached = await cache.match(request);
          if (cached) return cached;
        } catch {}
        return new Response('오프라인 상태입니다.', { status: 503 });
      }
    })()
  );
});




