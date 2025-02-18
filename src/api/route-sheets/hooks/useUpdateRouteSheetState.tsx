import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateRouteSheetState } from '../route-sheets';
import { UpdateRouteSheetStatePayload, RouteSheet } from '../types/route-sheets.types';

export const useUpdateRouteSheetState = (codigo: string): UseMutationResult<
  RouteSheet,
  unknown,
  UpdateRouteSheetStatePayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRouteSheetStatePayload) => updateRouteSheetState(codigo, payload),
    onSuccess: () => {
      // Invalida la query de la hoja de ruta y de la lista completa para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['routeSheet', codigo] });
      queryClient.invalidateQueries({ queryKey: ['routeSheets'] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar el estado de la hoja de ruta:", error);
    },
  });
};

export default useUpdateRouteSheetState;
