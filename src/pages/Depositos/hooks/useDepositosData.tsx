import useDepositos from "@/api/deposito/hooks/useDepositos";
import { Deposito } from "@/api/deposito/types/deposito.types";
import { ColumnName } from "@/components/common/table/types/table";

const useDepositosData = () => {
  const { data, isLoading, error } = useDepositos();

  // Garantizamos que depositos siempre sea un array:
  // Si data es un arreglo, se usa tal cual;
  // si data es un objeto, se convierte a arreglo;
  // y en caso de no haber data se retorna un arreglo vacío.
  let depositos: Deposito[] = [];
  if (data) {
    depositos = Array.isArray(data) ? data : [data];
  }

  // Definición de columnas para la tabla de depositos
  const columnNames: ColumnName[] = [
    { key: "id", label: "ID" },
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    { key: "ubicacion", label: "Ubicación", opcional: true },
  ];

  return { depositos, isLoading, error, columnNames };
};

export default useDepositosData;
