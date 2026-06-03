/* Service Worker for حاسبة الإنسولين الذكية (T1D Insulin Calculator PWA)
 * Strategy:
 *   - App shell (the single-file index.html) -> network-first, fallback to cache (so updates land fast, offline still works)
 *   - Static assets (icons, manifest) -> cache-first
 *   - Everything is cached on install for full offline support.
 *
 * Bump CACHE_VERSION whenever you ship a new build to force clients to update.
 */
const CACHE_VERSION = "v1";
const CACHE_NAME = `ic-insulin-${CACHE_VERSION}`;

// Relative to the service worker scope (works under /IC/ on GitHub Pages or at root).
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./favicon.png",
];

// --- Install: precache the app shell ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.warn("[SW] Precache failed:", err))
  );
});

// --- Activate: clean up old caches ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("ic-insulin-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      // Enable navigation preload if available (faster first paint).
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch (_) {}
      }
      await self.clients.claim();
    })()
  );
});

// --- Allow the page to trigger an immediate update ---
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// --- Fetch handler ---
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ignore cross-origin requests (let the browser handle them normally).
  if (url.origin !== self.location.origin) return;

  // Navigation requests (the app shell): network-first, fall back to cache.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) {
            putInCache(request, preload.clone());
            return preload;
          }
          const fresh = await fetch(request);
          putInCache(request, fresh.clone());
          return fresh;
        } catch (_) {
          const cached =
            (await caches.match(request)) ||
            (await caches.match("./index.html")) ||
            (await caches.match("./"));
          return (
            cached ||
            new Response("Offline", {
              status: 503,
              statusText: "Offline",
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }
      })()
    );
    return;
  }

  // Static assets: cache-first, then network (and cache the result).
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        putInCache(request, fresh.clone());
        return fresh;
      } catch (_) {
        return cached || Response.error();
      }
    })()
  );
});

function putInCache(request, response) {
  // Only cache valid, basic (same-origin) responses.
  if (!response || !response.ok || response.type === "opaque") return;
  caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
}
