import { useQuery } from '@tanstack/react-query';
import { getAllEstados } from '../estado';
import { Estado } from '../types/estado.types';

export const useEstados = () => {
  return useQuery<Estado[]>({
    queryKey: ['estados'],
    queryFn: getAllEstados,
  });
};

export default useEstados;
