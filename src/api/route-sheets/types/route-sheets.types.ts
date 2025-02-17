import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";

export interface RouteSheet {
    id: number;
    codigo: string;
    estado_id?: number
    created_at: Date | string;
    sucursal_id: number;
    repartidor_id: number | null;
    created_by?: number;
    deposito_id?: number;
    sent_at?: string | null;
    received_at?: string | null;
    remitos?: string[];
    scannedQRCodes?: QrData[]
  }
  
  export interface PaginatedRouteSheets {
    data: RouteSheet[];
    meta: {
      page: number;
      last_page: number;
      total: number;
    };
  }
  

  export interface CreateRouteSheetPayload {
    // Datos de la hoja de ruta
    // Por ejemplo:
    sucursal_id: number;
    remito_id?: string | null;
    repartidor_id?: number;
    // ...otros campos que se envían al crear la hoja de ruta
    // Además, se espera un arreglo de códigos QR:
    scannedQRCodes: QrData[];
  }
  
  export interface UpdateRouteSheetPayload {
    // Campos a actualizar en la hoja de ruta
    // Por ejemplo:
    sucursal_id?: number;
    remito_id?: number | null;
    repartidor_id?: number;
    // Otros campos según la lógica del backend.
  }
  
  export interface UpdateRouteSheetStatePayload {
    estado_id: number;
    // Otros campos opcionales que requiera la actualización del estado.
  }