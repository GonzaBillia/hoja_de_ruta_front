import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { updateRouteSheet } from '../route-sheets';
import { UpdateRouteSheetPayload, RouteSheet } from '../types/route-sheets.types';

export const useUpdateRouteSheet = (codigo: string): UseMutationResult<
  RouteSheet,
  unknown,
  UpdateRouteSheetPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRouteSheetPayload) => updateRouteSheet(codigo, payload),
    onSuccess: () => {
      // Invalida las queries que dependen de esta hoja de ruta para refrescar la data
      queryClient.invalidateQueries({ queryKey: ['routeSheet', codigo] });
      queryClient.invalidateQueries({ queryKey: ['routeSheets'] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar la hoja de ruta:", error);
    },
  });
};

export default useUpdateRouteSheet;
