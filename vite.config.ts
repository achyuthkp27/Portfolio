import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.GITHUB_ACTIONS ? "/Portfolio/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    sitemap({
      hostname: "https://achyuthkp27.github.io/Portfolio",
      dynamicRoutes: [
        "/",
        "/blog",
      ],
      generateRobotsTxt: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Achyuth KP | Creative Developer',
        short_name: 'Achyuth',
        description: 'Portfolio of Achyuth KP - Software Developer',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — always needed on first load
          'react-vendor': ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'react-router-dom'],
          // Framer Motion — used by Hero and layout, separate from React core
          'framer-motion': ['framer-motion'],
          // Three.js core — only loaded when 3D scene mounts (lazy).
          // Kept as its own chunk: r3f imports the full three namespace internally,
          // so tree-shaking cannot reduce it; splitting at least keeps it cacheable.
          'three': ['three'],
          // React Three Fiber + Drei — only loaded when 3D components mount (lazy)
          'r3f': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false, // Omit source maps in production to reduce total download size
  },
}));
