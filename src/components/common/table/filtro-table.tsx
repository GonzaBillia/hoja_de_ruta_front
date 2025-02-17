import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FiltroTabla({ table }: { table: any }) {
  const [selectedColumn, setSelectedColumn] = useState<string>(
    table.getAllColumns().find((col: any) => col.getCanFilter())?.id || ""
  );

  const column = table.getColumn(selectedColumn);
  // Extraemos el label de la columna; si no está definido, usamos el id
  const columnLabel = (column?.columnDef.label as string) || selectedColumn;

  const handleColumnChange = (columnId: string) => {
    if (columnId !== selectedColumn) {
      table.getColumn(selectedColumn)?.setFilterValue(""); // Limpia el filtro de la columna anterior
      setSelectedColumn(columnId);
    }
  };

  if (!column || !column.getCanFilter()) {
    return null; // Retorna null si no hay una columna filtrable seleccionada
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={`Filtrar por ${columnLabel}...`}
        value={(column.getFilterValue() as string) ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
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
