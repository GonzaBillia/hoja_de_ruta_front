import React, { useState, useMemo } from "react";
import useRouteSheetsByDeposito from "@/api/route-sheets/hooks/useRouteSheetbyDeposito";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import RouteSheetObservations from "./RouteSheetObservations";
import SucursalFilter from "./SucursalFilter";
import DateFilter from "./DateFilter";

interface ObservacionesContentProps {
  user: {
    deposito_id: number;
    // Puedes extender el tipo de usuario según necesites
  };
}

const ObservacionesContent: React.FC<ObservacionesContentProps> = ({ user }) => {
  const depositoId = user.deposito_id;
  
  const { data: routeSheets, isLoading: sheetsLoading, error: sheetsError } =
    useRouteSheetsByDeposito(depositoId);

  // "all" es el valor por defecto para no filtrar por sucursal
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  // Usamos un Date o undefined para el filtro de fecha
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Calculamos las sucursales disponibles a partir de los routeSheets
  const sucursales = useMemo(() => {
    if (!routeSheets) return [];
    return Array.from(new Set(routeSheets.map((sheet: RouteSheet) => sheet.sucursal_id)));
  }, [routeSheets]);

  // Filtramos los routeSheets según los filtros seleccionados
  const filteredRouteSheets = useMemo(() => {
    if (!routeSheets) return [];
    return routeSheets.filter((sheet: RouteSheet) => {
      const matchesSucursal =
        selectedSucursal !== "all"
          ? sheet.sucursal_id === Number(selectedSucursal)
          : true;
      const matchesDate = selectedDate
        ? new Date(sheet.created_at).toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0]
        : true;
      return matchesSucursal && matchesDate;
    });
  }, [routeSheets, selectedSucursal, selectedDate]);

  let content = null;
  if (sheetsLoading) {
    content = <FullScreenLoader />;
  } else if (sheetsError) {
    content = <div>Ocurrió un error: {sheetsError.message}</div>;
  } else {
    content = (
      <div>
        <h2 className="mb-4 text-xl font-semibold">Observaciones</h2>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
          <SucursalFilter
            value={selectedSucursal}
            onChange={setSelectedSucursal}
            options={sucursales}
          />
          <DateFilter
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        {filteredRouteSheets && filteredRouteSheets.length > 0 ? (
          filteredRouteSheets.map((sheet: RouteSheet) =>
            sheet ? (
              <RouteSheetObservations key={sheet.id} sheet={sheet} />
            ) : (
              <div key="null-sheet">RouteSheet nula</div>
            )
          )
        ) : (
          <div>No se encontraron route sheets con los filtros seleccionados.</div>
        )}
      </div>
    );
  }

  return <div className="p-4">{content}</div>;
};

export default ObservacionesContent;
