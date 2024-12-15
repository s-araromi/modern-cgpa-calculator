import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      dedupe: ['html2pdf.js']
    },
    server: {
      port: 5173,
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    base: '/',
    build: {
      target: 'es2020',
      outDir: 'dist',
      sourcemap: true,
      commonjsOptions: {
        transformMixedEsModules: true
      },
      rollupOptions: {
        external: ['html2pdf.js'],
        output: {
          manualChunks(id) {
            if (id.includes('html2pdf.js')) {
              return 'html2pdf';
            } else if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@emotion/react',
        '@supabase/supabase-js',
        'lucide-react',
        'html2pdf.js'
      ],
      force: true,
      esbuildOptions: {
        target: 'es2020'
      }
    }
  };
});
