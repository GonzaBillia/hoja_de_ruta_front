// src/api/routesheet/useRouteSheets.ts
import { useQuery } from '@tanstack/react-query';
import { getRouteSheets } from '../route-sheets';
import { RouteSheet } from '../types/route-sheets.types';

export const useRouteSheets = () => {
  return useQuery<RouteSheet[]>({
    queryKey: ['routeSheets'],
    queryFn: getRouteSheets,
  });
};

export default useRouteSheets;
