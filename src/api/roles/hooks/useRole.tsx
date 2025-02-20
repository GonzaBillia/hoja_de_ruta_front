import { useQuery } from '@tanstack/react-query';
import { getRole } from "../Role";
import { Role } from "../types/role.types";

export const useRole = (id: number) => {
  return useQuery<Role>({
    queryKey: ['role', id],
    queryFn: () => getRole(id),
    enabled: !!id,
  });
};

export default useRole;
