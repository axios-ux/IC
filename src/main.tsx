import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./pwa";

// Note: the PWA manifest and icons are linked statically in index.html and live
// as real files in /public, so the browser can validate them for installability.
// (A blob:-URL manifest is rejected by Chrome's install criteria.)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
