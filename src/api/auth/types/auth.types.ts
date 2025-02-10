export interface LoginCredentials {
    email: string;
    password: string;
    }
    
    export interface LoginResponse {
    success: boolean;
    }
    
    export interface User {
        id: number;
        name: string;
        email: string;
        role: string;
    }
      