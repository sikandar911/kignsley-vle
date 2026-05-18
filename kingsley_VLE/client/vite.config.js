import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - core dependencies
          if (id.includes('node_modules/react') || id.includes('node_modules/@react')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-ui-icons';
          }
          if (id.includes('node_modules/sweetalert2')) {
            return 'vendor-alerts';
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-http';
          }
          // Feature chunks
          if (id.includes('/features/assignments/')) {
            return 'feature-assignments';
          }
          if (id.includes('/features/classMaterials/')) {
            return 'feature-class-materials';
          }
          if (id.includes('/features/courses/')) {
            return 'feature-courses';
          }
          if (id.includes('/features/courseChat/')) {
            return 'feature-chat';
          }
          if (id.includes('/features/attendance/')) {
            return 'feature-attendance';
          }
          if (id.includes('/features/calendar/')) {
            return 'feature-calendar';
          }
          if (id.includes('/features/enrollments/')) {
            return 'feature-enrollments';
          }
          if (id.includes('/features/sections/')) {
            return 'feature-sections';
          }
        },
      },
    },
    // Warn only if chunk is larger than 800 kB (increased from 500 kB default)
    chunkSizeWarningLimit: 800,
  },
});
