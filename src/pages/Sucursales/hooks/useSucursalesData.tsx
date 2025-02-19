import useSucursales from "@/api/sucursal/hooks/useSucursales";
import { Sucursal } from "@/api/sucursal/types/sucursal.types";
import { ColumnName } from "@/components/common/table/types/table";

const useSucursalesData = () => {
  const { data, isLoading, error } = useSucursales();

  // Garantizamos que sucursales siempre sea un array
  const sucursales: Sucursal[] = data ?? [];

  // Definición de columnas para la tabla de sucursales
  const columnNames: ColumnName[] = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "direccion", label: "Dirección" },
    { key: "telefono", label: "Teléfono", opcional: true },
  ];

  return { sucursales, isLoading, error, columnNames };
};

export default useSucursalesData;
