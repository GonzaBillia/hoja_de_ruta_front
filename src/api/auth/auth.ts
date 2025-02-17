// src/api/auth.js
import apiClient from '../apiClient.ts';
import { LoginCredentials, LoginResponse, User } from './types/auth.types.ts';


export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
// El backend debe enviar la cookie httpOnly automáticamente
return response.data;
};

export const logout = async (): Promise<{ success: boolean }> => {
const response = await apiClient.post<{ success: boolean }>('/api/auth/logout');
return response.data;
};

export const fetchCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/api/auth/me', { withCredentials: true });
        console.log(response.data.data)
        return response.data.data.user ?? null;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return null; // Usuario no autenticado
        }
        throw error; // Otros errores se manejan normalmente
    }
};