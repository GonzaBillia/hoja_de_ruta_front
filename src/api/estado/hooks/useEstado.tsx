import { useQuery } from '@tanstack/react-query';
import { getEstado } from '../estado';
import { Estado } from '../types/estado.types';

export const useEstado = (id: number) => {
  return useQuery<Estado>({
    queryKey: ['estado', id],
    queryFn: () => getEstado(id),
    enabled: !!id,
  });
};

export default useEstado;
