import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createEstado } from '../estado';
import { CreateEstadoPayload, Estado } from '../types/estado.types';

export const useCreateEstado = (): UseMutationResult<
  Estado,
  unknown,
  CreateEstadoPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEstado,
    onSuccess: () => {
      // Invalida la query de estados para refrescar los datos.
      queryClient.invalidateQueries({ queryKey: ['estados'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear el estado:", error);
    },
  });
};

export default useCreateEstado;
