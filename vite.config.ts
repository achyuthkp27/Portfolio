import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.GITHUB_ACTIONS ? "/Portfolio/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
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
          // Three.js core — only loaded when 3D scene mounts (lazy)
          'three': ['three'],
          // React Three Fiber + Drei — only loaded when 3D components mount (lazy)
          'r3f': ['@react-three/fiber', '@react-three/drei'],
          // lucide-react, radix-ui, form libs: removed from manual chunks
          // so they tree-shake and bundle with their lazy-loaded consumers
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false, // Omit source maps in production to reduce total download size
  },
}));
