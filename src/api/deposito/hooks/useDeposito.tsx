import { useQuery } from '@tanstack/react-query';
import { getDeposito } from '../deposito';
import { Deposito } from '../types/deposito.types';

export const useDeposito = (id: number) => {
  return useQuery<Deposito>({
    queryKey: ['deposito', id],
    queryFn: () => getDeposito(id),
    enabled: !!id,
  });
};

export default useDeposito;
