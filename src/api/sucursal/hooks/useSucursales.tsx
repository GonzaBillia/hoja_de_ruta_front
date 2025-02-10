// src/api/sucu/useSucursales.ts
import { useQuery } from '@tanstack/react-query';
import { getAllSucursales } from '../sucursal';
import { Sucursal } from '../types/sucursal.types';

export const useSucursales = () => {
  return useQuery<Sucursal[]>({
    queryKey: ['sucursales'],
    queryFn: getAllSucursales,
  });
};

export default useSucursales;
