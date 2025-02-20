import apiClient from "../apiClient";
import { GenerateQRPdfPayload } from "./types/pdf.types";

// Función para generar el PDF. Se espera que el endpoint retorne un Blob.
export const generateQRPdf = async (
  payload: GenerateQRPdfPayload
): Promise<Blob> => {
  const response = await apiClient.post("/api/pdf/qr", payload, {
    responseType: "blob",
  });
  return response.data;
};
