import { useMemo } from "react";
import useSucursales from "@/api/sucursal/hooks/useSucursales";
import useDepositos from "@/api/deposito/hooks/useDepositos";
import useBultos from "@/api/bulto/hooks/useBultos";
import useRepartidores from "@/api/repartidor/hooks/useRepartidores";
import useEstados from "@/api/estado/hooks/useEstados";
import { formatDate } from "@/utils/formatDate";
import useRouteSheetByCodigo from "@/api/route-sheets/hooks/useRouteSheetbyCodigo";
import useRemitosByRouteSheetId from "@/api/remito/hooks/useRemitoByRouteSheetId";
import { useQueries } from "@tanstack/react-query";
import { getQRCodeById } from "@/api/qr-code/qrcode";
import useTiposBultos from "@/api/tipos-bulto/hooks/useTiposBulto";

export const useTransformedRouteSheet = (codigo: string) => {
  // Obtiene la hoja de ruta por código
  const { data: routeSheet, isLoading: loadingRS, error: errorRS } = useRouteSheetByCodigo(codigo);
  const { data: sucursales, isLoading: loadingSuc, error: errorSuc } = useSucursales();
  const { data: depositos, isLoading: loadingDepo, error: errorDepo } = useDepositos();
  const { data: bultos, isLoading: loadingBulto, error: errorBulto } = useBultos();
  const { data: repartidores, isLoading: loadingRep, error: errorRep } = useRepartidores();
  const { data: estados, isLoading: loadingEstados, error: errorEstado } = useEstados();
  const { data: tiposBultos, isLoading: loadingTipoBulto, error: errorTipobulto } = useTiposBultos();

  // Usamos routeSheet?.id con fallback (-1) y activamos la consulta sólo si routeSheet existe.
  const routeSheetId = routeSheet?.id ?? -1;
  const { data: remitos, isLoading: loadingRemitos, error: errorRemitos } = useRemitosByRouteSheetId(routeSheetId);

  // Transformamos la hoja de ruta con la información de los demás hooks.
  const transformedRouteSheet = useMemo(() => {
    if (!routeSheet || !sucursales || !depositos || !bultos || !repartidores || !estados)
      return null;

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

    // Filtramos los bultos asociados a esta hoja de ruta (actual o en historial)
    const associatedBultos = bultos.filter(b => {
      const isCurrent = b.route_sheet_id === routeSheet.id;
      const isInHistory =
        b.historyRouteSheets &&
        Array.isArray(b.historyRouteSheets) &&
        b.historyRouteSheets.some((hist: any) =>
          hist.BultoRouteSheet && hist.BultoRouteSheet.route_sheet_id === routeSheet.id
        );
      return isCurrent || isInHistory;
    });

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
      // Si no hay remitos, se retorna un arreglo vacío.
      remitos: remitos || [],
    };
  }, [routeSheet, sucursales, depositos, bultos, repartidores, estados, remitos]);

  // Ahora, usamos useQueries a nivel superior para cada bulto, siempre y cuando transformedRouteSheet exista.
  const qrQueries = useQueries({
    queries: transformedRouteSheet?.bultos?.map((bulto: any) => ({
      queryKey: ["qrcode", bulto.codigo],
      queryFn: () => getQRCodeById(bulto.codigo),
      enabled: !!bulto.codigo,
    })) || [],
  });

  // Calculamos el recuento por tipo de bulto, comparando el tipo_bulto_id obtenido del QR
  // con la lista de tiposBultos para obtener el nombre.
  const bultosCountByTipo = useMemo(() => {
    const counts: Record<string, number> = {};
    qrQueries.forEach((query) => {
      if (query.data) {
        const tipoBultoId = query.data.tipo_bulto_id;
        const tipo = tiposBultos?.find((t) => t.id === tipoBultoId);
        if (tipo && tipo.nombre) {
          counts[tipo.nombre] = (counts[tipo.nombre] || 0) + 1;
        }
      }
    });
    return counts;
  }, [qrQueries, tiposBultos]);

  return {
    transformedRouteSheet: transformedRouteSheet ? { ...transformedRouteSheet, bultosCountByTipo } : null,
    loading:
      loadingRS ||
      loadingSuc ||
      loadingDepo ||
      loadingBulto ||
      loadingRep ||
      loadingEstados ||
      loadingTipoBulto ||
      loadingRemitos,
    error:
      errorRS ||
      errorSuc ||
      errorDepo ||
      errorBulto ||
      errorRep ||
      errorEstado ||
      errorTipobulto ||
      errorRemitos,
  };
};

export default useTransformedRouteSheet;
