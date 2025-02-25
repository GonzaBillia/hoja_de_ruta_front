import apiClient from '../apiClient';
import { 
  CreateBultoPayload, 
  Bulto, 
  BultoResponse, 
  UpdateBultoPayload, 
  UpdateBatchBultoPayload
} from './types/bulto.types';

// Obtener todos los bultos
export const getAllBultos = async (): Promise<Bulto[]> => {
  const response = await apiClient.get<BultoResponse>("/api/bulto");
  return response.data.data as Bulto[];
};

// Obtener un bulto por ID
export const getBulto = async (id: number): Promise<Bulto> => {
  const response = await apiClient.get<BultoResponse>(`/api/bulto/${id}`);
  return response.data.data as Bulto;
};

// Obtener un bulto por código
export const getBultoByCode = async (code: string): Promise<Bulto | null> => {
  try {
    const response = await apiClient.get<BultoResponse>(`/api/bulto/code/${code}`);
    return response.data.data as Bulto;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Si la respuesta es 404, retornamos null (indica que no existe bulto asociado)
      return null;
    }
    // Para otros errores, relanzamos el error
    throw error;
  }
};

// Crear un nuevo bulto
export const createBulto = async (
  payload: CreateBultoPayload
): Promise<Bulto> => {
  const response = await apiClient.post<BultoResponse>("/api/bulto", payload);
  return response.data.data as Bulto;
};

// Actualizar un bulto
export const updateBulto = async (
  id: number,
  payload: UpdateBultoPayload
): Promise<Bulto> => {
  const response = await apiClient.put<BultoResponse>(`/api/bulto/${id}`, payload);
  return response.data.data as Bulto;
};

export const updateBatchBultoRecibido = async (
  payload: UpdateBatchBultoPayload[]
): Promise<Bulto[]> => {
  const response = await apiClient.put<BultoResponse>(`/api/bulto/recibido`, payload);
  return response.data.data as Bulto[];
};

// Eliminar un bulto
export const deleteBulto = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/bulto/${id}`);
  return response.data.data;
};
