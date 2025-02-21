import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function FiltroTabla({ table }: { table: any }) {
  // Inicializa la columna seleccionada con la primera columna filtrable
  const [selectedColumn, setSelectedColumn] = useState<string>(
    table.getAllColumns().find((col: any) => col.getCanFilter())?.id || ""
  );

  // Obtenemos la columna actual y su label
  const column = table.getColumn(selectedColumn);
  const columnLabel = (column?.columnDef.label as string) || selectedColumn;

  // Estado local para el valor del filtro
  const [filterInput, setFilterInput] = useState<string>("");

  // Cuando cambia la columna seleccionada, actualizamos el estado local con el valor del filtro actual de esa columna
  useEffect(() => {
    const currentValue = table.getColumn(selectedColumn)?.getFilterValue() as string;
    setFilterInput(currentValue || "");
  }, [selectedColumn, table]);

  const handleColumnChange = (columnId: string) => {
    if (columnId !== selectedColumn) {
      // Limpia el filtro de la columna anterior
      table.getColumn(selectedColumn)?.setFilterValue("");
      setSelectedColumn(columnId);
    }
  };

  if (!column || !column.getCanFilter()) {
    return null; // No se muestra si la columna seleccionada no es filtrable
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={`Filtrar por ${columnLabel}...`}
        value={filterInput}
        onChange={(e) => {
          const newVal = e.target.value;
          setFilterInput(newVal);
          column.setFilterValue(newVal);
        }}
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Columna <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {table.getAllColumns().map((col: any) =>
            col.getCanFilter() && (
              <DropdownMenuItem
                key={col.id}
                onClick={() => handleColumnChange(col.id)}
              >
                {col.columnDef.label || col.id}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
