// src/api/routesheet/routesheet.ts
import apiClient from "../apiClient";
import { CreateRouteSheetPayload, RouteSheet, UpdateRouteSheetPayload, UpdateRouteSheetStatePayload } from "./types/route-sheets.types";

// Función para obtener todas las hojas de ruta.
export const getRouteSheets = async (): Promise<RouteSheet[]> => {
  const response = await apiClient.get<{ success: boolean; data: RouteSheet[] }>("/api/route-sheet");
  return response.data.data;
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
