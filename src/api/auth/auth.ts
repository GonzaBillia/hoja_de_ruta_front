// src/api/auth.js
import apiClient from '../apiClient.ts';
import { LoginCredentials, LoginResponse, RegisterUserPayload, RegisterUserResponse, UpdateUserPayload, User } from './types/auth.types.ts';

export const registerUser = async (
    payload: RegisterUserPayload
  ): Promise<User> => {
    const response = await apiClient.post<RegisterUserResponse>("/api/auth/register", payload);
    return response.data.data as User;
  };

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<{ data: User[] }>("/api/auth");
    return response.data.data;
  };

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
        return response.data.data.user ?? null;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return null; // Usuario no autenticado
        }
        throw error; // Otros errores se manejan normalmente
    }
};

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<User> => {
    const response = await apiClient.put<{ data: User }>(`/api/auth/${id}`, payload);
    return response.data.data as User;
  };

export const deleteUser = async (
id: number
): Promise<{ message: string }> => {
const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/auth/${id}`);
return response.data.data;
};