export interface BultoRouteSheet {
  route_sheet_id: number;
  assigned_at: string | Date; // o Date, según cómo manejes las fechas
  active: boolean;
}

export interface Bulto {
  id: number;
  codigo: string;
  route_sheet_id: number;
  historyRouteSheets?: BultoRouteSheet[];
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
  