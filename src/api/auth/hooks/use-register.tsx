import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { registerUser } from "../auth";
import { RegisterUserPayload, User } from "../types/auth.types";

export const useRegisterUser = (): UseMutationResult<User, unknown, RegisterUserPayload, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Invalida la query de usuarios para refrescar la lista, si es que se utiliza.
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      console.error("Error al registrar usuario:", error);
    },
  });
};

export default useRegisterUser;
