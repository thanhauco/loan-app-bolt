import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env variables regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Use proxy only in development
    server: env.NODE_ENV !== 'production' ? {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    } : undefined,
    build: {
      outDir: 'dist', // Changed from 'build' to 'dist' to match common conventions
    },
    optimizeDeps: {
      exclude: ['lucite-react'],
    },
    // Define global constants
    define: {
      'import.meta.env.PROD': JSON.stringify(mode === 'production'),
      'import.meta.env.DEV': JSON.stringify(mode !== 'production'),
    },
  };
});

