import apiClient from "../apiClient";
import { TipoBulto } from "./types/tiposBulto.types";

// Obtener todos los tipos de bulto
export const getTiposBulto = async (): Promise<TipoBulto[]> => {
  const response = await apiClient.get("/api/tipos-bulto");
  // Se asume que la respuesta tiene la estructura { data: { data: TipoBulto[] } }
  return response.data.data;
};

// Obtener un tipo de bulto por ID
export const getTipoBultoById = async (id: number): Promise<TipoBulto> => {
  const response = await apiClient.get(`/api/tipos-bulto/${id}`);
  return response.data.data;
};

// Crear un nuevo tipo de bulto
export const createTipoBulto = async (newTipo: Partial<TipoBulto>): Promise<TipoBulto> => {
  const response = await apiClient.post("/api/tipos-bulto", newTipo);
  return response.data.data;
};

// Actualizar un tipo de bulto existente
export const updateTipoBulto = async (
  id: number,
  updatedData: Partial<TipoBulto>
): Promise<TipoBulto> => {
  const response = await apiClient.put(`/api/tipos-bulto/${id}`, updatedData);
  return response.data.data;
};

// Eliminar un tipo de bulto
export const deleteTipoBulto = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/api/tipos-bulto/${id}`);
  return response.data.data;
};
