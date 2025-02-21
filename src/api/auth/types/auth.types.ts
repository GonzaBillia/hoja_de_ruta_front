export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: {
    name?: string;
  };
  role_id: number;
  deposito_id: number;
  sucursal_id: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  role_id?: number;
  deposito_id?: number | null;
  sucursal_id?: number | null;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  data: User;
}

// Payload para registrar un usuario. 
// Para roles "deposito" y "sucursal" se requieren los respectivos IDs.
export interface RegisterUserPayload {
  username: string;
  email: string;
  password: string;
  role: string; // "superadmin", "deposito", "sucursal" o "repartidor"
  deposito_id?: number | null;
  sucursal_id?: number | null;
}