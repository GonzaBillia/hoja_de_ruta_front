import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { deleteQRCode } from "../qrcode";

export const useDeleteQRCode = (id: number): UseMutationResult<{ message: string }, unknown, void, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteQRCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar QRCode:", error);
    },
  });
};

export default useDeleteQRCode;
