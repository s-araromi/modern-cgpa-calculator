import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: 'inline',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: []
  }
});
