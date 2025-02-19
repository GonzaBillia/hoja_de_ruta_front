import { useState, useEffect } from "react";
import useObservationsByRouteSheet from "@/api/observation/hooks/useObservationsByRouteSheet";
import useRouteSheet from "@/api/route-sheets/hooks/useRouteSheet";
import { Observation } from "@/api/observation/types/observation.types";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";

const useRouteSheetObservationsData = (routeSheetId: number) => {
  const { data: observationsData, isLoading: isObservationsLoading, error: observationsError } =
    useObservationsByRouteSheet(routeSheetId);
  const { data: routeSheetData, isLoading: isRouteSheetLoading, error: routeSheetError } =
    useRouteSheet(routeSheetId);

  const [observations, setObservations] = useState<Observation[]>([]);
  const [routeSheet, setRouteSheet] = useState<RouteSheet | null>(null);

  // Reiniciamos observaciones y routeSheet cuando cambia el routeSheetId
  useEffect(() => {
    setObservations([]);
    setRouteSheet(null);
  }, [routeSheetId]);

  // Actualizamos las observaciones y, si no hay ninguna, descartamos la route sheet
  useEffect(() => {
    if (!isObservationsLoading && !observationsError) {
      if (observationsData && observationsData.length > 0) {
        setObservations(observationsData);
      } else {
        setObservations([]);
        setRouteSheet(null);
      }
    }
  }, [observationsData, isObservationsLoading, observationsError]);

  // Solo actualizamos la route sheet si hay observaciones
  useEffect(() => {
    if (!isRouteSheetLoading && !routeSheetError) {
      if (observationsData && observationsData.length > 0) {
        setRouteSheet(routeSheetData ?? null);
      } else {
        setRouteSheet(null);
      }
    }
  }, [routeSheetData, isRouteSheetLoading, routeSheetError, observationsData]);

  return {
    observations,
    routeSheet,
    isLoading: isObservationsLoading || isRouteSheetLoading,
    error: observationsError || routeSheetError,
  };
};

export default useRouteSheetObservationsData;
