import apiClient from '../apiClient';
import { 
  CreateBultoPayload, 
  Bulto, 
  BultoResponse, 
  UpdateBultoPayload 
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
export const getBultoByCode = async (code: string): Promise<Bulto> => {
  const response = await apiClient.get<BultoResponse>(`/api/bulto/code/${code}`);
  return response.data.data as Bulto;
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

// Eliminar un bulto
export const deleteBulto = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/bulto/${id}`);
  return response.data.data;
};
