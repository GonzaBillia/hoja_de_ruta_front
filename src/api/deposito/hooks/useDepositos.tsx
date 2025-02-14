import { useQuery } from '@tanstack/react-query';
import { getAllDepositos } from '../deposito';
import { Deposito } from '../types/deposito.types';

export const useDepositos = () => {
  return useQuery<Deposito[]>({
    queryKey: ['depositos'],
    queryFn: getAllDepositos,
  });
};

export default useDepositos;
