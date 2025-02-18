export interface Observation {
    id: number;
    route_sheet_id: number;
    sucursal_id: number;
    texto: string;
    created_at: Date | string;
    updated_at: Date | string;
  }
  
  export interface ObservationResponse {
    success: boolean;
    message: string;
    data: Observation | Observation[];
  }
  
  export interface CreateObservationPayload {
    route_sheet_id: number;
    sucursal_id: number;
    texto: string;
  }
  
  export interface UpdateObservationPayload {
    texto?: string;
  }
  