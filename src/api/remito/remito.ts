// src/api/remito/remitoApi.ts
import apiClient from "../apiClient";
import { Remito } from "./types/remito.types";

// URL base para las rutas de remitos (ajústala según tu backend)
const API_URL = "/api/remito";

// Obtiene todos los remitos
export const getRemitos = async (): Promise<Remito[]> => {
  const response = await apiClient.get(API_URL);
  // Se asume que la respuesta tiene la estructura: { data: { data: [...] } }
  return response.data.data;
};

// Obtiene los remitos del día actual (ruta /quantio)
export const getRemitosQuantio = async (): Promise<any[]> => {
  const response = await apiClient.get(`${API_URL}/quantio`);
  return response.data.data;
};

// Obtiene un remito por su ID
export const getRemitoById = async (id: number): Promise<Remito> => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const getRemitosByRouteSheetId = async (routesheetId: number): Promise<Remito[]> => {
  const response = await apiClient.get(`${API_URL}/routesheet/${routesheetId}`);
  return response.data.data;
};

// Crea un nuevo remito
export const createRemito = async (newRemito: Partial<Remito>): Promise<Remito> => {
  const response = await apiClient.post(API_URL, newRemito);
  return response.data.data;
};
