// src/api/repSucu/useRepartidorSucursal.ts
import { useQuery } from '@tanstack/react-query';
import { getRepartidorSucursales } from '../repartidor-sucursal';
import { RepartidorSucursal } from '../types/repartidor-sucursal.types';

export const useRepartidorSucursales = (user_id: number) => {
  return useQuery<RepartidorSucursal[]>({
    queryKey: ['repartidorSucursal', user_id],
    queryFn: () => getRepartidorSucursales(user_id),
    enabled: !!user_id // Se ejecuta la query solo si ambos IDs están disponibles
  });
};

export default useRepartidorSucursales;
