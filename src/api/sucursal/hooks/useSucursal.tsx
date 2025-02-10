// src/api/sucu/useSucursal.ts
import { useQuery } from '@tanstack/react-query';
import { getSucursal } from '../sucursal';
import { Sucursal } from '../types/sucursal.types';

export const useSucursal = (id: number) => {
  return useQuery<Sucursal>({
    queryKey: ['sucursal', id],
    queryFn: () => getSucursal(id),
    enabled: !!id, // Se ejecuta solo si id es válido.
  });
};

export default useSucursal;
