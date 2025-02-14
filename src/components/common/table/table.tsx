// TablaGenerica.tsx
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FiltroTabla from "./filtro-table";
import PaginacionTabla from "./paginacion-table";
import { ColumnName, TablaGenericaProps } from "./types/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
// Importa la utilidad para formatear fechas
import { formatDate } from "@/utils/formatDate";

function createColumns<T>(columnNames: ColumnName[]): ColumnDef<T>[] {
  return columnNames.map((columnName) => ({
    accessorKey: columnName.key,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnName.label}
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const cellValue = row.getValue(columnName.key);

      if (columnName.key === "created_at" && cellValue) {
        let dateValue: string | Date;
        if (typeof cellValue === "string" || cellValue instanceof Date) {
          dateValue = cellValue;
        } else {
          dateValue = String(cellValue);
        }
        return (
          <span className="pl-4 text-start block">
            {formatDate(dateValue)}
          </span>
        );
      }

      if (typeof cellValue === "number") {
        return (
          <span className="pl-4 text-start block">
            {cellValue.toLocaleString()}
          </span>
        );
      }
      if (typeof cellValue === "boolean") {
        return (
          <span className="pl-4 text-start block">
            {cellValue ? "Sí" : "No"}
          </span>
        );
      }
      if (typeof cellValue === "string") {
        return (
          <span className="pl-4 text-start block">
            {cellValue}
          </span>
        );
      }
      return <span className="pl-4 text-start block">N/A</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId);
      if (typeof cellValue === "number") {
        return cellValue === parseFloat(filterValue);
      }
      if (typeof cellValue === "string") {
        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      return false;
    },
    enableHiding: columnName.opcional ?? false,
  }));
}

export default function TablaGenerica<T>({
  data = [],
  columnNames,
  showActions = true,
  showFilter = true,
  showPagination = true,
}: TablaGenericaProps<T>) {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    Object.fromEntries(columnNames.map((col) => [col.key, true]))
  );

  const handleClick = (action: string, row: any) => {
    const { codigo } = row;
    if (action === "view") {
      navigate(`/detalle/${codigo}`);
    } else if (action === "edit") {
      navigate(`/editar/${codigo}`);
    }
  };

  const baseColumns = createColumns<T>(columnNames);
  const actionsColumn: ColumnDef<T> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div onClick={(e) => { e.stopPropagation(); }} onMouseDown={(e) => { e.stopPropagation(); }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0">
              <span className="sr-only">Opciones</span>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleClick("view", row.original);
              }}
            >
              Detalles
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleClick("edit", row.original);
              }}
            >
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  const columns: ColumnDef<T>[] = showActions
    ? [...baseColumns, actionsColumn]
    : baseColumns;

  const table = useReactTable<T>({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  });

  return (
    <div className="flex w-full h-full flex-grow">
      <div className="transition-all w-full h-full">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4 py-4">
          {showFilter && <FiltroTabla table={table} />}
          {showPagination && (
            <div className="hidden sm:block">
              <PaginacionTabla table={table} />
            </div>
          )}
        </div>
        <div className="rounded-md border w-full overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {showPagination && (
          <div className="block sm:hidden mt-4">
            <PaginacionTabla table={table} />
          </div>
        )}
      </div>
    </div>
  );
}
