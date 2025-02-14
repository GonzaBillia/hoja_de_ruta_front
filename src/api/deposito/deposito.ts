import apiClient from '../apiClient';
import { 
  CreateDepositoPayload, 
  Deposito, 
  DepositoResponse, 
  UpdateDepositoPayload 
} from './types/deposito.types';

// Obtener todos los depósitos
export const getAllDepositos = async (): Promise<Deposito[]> => {
  const response = await apiClient.get<DepositoResponse>("/api/depo");
  return response.data.data as Deposito[];
};

// Obtener un depósito por ID
export const getDeposito = async (id: number): Promise<Deposito> => {
  const response = await apiClient.get<DepositoResponse>(`/api/depo/${id}`);
  return response.data.data as Deposito;
};

// Crear un nuevo depósito
export const createDeposito = async (
  payload: CreateDepositoPayload
): Promise<Deposito> => {
  const response = await apiClient.post<DepositoResponse>("/api/depo", payload);
  return response.data.data as Deposito;
};

// Actualizar un depósito
export const updateDeposito = async (
  id: number,
  payload: UpdateDepositoPayload
): Promise<Deposito> => {
  const response = await apiClient.put<DepositoResponse>(`/api/depo/${id}`, payload);
  return response.data.data as Deposito;
};

// Eliminar un depósito
export const deleteDeposito = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/depo/${id}`);
  return response.data.data;
};
