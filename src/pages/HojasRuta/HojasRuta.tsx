// HojasRutaContainer.tsx
import { useState, useMemo } from "react";
import TablaGenerica from "@/components/common/table/table";
import { ColumnName } from "@/components/common/table/types/table";
import { useTransformedRouteSheets } from "./hooks/useTransformedData";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import { useAuth } from "@/components/context/auth-context"; // Asegúrate de tener el contexto configurado

const HojasRutaContainer = () => {
  // Estado para la paginación: página actual y límite
  const [page, setPage] = useState(1);
  const limit = 10;

  const { transformedData, meta, loading, error } = useTransformedRouteSheets(page, limit);
  const { user } = useAuth();

  // Filtrar los datos según el rol del usuario
  const filteredData = useMemo(() => {
    if (!user) return transformedData;

    // Si es superadmin, se muestran todos los registros
    if (user.role.name === "superadmin") return transformedData;

    // Filtrado para el rol "deposito" por depósito_id
    if (user.role.name === "deposito") {
      return transformedData.filter((item) => item.deposito_id === user.deposito_id);
    }

    // Filtrado para el rol "sucursal" por sucursal_id
    if (user.role.name === "sucursal") {
      return transformedData.filter((item) => item.sucursal_id === user.sucursal_id);
    }

    // Filtrado para el rol "repartidor" por el id del usuario (suponiendo que en transformedData existe repartidor_id)
    if (user.role.name === "repartidor") {
      return transformedData.filter((item) => item.repartidor_id === user.id);
    }

    // En caso de que no coincida ningún rol, retorna los datos sin filtrar
    return transformedData;
  }, [transformedData, user]);

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
        data={filteredData}
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
