export interface Repartidor {
    id: number;
    username: string;
    email: string;
    role_id: number;
    deposito_id: number | null;
    sucursal_id: number | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface RepartidoresResponse {
    success: boolean;
    message: string;
    data: Repartidor[];
  }