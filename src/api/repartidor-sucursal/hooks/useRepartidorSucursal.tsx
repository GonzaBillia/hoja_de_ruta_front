// src/api/repSucu/useRepartidorSucursal.ts
import { useQuery } from '@tanstack/react-query';
import { getRepartidorSucursal } from '../repartidor-sucursal';
import { RepartidorSucursal } from '../types/repartidor-sucursal.types';

export const useRepartidorSucursal = (user_id: number, sucursal_id: number) => {
  return useQuery<RepartidorSucursal>({
    queryKey: ['repartidorSucursal', user_id, sucursal_id],
    queryFn: () => getRepartidorSucursal(user_id, sucursal_id),
    enabled: !!user_id && !!sucursal_id, // Se ejecuta la query solo si ambos IDs están disponibles
  });
};

export default useRepartidorSucursal;
