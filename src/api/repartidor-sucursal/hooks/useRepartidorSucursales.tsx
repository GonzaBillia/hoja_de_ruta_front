// src/api/repSucu/useRepartidorSucursales.ts
import { useQuery } from '@tanstack/react-query';
import { getAllRepartidorSucursales } from '../repartidor-sucursal';
import { RepartidorSucursal } from '../types/repartidor-sucursal.types';

export const useRepartidorSucursales = () => {
  return useQuery<RepartidorSucursal[]>({
    queryKey: ['repartidorSucursales'],
    queryFn: getAllRepartidorSucursales,
  });
};

export default useRepartidorSucursales;
