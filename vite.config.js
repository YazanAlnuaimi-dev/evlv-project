import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');

  // In development the React app runs on Vite (5173) and the API on Express.
  // Proxying /api keeps the browser on a single origin, so no CORS is needed.
  const proxy = {
    '/api': {
      target: `http://localhost:${env.PORT || 3000}`,
      changeOrigin: true,
    },
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
        '@shared': path.resolve(rootDir, 'shared'),
      },
    },
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});
