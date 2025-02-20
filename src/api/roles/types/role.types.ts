export interface Role {
    id: number;
    name: string;
  }
  
  export interface RoleResponse {
    success: boolean;
    message: string;
    data: Role | Role[];
  }
  
  export interface CreateRolePayload {
    name: string;
  }
  
  export interface UpdateRolePayload {
    name?: string;
  }
  