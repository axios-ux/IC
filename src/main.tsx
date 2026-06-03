import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./pwa";

// Register PWA manifest dynamically
const iconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%236B8E7F'/><text x='50' y='68' text-anchor='middle' font-size='60' fill='white' font-family='system-ui' font-weight='bold'>إ</text></svg>`;
const iconDataUri = `data:image/svg+xml;utf8,${iconSvg}`;

const manifest = {
  name: "حاسبة الإنسولين الذكية",
  short_name: "الإنسولين",
  description: "حاسبة الإنسولين الذكية لمرضى السكري من النوع الأول",
  start_url: ".",
  scope: ".",
  display: "standalone",
  background_color: "#FAF7F2",
  theme_color: "#6B8E7F",
  orientation: "portrait",
  lang: "ar",
  dir: "rtl",
  icons: [
    { src: iconDataUri, sizes: "192x192", type: "image/svg+xml", purpose: "any" },
    { src: iconDataUri, sizes: "512x512", type: "image/svg+xml", purpose: "any" },
  ],
};

const manifestBlob = new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" });
const manifestUrl = URL.createObjectURL(manifestBlob);
const link = document.createElement("link");
link.rel = "manifest";
link.href = manifestUrl;
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
