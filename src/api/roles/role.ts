import apiClient from "../apiClient";
import { 
  CreateRolePayload, 
  Role, 
  RoleResponse, 
  UpdateRolePayload 
} from "./types/role.types";

// Obtener todos los roles
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await apiClient.get<RoleResponse>("/api/role");
  // Se espera que la respuesta tenga data con un arreglo de roles.
  return response.data.data as Role[];
};

// Obtener un rol por ID
export const getRole = async (id: number): Promise<Role> => {
  const response = await apiClient.get<RoleResponse>(`/api/role/${id}`);
  return response.data.data as Role;
};

// Crear un rol
export const createRole = async (
  payload: CreateRolePayload
): Promise<Role> => {
  const response = await apiClient.post<RoleResponse>("/api/role", payload);
  return response.data.data as Role;
};

// Actualizar un rol
export const updateRole = async (
  id: number,
  payload: UpdateRolePayload
): Promise<Role> => {
  const response = await apiClient.put<RoleResponse>(`/api/role/${id}`, payload);
  return response.data.data as Role;
};

// Eliminar un rol
export const deleteRole = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ success: boolean; data: { message: string } }>(`/api/role/${id}`);
  return response.data.data;
};
