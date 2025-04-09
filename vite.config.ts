import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo actual
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const ALLOWED_HOST = env.ALLOWED_HOST
  const port = 8080;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    preview: {
      allowedHosts: [ALLOWED_HOST],
      host: true, // Asegura que Vite escuche en todas las interfaces
      port: port,
    },
  };
});
