import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { createRole } from "../Role";
import { CreateRolePayload, Role } from "../types/role.types";

export const useCreateRole = (): UseMutationResult<
  Role,
  unknown,
  CreateRolePayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear el rol:", error);
    },
  });
};

export default useCreateRole;
