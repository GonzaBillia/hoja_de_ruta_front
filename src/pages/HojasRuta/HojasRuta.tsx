import TablaGenerica from "@/components/common/table/table"
import { ColumnName } from "@/components/common/table/types/table";
import { RowData } from "./types/RowData";

const data: RowData[] = [
    { id: "00001", bultos: "10", repartidor: 1, fechaCreacion: "10/02/2025", estado: "Creado" },
  ]
  
  const columnNames: ColumnName[] = [
    { key: "id", label: "ID", opcional: false },
    { key: "bultos", label: "Bultos", opcional: false },
    { key: "repartidor", label: "Repartidor", opcional: false },
    { key: "fechaCreacion", label: "Fecha de Creacion", opcional: true },
    { key: "estado", label: "Estado", opcional: true }
  ];

const HojasRuta = () => {
  return (
    <div className="p-4 pt-0 h-full flex-grow">
        <TablaGenerica data={data} columnNames={columnNames} />
    </div>
  )
}

export default HojasRuta