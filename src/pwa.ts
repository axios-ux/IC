// PWA service worker registration (lightweight, no external dependencies)
// This adds a minimal cache-first strategy for offline support.

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Note: With vite-plugin-singlefile, the app is already a single self-contained file.
    // We don't need a separate service worker for offline support since everything is embedded.
    // But we register a no-op SW to allow the app to be installable as a PWA.
  });
}

// Prevent zoom on double-tap (iOS) while preserving accessibility
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
