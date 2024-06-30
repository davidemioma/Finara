import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(), sentryVitePlugin({
    org: "david-yhn",
    project: "finara"
  })],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dir, "./src"),
      "@components": path.resolve(import.meta.dir, "./src/components"),
      "@server": path.resolve(import.meta.dir, "../server"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },

  build: {
    sourcemap: true
  }
});