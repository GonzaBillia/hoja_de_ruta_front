"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExtendedBulto } from "@/pages/HojasRuta/components/ControlarhojaRuta"

interface TablaRouteSheetProps {
  data: ExtendedBulto[]
}

export default function TablaRouteSheets({ data }: TablaRouteSheetProps) {
  console.log(data)
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "codigo",
        header: "Código",
        cell: (info: any) => (
          <span className="pl-4 text-start block">{info.getValue()}</span>
        ),
      },
      {
        // En lugar de usar accessorKey "recibido", usamos un accessorFn que obtiene el estado del registro activo
        accessorKey: "actualRecibido",
        header: "Escaneado",
        cell: (info: any) => (
          <span className="pl-4 text-center block">
            {info.getValue() ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <X size={16} className="text-red-600" />
            )}
          </span>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}
