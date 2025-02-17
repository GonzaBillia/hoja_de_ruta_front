// src/api/routesheet/useRouteSheets.ts
import { useQuery } from '@tanstack/react-query';
import { getRouteSheets } from '../route-sheets';
import { PaginatedRouteSheets } from '../types/route-sheets.types';

export const useRouteSheets = (page: number, limit: number) => {
  return useQuery<PaginatedRouteSheets>({
    queryKey: ['routeSheets', page, limit],
    queryFn: () => getRouteSheets(page, limit),
  });
};

export default useRouteSheets;
