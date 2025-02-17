// HojasRutaContainer.tsx
import { useState, useMemo } from "react";
import TablaGenerica from "@/components/common/table/table";
import { ColumnName } from "@/components/common/table/types/table";
import { useTransformedRouteSheets } from "./hooks/useTransformedData";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import FullScreenLoader from "@/components/common/loader/FSLoader";

const HojasRutaContainer = () => {
  // Estado para la paginación: página actual y límite
  const [page, setPage] = useState(1);
  const limit = 10;

  const { transformedData, meta, loading, error } = useTransformedRouteSheets(page, limit);

  // Determinar el label de la fecha según el tipo prioritario (Recepción > Envío > Creación)
  const dateLabel = useMemo(() => {
    if (!transformedData.length) return "Fecha de Creación"; // valor por defecto
    const row = transformedData.find(
      (row) => row.displayDateType && row.displayDateType !== "N/A"
    );
    if (row) {
      if (row.displayDateType === "Recepción") return "Fecha de Recepción";
      if (row.displayDateType === "Envío") return "Fecha de Envío";
      if (row.displayDateType === "Creación") return "Fecha de Creación";
    }
    return "Fecha de Creación";
  }, [transformedData]);

  // Definición de columnas, usando el label dinámico para la columna de fecha
  const columnNames: ColumnName[] = useMemo(() => {
    return [
      { key: "codigo", label: "Código", opcional: false },
      { key: "estadoDisplay", label: "Estado", opcional: true },
      { key: "deposito", label: "Deposito", opcional: false },
      { key: "repartidor", label: "Repartidor", opcional: false },
      { key: "sucursal", label: "Sucursal", opcional: false },
      { key: "displayDate", label: dateLabel, opcional: true },
      { key: "bultosCount", label: "Bultos", opcional: false },
    ];
  }, [dateLabel]);

  if (loading) {
    return <FullScreenLoader />;
  }
  if (error) {
    return <div>Error al cargar datos.</div>;
  }

  return (
    <div className="p-4 pt-0 h-full flex-grow">
      <TablaGenerica<RouteSheet>
        data={transformedData}
        columnNames={columnNames}
        showPagination={true}
        manualPagination={true}
        pageCount={meta?.last_page || 1}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default HojasRutaContainer;
