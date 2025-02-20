import apiClient from "../apiClient";
import { 
  CreateQRCodePayload, 
  QRCode, 
  QRCodeResponse, 
  QRCodeStrResponse, 
  UpdateQRCodePayload 
} from "./types/qrcode.types";

// Obtener todos los códigos QR
export const getAllQRCodes = async (): Promise<QRCode[]> => {
  const response = await apiClient.get<QRCodeResponse>("/api/qrcode");
  return response.data.data as QRCode[];
};

// Obtener un código QR por ID
export const getQRCodeById = async (codigo: string): Promise<QRCode> => {
  const response = await apiClient.get<QRCodeResponse>(`/api/qrcode/${codigo}`);
  return response.data.data as QRCode;
};

// Crear un nuevo código QR
export const createQRCode = async (
  payload: CreateQRCodePayload
): Promise<string[]> => {
  const response = await apiClient.post<QRCodeStrResponse>("/api/qrcode", payload);
  return response.data.data as string[];
};

// Actualizar un código QR
export const updateQRCode = async (
  id: number,
  payload: UpdateQRCodePayload
): Promise<QRCode> => {
  const response = await apiClient.put<QRCodeResponse>(`/api/qrcode/${id}`, payload);
  return response.data.data as QRCode;
};

// Eliminar un código QR
export const deleteQRCode = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/qrcode/${id}`);
  return response.data.data;
};
