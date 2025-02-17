// pages/RouteSheetDetail.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTransformedRouteSheet from "./hooks/useRouteSheetDetails";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import TablaGenerica from "@/components/common/table/table";
import { ColumnName } from "@/components/common/table/types/table";

const BultosName: ColumnName[] = [
  { key: "codigo", label: "Codigo QR", opcional: false },
];

const RouteSheetDetail: React.FC = () => {
  // Se espera que la URL tenga un parámetro "codigo"
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  // Hook para obtener y transformar los detalles de la hoja de ruta
  const { transformedRouteSheet, loading, error } = useTransformedRouteSheet(codigo!);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Error al cargar los detalles</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  if (!transformedRouteSheet) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">No se encontró la hoja de ruta</h2>
      </div>
    );
  }

  const routeSheet = transformedRouteSheet;

  return (
    <div className="p-4 flex-1">
      <Button variant="link" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft />
        Volver
      </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Detalle de la Hoja de Ruta: {routeSheet.codigo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Estado Actual:</strong>{" "}
                {routeSheet.estado || routeSheet.estado_id}
              </p>
              <p>
                <strong>Depósito:</strong>{" "}
                {routeSheet.deposito || routeSheet.deposito_id}
              </p>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {routeSheet.createdAtFormatted || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Repartidor a Cargo:</strong>{" "}
                {routeSheet.repartidor || routeSheet.repartidor_id}
              </p>
              <p>
                <strong>Sucursal de Destino:</strong>{" "}
                {routeSheet.sucursal || routeSheet.sucursal_id}
              </p>
              <p>
                <strong>Total de Bultos:</strong>{" "}
                {routeSheet.bultosCount ?? 0}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mt-4 space-y-2">
            <p>
              <strong>Fecha de Envío:</strong>{" "}
              {routeSheet.sentAtFormatted || "Pendiente"}
            </p>
            <p>
              <strong>Fecha de Recepción:</strong>{" "}
              {routeSheet.receivedAtFormatted || "Pendiente"}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <p><strong>Remitos Asociados:</strong></p>
          {routeSheet.remitos && routeSheet.remitos.length > 0 ? (
            <ul className="list-disc pl-5">
              {routeSheet.remitos.map((remito: any) => (
                <li key={remito.id}>{remito.external_id}</li>
              ))}
            </ul>
          ) : (
            <p>No hay remitos asignados.</p>
          )}
          </div>
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-3xl mx-auto mt-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Detalle de Bultos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TablaGenerica
            data={routeSheet.bultos}
            columnNames={BultosName}
            showActions={false}
            showFilter={false}
            showPagination={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteSheetDetail;
