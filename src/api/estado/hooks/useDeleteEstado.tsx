import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { deleteEstado } from '../estado';

export const useDeleteEstado = (id: number): UseMutationResult<
  { message: string },
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteEstado(id),
    onSuccess: () => {
      // Invalida la query de estados para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['estados'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar el estado:", error);
    },
  });
};

export default useDeleteEstado;
