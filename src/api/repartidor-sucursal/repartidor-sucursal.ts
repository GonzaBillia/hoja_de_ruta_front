// src/api/repSucu/repartidorSucursal.ts
import apiClient from "../apiClient";
import { CreateRepartidorSucursalPayload, RepartidorSucursal } from "./types/repartidor-sucursal.types";

// Obtener todas las asociaciones
export const getAllRepartidorSucursales = async (): Promise<RepartidorSucursal[]> => {
  const response = await apiClient.get<{ success: boolean; data: RepartidorSucursal[] }>("/api/rep-sucu");
  return response.data.data;
};

// Obtener una asociación específica por user_id y sucursal_id
export const getRepartidorSucursal = async (
  user_id: number,
  sucursal_id: number
): Promise<RepartidorSucursal> => {
  const response = await apiClient.get<{ success: boolean; data: RepartidorSucursal }>(`/api/rep-sucu/${user_id}/${sucursal_id}`);
  return response.data.data;
};

export const getRepartidorSucursales = async (
  user_id: number
): Promise<RepartidorSucursal[]> => {
  const response = await apiClient.get<{ success: boolean; data: RepartidorSucursal[] }>(`/api/rep-sucu/${user_id}`);
  return response.data.data;
};

// Crear una nueva asociación (solo para superadmin)
export const createRepartidorSucursal = async (
  payload: CreateRepartidorSucursalPayload
): Promise<RepartidorSucursal> => {
  const response = await apiClient.post<{ success: boolean; data: RepartidorSucursal }>("/api/rep-sucu", payload);
  return response.data.data;
};

// Eliminar una asociación
export const deleteRepartidorSucursal = async (
  user_id: number,
  sucursal_id: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/rep-sucu/${user_id}/${sucursal_id}`);
  return response.data.data;
};
