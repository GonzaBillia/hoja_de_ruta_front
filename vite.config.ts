import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo actual
  const env = loadEnv(mode, process.cwd(), '');
  const ALLOWED_HOST = env.VITE_ALLOWED_HOST
  // Define el puerto según el ambiente: 8080 en producción, 5173 en desarrollo
  const port = mode === 'production' ? 8080 : 5173;

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
