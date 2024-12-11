import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
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
