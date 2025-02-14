import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateEstado } from '../estado';
import { UpdateEstadoPayload, Estado } from '../types/estado.types';

export const useUpdateEstado = (id: number): UseMutationResult<
  Estado,
  unknown,
  UpdateEstadoPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEstadoPayload) => updateEstado(id, payload),
    onSuccess: () => {
      // Invalida la query de estados y la del estado actualizado
      queryClient.invalidateQueries({ queryKey: ['estados'] });
      queryClient.invalidateQueries({ queryKey: ['estado', id] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar el estado:", error);
    },
  });
};

export default useUpdateEstado;
