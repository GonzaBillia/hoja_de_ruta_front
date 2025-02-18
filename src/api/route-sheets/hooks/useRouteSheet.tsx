import { useQuery } from '@tanstack/react-query';
import { getRouteSheet } from '../route-sheets';
import { RouteSheet } from '../types/route-sheets.types';

export const useRouteSheet = (id: number) => {
  return useQuery<RouteSheet>({
    queryKey: ['routeSheet', id],
    queryFn: () => getRouteSheet(id),
    enabled: !!id
  });
};

export default useRouteSheet;