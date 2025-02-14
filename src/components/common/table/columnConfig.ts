import { ColumnName } from "./types/table";

export const routeSheetCreated: ColumnName[] = [
  { key: "codigo", label: "ID", opcional: false },
  { key: "estado_id", label: "Estado", opcional: false },
  { key: "bultos", label: "Bultos", opcional: false },
  { key: "deposito_id", label: "Deposito", opcional: false },
  { key: "repartidor_id", label: "Repartidor", opcional: false },
  { key: "sucursal_id", label: "Sucursal", opcional: false },
  { key: "created_at", label: "Fecha de Creacion", opcional: true },
];

export const routeSheetSended: ColumnName[] = [
    { key: "codigo", label: "ID", opcional: false },
    { key: "estado_id", label: "Estado", opcional: false },
    { key: "bultos", label: "Bultos", opcional: false },
    { key: "deposito_id", label: "Deposito", opcional: false },
    { key: "repartidor_id", label: "Repartidor", opcional: false },
    { key: "sucursal_id", label: "Sucursal", opcional: false },
    { key: "sent_at", label: "Fecha de Envío", opcional: true },
  ];

  export const routeSheetREceived: ColumnName[] = [
    { key: "codigo", label: "ID", opcional: false },
    { key: "estado_id", label: "Estado", opcional: false },
    { key: "bultos", label: "Bultos", opcional: false },
    { key: "deposito_id", label: "Deposito", opcional: false },
    { key: "repartidor_id", label: "Repartidor", opcional: false },
    { key: "sucursal_id", label: "Sucursal", opcional: false },
    { key: "received_at", label: "Fecha de Recepción", opcional: true },
  ];