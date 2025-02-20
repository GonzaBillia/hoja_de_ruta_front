import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { updateUser } from "../auth";
import { UpdateUserPayload, User } from "../types/auth.types";

export const useUpdateUser = (id: number): UseMutationResult<User, unknown, UpdateUserPayload, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar el usuario:", error);
    },
  });
};

export default useUpdateUser;
