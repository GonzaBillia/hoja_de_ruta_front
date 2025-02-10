// src/api/sucu/sucursal.ts
import apiClient from "../apiClient";
import { CreateSucursalPayload, Sucursal, SucursalResponse, UpdateSucursalPayload } from "./types/sucursal.types";

// Obtener todas las sucursales
export const getAllSucursales = async (): Promise<Sucursal[]> => {
  const response = await apiClient.get<SucursalResponse>("/api/sucu");
  // Se espera que la respuesta tenga data con un arreglo de sucursales.
  return response.data.data as Sucursal[];
};

// Obtener una sucursal por ID
export const getSucursal = async (id: number): Promise<Sucursal> => {
  const response = await apiClient.get<SucursalResponse>(`/api/sucu/${id}`);
  return response.data.data as Sucursal;
};

// Crear una nueva sucursal
export const createSucursal = async (
  payload: CreateSucursalPayload
): Promise<Sucursal> => {
  const response = await apiClient.post<SucursalResponse>("/api/sucu", payload);
  return response.data.data as Sucursal;
};

// Actualizar una sucursal
export const updateSucursal = async (
  id: number,
  payload: UpdateSucursalPayload
): Promise<Sucursal> => {
  const response = await apiClient.put<SucursalResponse>(`/api/sucu/${id}`, payload);
  return response.data.data as Sucursal;
};

// Eliminar una sucursal
export const deleteSucursal = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/sucu/${id}`);
  // En este caso, se espera que la data tenga un objeto con un mensaje de confirmación.
  return response.data.data;
};
