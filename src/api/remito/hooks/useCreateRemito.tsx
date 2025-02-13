import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createRemito } from '../remito';
import { Remito } from '../types/remito.types';

export const useCreateRemito = (): UseMutationResult<Remito, unknown, Partial<Remito>, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRemito,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remitos'] });
    },
    onError: (error: unknown) => {
      console.error('Error al crear el remito:', error);
    },
  });
};

export default useCreateRemito;
