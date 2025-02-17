// hooks/useTransformedRouteSheet.ts
import { useMemo } from "react";
import useSucursales from "@/api/sucursal/hooks/useSucursales";
import useDepositos from "@/api/deposito/hooks/useDepositos";
import useBultos from "@/api/bulto/hooks/useBultos";
import useRepartidores from "@/api/repartidor/hooks/useRepartidores";
import useEstados from "@/api/estado/hooks/useEstados";
import { formatDate } from "@/utils/formatDate";
import useRouteSheetByCodigo from "@/api/route-sheets/hooks/useRouteSheetbyCodigo";
import useRemitosByRouteSheetId from "@/api/remito/hooks/useRemitoByRouteSheetId";

export const useTransformedRouteSheet = (codigo: string) => {
  // Obtiene la hoja de ruta por código
  const { data: routeSheet, isLoading: loadingRS, error: errorRS } = useRouteSheetByCodigo(codigo);
  const { data: sucursales, isLoading: loadingSuc, error: errorSuc } = useSucursales();
  const { data: depositos, isLoading: loadingDepo, error: errorDepo } = useDepositos();
  const { data: bultos, isLoading: loadingBulto, error: errorBulto } = useBultos();
  const { data: repartidores, isLoading: loadingRep, error: errorRep } = useRepartidores();
  const { data: estados, isLoading: loadingEstados, error: errorEstado } = useEstados();

  // Usamos routeSheet?.id con fallback (-1) y activamos la consulta sólo si routeSheet existe.
  const routeSheetId = routeSheet?.id ?? -1;
  const { data: remitos, isLoading: loadingRemitos, error: errorRemitos } = useRemitosByRouteSheetId(routeSheetId);

  const transformedRouteSheet = useMemo(() => {
    // Si alguno de los datos necesarios no está disponible, retornamos null.
    if (!routeSheet || !sucursales || !depositos || !bultos || !repartidores || !estados)
      return null;

    // Mapas para obtener rápidamente el nombre/username a partir del id
    const sucursalMap = new Map(sucursales.map(s => [s.id, s.nombre]));
    const depositoMap = new Map(depositos.map(d => [d.id, d.nombre]));
    const repartidorMap = new Map(repartidores.map(r => [r.id, r.username]));
    const estadoMap = new Map(estados.map(e => [e.id, e.nombre]));

    const depositoName =
      routeSheet.deposito_id !== undefined
        ? depositoMap.get(routeSheet.deposito_id) || "Desconocido"
        : "Desconocido";
    const sucursalName =
      routeSheet.sucursal_id !== undefined
        ? sucursalMap.get(routeSheet.sucursal_id) || "Desconocido"
        : "Desconocido";
    const repartidorUsername =
      routeSheet.repartidor_id !== undefined && routeSheet.repartidor_id !== null
        ? repartidorMap.get(routeSheet.repartidor_id) || "Desconocido"
        : "Desconocido";
    const estadoName =
      routeSheet.estado_id !== undefined
        ? estadoMap.get(routeSheet.estado_id) || "Desconocido"
        : "Desconocido";

    // Filtrar los bultos asociados a la hoja de ruta
    const associatedBultos = bultos.filter(b => b.route_sheet_id === routeSheet.id);

    // Formatear las fechas
    const createdAtFormatted = routeSheet.created_at ? formatDate(routeSheet.created_at) : "N/A";
    const sentAtFormatted = routeSheet.sent_at ? formatDate(routeSheet.sent_at) : "N/A";
    const receivedAtFormatted = routeSheet.received_at ? formatDate(routeSheet.received_at) : "N/A";

    return {
      ...routeSheet,
      deposito: depositoName,
      sucursal: sucursalName,
      repartidor: repartidorUsername,
      estado: estadoName,
      bultos: associatedBultos,
      bultosCount: associatedBultos.length,
      createdAtFormatted,
      sentAtFormatted,
      receivedAtFormatted,
      // Remitos: si la consulta de remitos no está lista o falla, usamos un arreglo vacío
      remitos: remitos || [],
    };
  }, [routeSheet, sucursales, depositos, bultos, repartidores, estados, remitos]);

  return {
    transformedRouteSheet,
    loading:
      loadingRS ||
      loadingSuc ||
      loadingDepo ||
      loadingBulto ||
      loadingRep ||
      loadingEstados ||
      loadingRemitos,
    error: errorRS || errorSuc || errorDepo || errorBulto || errorRep || errorEstado || errorRemitos,
  };
};

export default useTransformedRouteSheet;
