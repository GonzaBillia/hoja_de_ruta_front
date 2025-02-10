// src/api/repSucu/useDeleteRepartidorSucursal.ts
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { deleteRepartidorSucursal } from '../repartidor-sucursal'; 

export const useDeleteRepartidorSucursal = (): UseMutationResult<
  { message: string },
  unknown,
  { user_id: number; sucursal_id: number },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user_id, sucursal_id }) => deleteRepartidorSucursal(user_id, sucursal_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repartidorSucursales'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar la asociación:", error);
    },
  });
};

export default useDeleteRepartidorSucursal;
