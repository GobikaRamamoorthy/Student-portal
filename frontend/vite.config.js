import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development the frontend runs on :5173 and proxies API calls to the
// Express server on :4000, so the browser only ever talks to one origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
