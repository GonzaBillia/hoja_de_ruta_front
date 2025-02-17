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
          name: string;
        };
        role_id: number;
        deposito_id: number;
        sucursal_id: number | null;
        created_at: string;
        updated_at: string;
      }
      
      