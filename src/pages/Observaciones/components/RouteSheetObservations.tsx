import React from "react";
import useRouteSheetObservationsData from "../hooks/useObservationRouteSheetData"; // Ajusta la ruta según corresponda
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import useEstados from "@/api/estado/hooks/useEstados";
import { Link } from "react-router-dom";

interface RouteSheetObservationsProps {
  sheet: RouteSheet;
}

const RouteSheetObservations: React.FC<RouteSheetObservationsProps> = ({ sheet }) => {
  const { observations, routeSheet, isLoading, error } = useRouteSheetObservationsData(sheet.id);
  const { data: estados, isLoading: loadEstados, error: errorEstados } = useEstados()

  // Si se está cargando, mostramos el loader
  if (isLoading || loadEstados) {
    return <FullScreenLoader />;
  }

  // Si hay error, lo mostramos (o podrías retornar null)
  if (error || errorEstados) {
    return <div>Error: {error?.message}</div>;
  }

  // Si no hay routeSheet (es decir, no hay observaciones asociadas), no renderizamos nada
  if (!routeSheet || observations.length === 0) {
    return null;
  }

  // Buscamos el estado correspondiente por su id
  const estadoObj = estados?.find((estado: any) => estado.id === routeSheet.estado_id);

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row justify-between items-center mt-0">
        <CardTitle className="flex ">
          <Link to={`/detalle/${routeSheet.codigo}`}>
            <span className="hover:underline">{routeSheet.codigo}</span>
          </Link>
        </CardTitle>
        <span className="!mt-0">Estado: <strong className="capitalize">{estadoObj ? estadoObj.nombre : routeSheet.estado_id}</strong></span>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        {observations && observations.length > 0 ? (
          <ul className="">
            {observations.map((obs) => (
              <li key={obs.id} className="flex justify-between">
                <span>{obs.texto}</span>
                <span className="text-muted-foreground">
                  {(obs.updated_at ? new Date(obs.updated_at) : new Date(obs.created_at)).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay observaciones.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteSheetObservations;
