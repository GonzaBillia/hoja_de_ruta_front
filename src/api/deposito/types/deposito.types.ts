export interface Deposito {
    id: number;
    codigo: string;
    nombre: string;
    ubicacion?: string;
  }
  
  export interface DepositoResponse {
    success: boolean;
    message: string;
    data: Deposito | Deposito[];
  }
  
  export interface CreateDepositoPayload {
    codigo: string;
    nombre: string;
    ubicacion?: string;
  }
  
  export interface UpdateDepositoPayload {
    codigo?: string;
    nombre?: string;
    ubicacion?: string;
  }
  