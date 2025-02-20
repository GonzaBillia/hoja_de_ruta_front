import { useMemo } from "react";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import useRouteSheets from "@/api/route-sheets/hooks/useRouteSheets";
import useSucursales from "@/api/sucursal/hooks/useSucursales";
import useDepositos from "@/api/deposito/hooks/useDepositos";
import useBultos from "@/api/bulto/hooks/useBultos";
import useRepartidores from "@/api/repartidor/hooks/useRepartidores";
import { formatDate } from "@/utils/formatDate";

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
        // Se asume que los atributos del join se encuentran en b.historyRouteSheets[i].BultoRouteSheet
        const isInHistory = b.historyRouteSheets &&
          Array.isArray(b.historyRouteSheets) &&
          b.historyRouteSheets.some((hist: any) => 
            hist.BultoRouteSheet && hist.BultoRouteSheet.route_sheet_id === rs.id
          );
        return isCurrent || isInHistory;
      });
      const bultosCount = bultosForRS.length;
    
      // Mapear la información del historial para cada bulto que se asocie a este route sheet
      const bultosHistorial = bultosForRS.map(b => {
        // Extraer solo las asignaciones (del join) que correspondan a este route sheet
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
    
      // Prioridad de fecha: Recepción > Envío > Creación.
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
    
      // Estado basado en la fecha, siguiendo la misma prioridad.
      const estadoDisplay = rs.received_at
        ? "Recibido"
        : rs.sent_at
        ? "Enviado"
        : "Creado";
    
      return {
        ...rs,
        deposito: depositoName,
        sucursal: sucursalName,
        repartidor: repartidorName,
        bultosCount,
        // Puedes mantener ambos si necesitas mostrar los bultos actuales (p.ej. con asignación directa)
        currentBultos: bultos.filter(b => b.route_sheet_id === rs.id),
        bultosHistorial,
        displayDate,
        displayDateType: dateType,
        estadoDisplay,
      };
    });
    

  }, [routeSheets, sucursales, depositos, bultos, repartidores]);

  return {
    transformedData,
    meta: routeSheetsResponse?.meta, // Info de paginación: page, last_page, total
    loading: loadingRS || loadingSuc || loadingDepo || loadingBulto || loadingRep,
    error: errorRS || errorSuc || errorDepo || errorBulto || errorRep,
  };
};
