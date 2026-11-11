import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/(react|react-dom)\//.test(id)) {
            return "react-vendor";
          }
          if (id.includes("/node_modules/react-router-dom/")) {
            return "router-vendor";
          }
          if (id.includes("/node_modules/axios/")) {
            return "http-vendor";
          }
          if (id.includes("/node_modules/lucide-react/")) {
            return "icons-vendor";
          }
        },
      },
    },
  },
});
