import { useQuery } from '@tanstack/react-query';
import { getRemitos } from '../remito';
import { Remito } from '../types/remito.types';

export const useRemitos = () => {
  return useQuery<Remito[]>({
    queryKey: ['remitos'],
    queryFn: getRemitos,
    // Puedes agregar otras opciones como staleTime, refetchInterval, etc.
  });
};

export default useRemitos;
