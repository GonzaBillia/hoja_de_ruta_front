export interface Estado {
    id: number;
    nombre: string;
  }
  
  export interface EstadoResponse {
    success: boolean;
    message: string;
    data: Estado | Estado[];
  }
  
  export interface CreateEstadoPayload {
    nombre: string;
  }
  
  export interface UpdateEstadoPayload {
    nombre?: string;
  }
  