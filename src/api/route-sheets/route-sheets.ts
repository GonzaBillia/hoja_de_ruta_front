// src/api/routesheet/routesheet.ts
import apiClient from "../apiClient";
import { CreateRouteSheetPayload, PaginatedRouteSheets, RouteSheet, UpdateRouteSheetPayload, UpdateRouteSheetStatePayload } from "./types/route-sheets.types";

export const getRouteSheets = async (page: number, limit: number): Promise<PaginatedRouteSheets> => {
  const response = await apiClient.get<{ success: boolean; data: { data: RouteSheet[]; meta: any } }>("/api/route-sheet", {
    params: { page, limit },
  });
  
  // Si la respuesta tiene la forma { data: [...], meta: {...} }
  const responseData = response.data.data;
  const routeSheetsArray = Array.isArray(responseData) ? responseData : responseData.data;
  
  // Si ya viene paginada por el backend, podrías simplemente retornar esa paginación.
  // Pero si necesitas calcularla localmente, puedes hacerlo:
  const total = routeSheetsArray.length;
  const last_page = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedData = routeSheetsArray.slice(start, start + limit);
  
  
  return {
    data: paginatedData,
    meta: {
      page,
      last_page,
      total,
    },
  };
};

// Función para obtener una hoja de ruta por ID.
export const getRouteSheet = async (id: number): Promise<RouteSheet> => {
  const response = await apiClient.get<{ success: boolean; data: RouteSheet }>(`/api/route-sheet/${id}`);
  return response.data.data;
};

// Función para obtener una hoja de ruta por ID.
export const getRouteSheetByCodigo = async (codigo: string): Promise<RouteSheet> => {
  const response = await apiClient.get<{ success: boolean; data: RouteSheet }>(`/api/route-sheet/codigo/${codigo}`);
  return response.data.data;
};

// Función para crear una nueva hoja de ruta.
export const createRouteSheet = async (
  payload: CreateRouteSheetPayload
): Promise<RouteSheet> => {
  const response = await apiClient.post<{ success: boolean; data: RouteSheet }>("/api/route-sheet", payload);
  return response.data.data;
};

// Función para actualizar una hoja de ruta completa.
export const updateRouteSheet = async (
  id: number,
  payload: UpdateRouteSheetPayload
): Promise<RouteSheet> => {
  const response = await apiClient.put<{ success: boolean; data: RouteSheet }>(`/api/route-sheet/${id}`, payload);
  return response.data.data;
};

// Función para eliminar una hoja de ruta.
export const deleteRouteSheet = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: any }>(`/api/route-sheet/${id}`);
  return response.data.data;
};

// Función para actualizar solo el estado de la hoja de ruta.
export const updateRouteSheetState = async (
  id: number,
  payload: UpdateRouteSheetStatePayload
): Promise<RouteSheet> => {
  const response = await apiClient.put<{ success: boolean; data: RouteSheet }>(`/api/route-sheet/${id}/state`, payload);
  return response.data.data;
};
