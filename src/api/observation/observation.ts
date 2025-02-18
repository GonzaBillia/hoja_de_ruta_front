import apiClient from "../apiClient";
import { 
  CreateObservationPayload, 
  Observation, 
  ObservationResponse, 
  UpdateObservationPayload 
} from "./types/observation.types";

// Crear una nueva observación
export const createObservation = async (
  payload: CreateObservationPayload
): Promise<Observation> => {
  const response = await apiClient.post<ObservationResponse>("/api/obs", payload);
  return response.data.data as Observation;
};

// Obtener una observación por ID
export const getObservation = async (id: number): Promise<Observation> => {
  const response = await apiClient.get<ObservationResponse>(`/api/obs/${id}`);
  return response.data.data as Observation;
};

// Obtener todas las observaciones para una hoja de ruta
export const getObservationsByRouteSheet = async (
  routeSheetId: number
): Promise<Observation[]> => {
  const response = await apiClient.get<ObservationResponse>(`/api/obs/route/${routeSheetId}`);
  return response.data.data as Observation[];
};

// Actualizar una observación
export const updateObservation = async (
  id: number,
  payload: UpdateObservationPayload
): Promise<Observation> => {
  const response = await apiClient.put<ObservationResponse>(`/api/obs/${id}`, payload);
  return response.data.data as Observation;
};

// Eliminar una observación
export const deleteObservation = async (
  id: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/obs/${id}`);
  return response.data.data;
};
