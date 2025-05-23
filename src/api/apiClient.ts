// src/api/apiClient.js
import axios from 'axios';

const HOST = import.meta.env.VITE_BACKEND_HOST

const apiClient = axios.create({
  baseURL: HOST, // Reemplaza con la URL de tu backend
  withCredentials: true, // Importante para enviar/recibir cookies
});
export default apiClient;
