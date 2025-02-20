import { useMutation } from "@tanstack/react-query";
import { generateQRPdf } from "../pdf";
import { GenerateQRPdfPayload } from "../types/pdf.types";

export const useGenerateQRPdf = () => {
  return useMutation<Blob, unknown, GenerateQRPdfPayload, unknown>({
    mutationFn: generateQRPdf,
  });
};

export default useGenerateQRPdf;
