// src/api/sucu/useCreateSucursal.ts
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createSucursal } from '../sucursal';
import { CreateSucursalPayload, Sucursal } from '../types/sucursal.types';

export const useCreateSucursal = (): UseMutationResult<
  Sucursal,
  unknown,
  CreateSucursalPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSucursal,
    onSuccess: () => {
      // Invalida la query de sucursales para refrescar los datos.
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear la sucursal:", error);
    },
  });
};

export default useCreateSucursal;
