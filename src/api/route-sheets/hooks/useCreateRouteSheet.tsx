// src/api/routesheet/useCreateRouteSheet.ts
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { createRouteSheet } from '../route-sheets';
import { CreateRouteSheetPayload, RouteSheet } from '../types/route-sheets.types';

export const useCreateRouteSheet = (): UseMutationResult<
  RouteSheet,
  unknown,
  CreateRouteSheetPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<RouteSheet, unknown, CreateRouteSheetPayload>({
    mutationFn: createRouteSheet,
    onSuccess: () => {
      // Invalida o actualiza la query que almacena las hojas de ruta.
      queryClient.invalidateQueries({ queryKey: ['routeSheets'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear la hoja de ruta:", error);
    },
  });
};

export default useCreateRouteSheet;
