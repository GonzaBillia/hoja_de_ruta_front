export type RowData = {
  id: string
  estado: string
  bultos: string
  deposito: number
  repartidor: number
  sucursal: number
  fechaCreacion: string
  fechaEnvio: string | null
  fechaRecibidoIncompleto: string | null
  fechaRecibido: string | null
}