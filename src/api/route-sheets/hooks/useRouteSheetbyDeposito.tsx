// src/api/routesheet/useRouteSheets.ts
import { useQuery } from '@tanstack/react-query';
import { getRouteSheetByDeposito } from '../route-sheets';
import { RouteSheet } from '../types/route-sheets.types';

export const useRouteSheetsByDeposito = (deposito_id: number) => {
  return useQuery<RouteSheet[]>({
    queryKey: ['routeSheet', deposito_id],
    queryFn: () => getRouteSheetByDeposito(deposito_id),
    enabled: !!deposito_id
  });
};

export default useRouteSheetsByDeposito;