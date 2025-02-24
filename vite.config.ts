import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    allowedHosts: ['hojaderutafsa.up.railway.app'],
    host: true, // asegúrate de que Vite escuche en todas las interfaces
    port: 8080
  }
})
