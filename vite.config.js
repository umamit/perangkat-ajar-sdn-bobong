import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    target: 'esnext',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx')) return 'vendor-xlsx';
            if (id.includes('supabase')) return 'vendor-supabase';
            if (id.includes('papaparse')) return 'vendor-papaparse';
            return 'vendor-libs';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
