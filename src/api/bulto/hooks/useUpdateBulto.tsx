import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateBulto } from '../bulto';
import { UpdateBultoPayload, Bulto } from '../types/bulto.types';

export const useUpdateBulto = (id: number): UseMutationResult<
  Bulto,
  unknown,
  UpdateBultoPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBultoPayload) => updateBulto(id, payload),
    onSuccess: () => {
      // Invalida la query de bultos y la consulta del bulto actualizado.
      queryClient.invalidateQueries({ queryKey: ['bultos'] });
      queryClient.invalidateQueries({ queryKey: ['bulto', id] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar el bulto:", error);
    },
  });
};

export default useUpdateBulto;
