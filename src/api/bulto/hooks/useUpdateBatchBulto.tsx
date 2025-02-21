import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateBatchBultoRecibido } from '../bulto';
import { Bulto, UpdateBatchBultoPayload } from '../types/bulto.types';

export const useUpdateBatchBulto = (): UseMutationResult<
  Bulto[],
  unknown,
  UpdateBatchBultoPayload[],
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBatchBultoPayload[]) => updateBatchBultoRecibido(payload),
    onSuccess: () => {
      // Invalida la query de bultos y la consulta del bulto actualizado.
      queryClient.invalidateQueries({ queryKey: ['bultos'] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar el bulto:", error);
    },
  });
};

export default useUpdateBatchBulto;
