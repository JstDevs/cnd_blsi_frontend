// https://vitejs.dev/config/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow access from network
    allowedHosts: [
      'cddemo.testthelink.online',
      'staging-portal.testthelink.online',
      '.testthelink.online',
    ],
    // allowedHosts: 'all', // Allow all incoming hostnames
    open: false,
    proxy: {
      // Proxy API requests to backend to avoid CORS issues
      // Since backend doesn't use /api prefix, we proxy /api/* to backend routes directly
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix since backend doesn't use it
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Remove or override origin header to avoid CORS issues
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            // Set host to match target
            proxyReq.setHeader('host', 'localhost:5001');
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
