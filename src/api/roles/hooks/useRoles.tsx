import { useQuery } from '@tanstack/react-query';
import { getAllRoles } from '../role';
import { Role } from "../types/role.types";

export const useRoles = () => {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: getAllRoles,
  });
};

export default useRoles;
