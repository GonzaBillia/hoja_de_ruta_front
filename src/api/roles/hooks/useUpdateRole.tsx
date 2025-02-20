import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { updateRole } from "../Role";
import { UpdateRolePayload, Role } from "../types/role.types";

export const useUpdateRole = (id: number): UseMutationResult<
  Role,
  unknown,
  UpdateRolePayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRolePayload) => updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar el rol:", error);
    },
  });
};

export default useUpdateRole;
