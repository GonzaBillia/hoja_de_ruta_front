// src/api/auth/useRepartidores.ts
import { useQuery } from '@tanstack/react-query';
import { getRepartidores } from '../repartidor';
import { Repartidor } from '../types/repartidor.types';

export const useRepartidores = () => {
  return useQuery<Repartidor[]>({
    queryKey: ['repartidores'],
    queryFn: getRepartidores,
    // Puedes agregar otras opciones, por ejemplo, staleTime, refetchInterval, etc.
  });
};

export default useRepartidores;
