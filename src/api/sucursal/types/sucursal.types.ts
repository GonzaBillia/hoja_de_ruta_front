export interface Sucursal {
    id: number;
    nombre: string;
    direccion: string;
    telefono?: string;
    codigo?: string;
  }
  
  export interface SucursalResponse {
    success: boolean;
    message: string;
    data: Sucursal | Sucursal[];
  }
  
  export interface CreateSucursalPayload {
    nombre: string;
    direccion: string;
    telefono?: string;
    codigo?: string;
  }
  
  export interface UpdateSucursalPayload {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    codigo?: string;
  }