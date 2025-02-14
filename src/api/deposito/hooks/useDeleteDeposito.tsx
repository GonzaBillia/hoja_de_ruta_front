import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { deleteDeposito } from '../deposito';

export const useDeleteDeposito = (id: number): UseMutationResult<
  { message: string },
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteDeposito(id),
    onSuccess: () => {
      // Invalida la query de depósitos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['depositos'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar el depósito:", error);
    },
  });
};

export default useDeleteDeposito;
