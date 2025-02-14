import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createBulto } from '../bulto';
import { CreateBultoPayload, Bulto } from '../types/bulto.types';

export const useCreateBulto = (): UseMutationResult<
  Bulto,
  unknown,
  CreateBultoPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBulto,
    onSuccess: () => {
      // Invalida la query de bultos para refrescar los datos.
      queryClient.invalidateQueries({ queryKey: ['bultos'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear el bulto:", error);
    },
  });
};

export default useCreateBulto;
