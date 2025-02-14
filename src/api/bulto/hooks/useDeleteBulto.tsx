import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { deleteBulto } from '../bulto';

export const useDeleteBulto = (id: number): UseMutationResult<
  { message: string },
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBulto(id),
    onSuccess: () => {
      // Invalida la query de bultos para actualizar la lista.
      queryClient.invalidateQueries({ queryKey: ['bultos'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar el bulto:", error);
    },
  });
};

export default useDeleteBulto;
