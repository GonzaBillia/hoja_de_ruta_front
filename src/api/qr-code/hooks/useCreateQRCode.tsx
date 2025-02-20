import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createQRCode } from "../qrcode";
import { CreateQRCodePayload } from "../types/qrcode.types";

export const useCreateQRCode = (): UseMutationResult<string[], unknown, CreateQRCodePayload, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQRCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear QRCode:", error);
    },
  });
};

export default useCreateQRCode;
