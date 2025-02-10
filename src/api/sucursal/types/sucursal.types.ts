export interface Sucursal {
    id: number;
    nombre: string;
    direccion: string;
    telefono?: string;
    // Agrega otros campos si es necesario.
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
  }
  
  export interface UpdateSucursalPayload {
    nombre?: string;
    direccion?: string;
    telefono?: string;
  }