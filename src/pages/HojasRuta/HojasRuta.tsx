// HojasRutaContainer.tsx
import TablaGenerica from "@/components/common/table/table";
import { ColumnName } from "@/components/common/table/types/table";
import { useTransformedRouteSheets } from "./hooks/useTransformedData";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import FullScreenLoader from "@/components/common/loader/FSLoader";

const columnNames: ColumnName[] = [
  { key: "codigo", label: "Código", opcional: false },
  // Puedes reemplazar "estado_id" por "estadoDisplay" para mostrar el estado transformado
  { key: "estadoDisplay", label: "Estado", opcional: true },
  { key: "deposito", label: "Deposito", opcional: false },
  { key: "repartidor", label: "Repartidor", opcional: false },
  { key: "sucursal", label: "Sucursal", opcional: false },
  // Para la fecha, podrías usar "displayDate" y formatearla con tu utilidad en la tabla
  { key: "displayDate", label: "Fecha de Creacion", opcional: true },
  // Si deseas mostrar el recuento de bultos
  { key: "bultosCount", label: "Bultos", opcional: false },
];

const HojasRutaContainer = () => {
  const { transformedData, loading, error } = useTransformedRouteSheets();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <div>Error al cargar datos.</div>;
  }

  return (
    <div className="p-4 pt-0 h-full flex-grow">
      <TablaGenerica<RouteSheet> data={transformedData} columnNames={columnNames} />
    </div>
  );
};

export default HojasRutaContainer;
