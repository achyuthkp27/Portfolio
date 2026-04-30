import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { dependencies } from "./package.json";

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
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          'react-vendor': ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'radix-vendor': Object.keys(dependencies).filter(
            (key) => key.startsWith('@radix-ui/')
          ),
        },
      },
    },
    chunkSizeWarningLimit: 600, // Adjust warning threshold
    sourcemap: mode === 'development',
  },
}));
