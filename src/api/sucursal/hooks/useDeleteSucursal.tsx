// src/api/sucu/useDeleteSucursal.ts
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { deleteSucursal } from '../sucursal';

export const useDeleteSucursal = (): UseMutationResult<
  { message: string },
  unknown,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSucursal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar la sucursal:", error);
    },
  });
};

export default useDeleteSucursal;
