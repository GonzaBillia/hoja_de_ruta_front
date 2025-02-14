// src/api/routesheet/useRouteSheets.ts
import { useQuery } from '@tanstack/react-query';
import { getRouteSheetByCodigo } from '../route-sheets';
import { RouteSheet } from '../types/route-sheets.types';

export const useRouteSheetByCodigo = (codigo: string) => {
  return useQuery<RouteSheet>({
    queryKey: ['routeSheet', codigo],
    queryFn: () => getRouteSheetByCodigo(codigo),
    enabled: !!codigo
  });
};

export default useRouteSheetByCodigo;