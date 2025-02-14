import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createDeposito } from '../deposito';
import { CreateDepositoPayload, Deposito } from '../types/deposito.types';

export const useCreateDeposito = (): UseMutationResult<
  Deposito,
  unknown,
  CreateDepositoPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeposito,
    onSuccess: () => {
      // Invalida la query de depósitos para refrescar los datos.
      queryClient.invalidateQueries({ queryKey: ['depositos'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear el depósito:", error);
    },
  });
};

export default useCreateDeposito;
