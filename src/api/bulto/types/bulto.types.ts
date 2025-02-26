export interface BultoRouteSheetAttributes {
  route_sheet_id: number;
  assigned_at: string | Date;
  active: boolean;
  received?: boolean;
  delivered_at?: string | Date;
}

export interface BultoHistoryItem {
  BultoRouteSheet: BultoRouteSheetAttributes;
}

export interface Bulto {
  id: number;
  codigo: string;
  route_sheet_id: number;
  historyRouteSheets?: BultoHistoryItem[];
}


  export interface BultoResponse {
    success: boolean;
    message: string;
    data: Bulto | Bulto[];
  }
  
  export interface CreateBultoPayload {
    tipo: string;
    codigo: string;
    route_sheet_id: number;
  }
  
  export interface UpdateBultoPayload {
    tipo?: string;
    codigo?: string;
    route_sheet_id?: number;
  }
  
  export interface UpdateBatchBultoPayload {
    codigo: string;
    recibido: boolean;
  }
  