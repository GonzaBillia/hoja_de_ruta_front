import { useMemo } from "react";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import useRouteSheets from "@/api/route-sheets/hooks/useRouteSheets";
import useSucursales from "@/api/sucursal/hooks/useSucursales";
import useDepositos from "@/api/deposito/hooks/useDepositos";
import useBultos from "@/api/bulto/hooks/useBultos";
import useRepartidores from "@/api/repartidor/hooks/useRepartidores";
import { formatDate } from "@/utils/formatDate";
import { useQueries } from "@tanstack/react-query";
import { getEstado } from "@/api/estado/estado";


export const useTransformedRouteSheets = (page: number, limit: number) => {
  // Se asume que useRouteSheets acepta page y limit como parámetros
  const { data: routeSheetsResponse, isLoading: loadingRS, error: errorRS } = useRouteSheets(page, limit);
  const { data: sucursales, isLoading: loadingSuc, error: errorSuc } = useSucursales();
  const { data: depositos, isLoading: loadingDepo, error: errorDepo } = useDepositos();
  const { data: bultos, isLoading: loadingBulto, error: errorBulto } = useBultos();
  const { data: repartidores, isLoading: loadingRep, error: errorRep } = useRepartidores();

  // Extraemos el array de routeSheets desde la propiedad data
  const routeSheets = useMemo(() => {
    return routeSheetsResponse?.data || [];
  }, [routeSheetsResponse]);

  // Extraemos los estado_id únicos de las hojas de ruta
  const uniqueEstadoIds = useMemo(() => {
    return Array.from(new Set(routeSheets.map(rs => rs.estado_id)));
  }, [routeSheets]);

  // Ejecutamos una query por cada estado_id único para traer el objeto Estado
  const estadoQueries = useQueries({
    queries: uniqueEstadoIds.map(id => ({
      queryKey: ['estado', id],
      queryFn: () => getEstado(id),
      enabled: !!id,
    }))
  });

  // Creamos un mapa para obtener rápidamente el nombre del estado a partir de su id
  const estadoMap = useMemo(() => {
    const map = new Map<number, string>();
    estadoQueries.forEach(query => {
      if (query.data) {
        map.set(query.data.id, query.data.nombre);
      }
    });
    return map;
  }, [estadoQueries]);

  // Transformamos la data de routeSheets
  const transformedData = useMemo(() => {
    if (!routeSheets || !sucursales || !depositos || !bultos || !repartidores) return [];

    // Mapas para obtener nombres rápidamente a partir del id.
    const sucursalMap = new Map(sucursales.map(s => [s.id, s.nombre]));
    const depositoMap = new Map(depositos.map(d => [d.id, d.nombre]));
    const repartidorMap = new Map(repartidores.map(r => [r.id, r.username]));

    return routeSheets.map((rs: RouteSheet) => {
      // Obtener nombres o fallback "Desconocido"
      const depositoName = rs.deposito_id !== undefined
        ? (depositoMap.get(rs.deposito_id) || "Desconocido")
        : "Desconocido";
      const sucursalName = rs.sucursal_id !== undefined
        ? (sucursalMap.get(rs.sucursal_id) || "Desconocido")
        : "Desconocido";
      const repartidorName = rs.repartidor_id !== undefined && rs.repartidor_id !== null
        ? (repartidorMap.get(rs.repartidor_id) || "Desconocido")
        : "Desconocido";

      // Filtrar todos los bultos que estén asignados actualmente o tengan en su historial este route sheet
      const bultosForRS = bultos.filter(b => {
        const isCurrent = b.route_sheet_id === rs.id;
        const isInHistory = b.historyRouteSheets &&
          Array.isArray(b.historyRouteSheets) &&
          b.historyRouteSheets.some((hist: any) => 
            hist.BultoRouteSheet && hist.BultoRouteSheet.route_sheet_id === rs.id
          );
        return isCurrent || isInHistory;
      });
      const bultosCount = bultosForRS.length;

      // Mapear la información del historial para cada bulto
      const bultosHistorial = bultosForRS.map(b => {
        const historyRecords = (b.historyRouteSheets || []).filter((hist: any) =>
          hist.BultoRouteSheet && hist.BultoRouteSheet.route_sheet_id === rs.id
        );
        return {
          id: b.id,
          codigo: b.codigo,
          historial: historyRecords.map((hist: any) => ({
            routeSheetId: hist.BultoRouteSheet.route_sheet_id,
            assignedAt: hist.BultoRouteSheet.assigned_at ? formatDate(hist.BultoRouteSheet.assigned_at) : 'N/A',
            active: hist.BultoRouteSheet.active,
          }))
        };
      });

      // Lógica de fecha de despliegue
      let dateValue = null;
      let dateType = "";
      if (rs.received_at) {
        dateValue = rs.received_at;
        dateType = "Recepción";
      } else if (rs.sent_at) {
        dateValue = rs.sent_at;
        dateType = "Envío";
      } else if (rs.created_at) {
        dateValue = rs.created_at;
        dateType = "Creación";
      } else {
        dateType = "N/A";
      }
      const displayDate = dateValue ? formatDate(dateValue) : "N/A";

      // Usamos el estado obtenido a partir del estado_id mediante el mapa
      const estadoDisplay = estadoMap.get(rs.estado_id) || "Desconocido";

      return {
        ...rs,
        deposito: depositoName,
        sucursal: sucursalName,
        repartidor: repartidorName,
        bultosCount,
        currentBultos: bultos.filter(b => b.route_sheet_id === rs.id),
        bultosHistorial,
        displayDate,
        displayDateType: dateType,
        estadoDisplay,
      };
    });
  }, [routeSheets, sucursales, depositos, bultos, repartidores, estadoMap]);

  return {
    transformedData,
    meta: routeSheetsResponse?.meta, // Info de paginación: page, last_page, total
    loading: loadingRS || loadingSuc || loadingDepo || loadingBulto || loadingRep,
    error: errorRS || errorSuc || errorDepo || errorBulto || errorRep,
  };
};
