// src/api/repSucu/useCreateRepartidorSucursal.ts
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createRepartidorSucursal } from '../repartidor-sucursal';
import { CreateRepartidorSucursalPayload, RepartidorSucursal } from '../types/repartidor-sucursal.types';

export const useCreateRepartidorSucursal = (): UseMutationResult<
  RepartidorSucursal,
  unknown,
  CreateRepartidorSucursalPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRepartidorSucursal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repartidorSucursales'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear la asociación:", error);
    },
  });
};

export default useCreateRepartidorSucursal;
