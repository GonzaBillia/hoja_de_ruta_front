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
    onSuccess: (data) => {
      // Invalida o actualiza la query que almacena las hojas de ruta.
      queryClient.invalidateQueries({ queryKey: ['routeSheets'] });
      return data;
    },
    onError: (error: unknown) => {
      // Si el error proviene de axios, podemos obtener el mensaje o la respuesta.
      if (error && typeof error === 'object' && 'response' in error) {
        // @ts-ignore
        console.error("Error al crear la hoja de ruta:", error.response?.data || error.response);
      } else if (error instanceof Error) {
        console.error("Error al crear la hoja de ruta:", error.message);
      } else {
        console.error("Error al crear la hoja de ruta:", error);
      }
    },
  });
};

export default useCreateRouteSheet;
