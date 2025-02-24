// src/api/apiClient.js
import axios from 'axios';

const PORT = import.meta.env.VITE_PORT
const HOST = import.meta.env.VITE_HOST
console.log(`https://${HOST}:${PORT}`)
const apiClient = axios.create({
  baseURL: `https://${HOST}:${PORT}`, // Reemplaza con la URL de tu backend
  withCredentials: true, // Importante para enviar/recibir cookies
});

export default apiClient;
