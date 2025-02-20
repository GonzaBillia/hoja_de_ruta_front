import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateQRCode } from "../qrcode";
import { UpdateQRCodePayload, QRCode } from "../types/qrcode.types";

export const useUpdateQRCode = (id: number): UseMutationResult<QRCode, unknown, UpdateQRCodePayload, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQRCodePayload) => updateQRCode(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcode', id] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar QRCode:", error);
    },
  });
};

export default useUpdateQRCode;
