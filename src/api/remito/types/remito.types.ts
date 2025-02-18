// src/api/remito/remito.types.ts
export interface Remito {
    id: number;
    external_id: string;
    routesheet_id?: number; // Opcional, según si se asigna después
    createdAt?: string;
    updatedAt?: string;
  }

export interface RemitoQuantio {
  CliApeNom?: string;
  // Propiedad para identificar el QR (se usa en el key y comparación)
  Numero: string;
}
  