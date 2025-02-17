import { useQuery } from '@tanstack/react-query';
import { getRemitosByRouteSheetId } from '../remito';
import { Remito } from '../types/remito.types';

export const useRemitosByRouteSheetId = (routesheetId: number) => {
  return useQuery<Remito[]>({
    queryKey: ['remitosByRouteSheet', routesheetId],
    queryFn: () => getRemitosByRouteSheetId(routesheetId),
    enabled: routesheetId > 0, // Solo ejecuta la consulta si se proporciona un routesheetId válido
  });
};

export default useRemitosByRouteSheetId;
