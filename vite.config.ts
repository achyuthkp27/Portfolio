import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

/**
 * The site is served from https://achyuthkp27.github.io/Portfolio/, so every build
 * (CI, local `npm run build`, `npm run preview`) uses the /Portfolio/ base.
 * The dev server stays at the root for convenience.
 */
const PAGES_BASE = "/Portfolio/";

// https://vitejs.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? PAGES_BASE : "/",
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    port: 4173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["images/logo.webp", "apple-touch-icon.png"],
      manifest: {
        name: "Achyuth KP | Software Engineer",
        short_name: "Achyuth KP",
        description:
          "Achyuth KP, Software Engineer building secure banking microservices with Java, Spring Boot, and Kafka.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Activate new deploys straight away instead of waiting for every tab to close
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    rolldownOptions: {
      output: {
        // Stable, cacheable vendor chunks. Groups match on node_modules paths (Rolldown has no object form).
        codeSplitting: {
          groups: [
            // Core React — always needed on first load
            { name: "react-vendor", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 40 },
            // Router kept apart from react-dom: bundling them together once left react-dom undefined at startup
            { name: "router", test: /node_modules[\\/](react-router|react-router-dom|@remix-run)[\\/]/, priority: 30 },
            {
              name: "framer-motion",
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 30,
            },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 700,
    sourcemap: false,
  },
}));
