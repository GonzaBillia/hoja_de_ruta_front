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

  // Definición de columnas, usando el label dinámico para la columna de fecha
  const columnNames: ColumnName[] = useMemo(() => {
    return [
      { key: "codigo", label: "Código", opcional: false },
      { key: "estadoDisplay", label: "Estado", opcional: true },
      { key: "deposito", label: "Deposito", opcional: false },
      { key: "repartidor", label: "Repartidor", opcional: false },
      { key: "sucursal", label: "Sucursal", opcional: false },
      { key: "displayDate", label: "Fecha de Modificacion", opcional: true },
      { key: "bultosCount", label: "Bultos", opcional: false },
    ];
  }, []);

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
        showFilter={true}
        onPageChange={setPage}
      />
    </div>
  );
};

export default HojasRutaContainer;
