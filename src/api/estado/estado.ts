import apiClient from '../apiClient';
import { 
  CreateEstadoPayload, 
  Estado, 
  EstadoResponse, 
  UpdateEstadoPayload 
} from './types/estado.types';

// Obtener todos los estados
export const getAllEstados = async (): Promise<Estado[]> => {
  const response = await apiClient.get<EstadoResponse>("/api/estado");
  return response.data.data as Estado[];
};

// Obtener un estado por ID
export const getEstado = async (id: number): Promise<Estado> => {
  const response = await apiClient.get<EstadoResponse>(`/api/estado/${id}`);
  return response.data.data as Estado;
};

// Crear un nuevo estado
export const createEstado = async (
  payload: CreateEstadoPayload
): Promise<Estado> => {
  const response = await apiClient.post<EstadoResponse>("/api/estado", payload);
  return response.data.data as Estado;
};

// Actualizar un estado
export const updateEstado = async (
  id: number,
  payload: UpdateEstadoPayload
): Promise<Estado> => {
  const response = await apiClient.put<EstadoResponse>(`/api/estado/${id}`, payload);
  return response.data.data as Estado;
};

// Eliminar un estado
export const deleteEstado = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/estado/${id}`);
  return response.data.data;
};
