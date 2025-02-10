// src/api/sucu/useUpdateSucursal.ts
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateSucursal } from '../sucursal';
import { Sucursal, UpdateSucursalPayload } from '../types/sucursal.types';

export const useUpdateSucursal = (id: number): UseMutationResult<
  Sucursal,
  unknown,
  UpdateSucursalPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSucursalPayload) => updateSucursal(id, payload),
    onSuccess: () => {
      // Invalida las queries para que se actualicen los datos.
      queryClient.invalidateQueries({ queryKey: ['sucursal', id] });
      queryClient.invalidateQueries({ queryKey: ['sucursales'] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar la sucursal:", error);
    },
  });
};

export default useUpdateSucursal;
