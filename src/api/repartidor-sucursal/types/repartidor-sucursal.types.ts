export interface RepartidorSucursal {
    user_id: number;
    sucursal_id: number;
    // Puedes incluir otros campos si el backend los devuelve.
  }
  
  export interface CreateRepartidorSucursalPayload {
    user_id: number;
    sucursal_id: number;
  }
  