// PWA setup: service worker registration + update handling + double-tap-zoom prevention.

/**
 * Registers the service worker and wires up an "update available" flow.
 * When a new version is detected, we activate it and reload so the user
 * always gets the latest build (important for a medical calculator).
 */
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      // Resolve the SW URL relative to the document base so it works under /IC/.
      const swUrl = new URL("sw.js", document.baseURI).href;
      const registration = await navigator.serviceWorker.register(swUrl);

      // Periodically check for updates (e.g. when the app stays open a long time).
      setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000);

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          // A new SW is installed and there is an existing controller => update is ready.
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            newWorker.postMessage("SKIP_WAITING");
          }
        });
      });

      // When the active SW changes, reload once to pick up the new assets.
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    } catch (err) {
      console.warn("[PWA] Service worker registration failed:", err);
    }
  });
}

/**
 * Prevents the double-tap-to-zoom gesture on iOS while keeping pinch-zoom
 * and normal accessibility behavior intact.
 */
function preventDoubleTapZoom() {
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );
}

registerServiceWorker();
preventDoubleTapZoom();
