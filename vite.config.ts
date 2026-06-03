import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hosted on GitHub Pages at https://axios-ux.github.io/IC/
// The base path must match the repo subpath so assets resolve correctly.
// For a root/custom domain (Netlify/Vercel) change this back to "/".
const BASE = "/IC/";

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    // Inline the JS/CSS into a single index.html, BUT keep the PWA files
    // (service worker, manifest, icons) as separate real files — they must be
    // fetchable on their own for installability + offline to work.
    viteSingleFile({ useRecommendedBuildConfig: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Don't inline the public/ assets (sw.js, manifest, icons) as data URIs.
    assetsInlineLimit: 0,
    // Keep filenames stable so the service worker precache list stays valid.
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
