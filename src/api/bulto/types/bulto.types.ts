export interface Bulto {
    id: number;
    codigo: string;
    route_sheet_id: number;
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
  