import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateDeposito } from '../deposito';
import { UpdateDepositoPayload, Deposito } from '../types/deposito.types';

export const useUpdateDeposito = (id: number): UseMutationResult<
  Deposito,
  unknown,
  UpdateDepositoPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDepositoPayload) => updateDeposito(id, payload),
    onSuccess: () => {
      // Invalida tanto la query de depósitos como la del depósito actualizado
      queryClient.invalidateQueries({ queryKey: ['depositos'] });
      queryClient.invalidateQueries({ queryKey: ['deposito', id] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar el depósito:", error);
    },
  });
};

export default useUpdateDeposito;
