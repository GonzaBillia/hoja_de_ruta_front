import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { deleteUser } from "../auth";

export const useDeleteUser = (id: number): UseMutationResult<{ message: string }, unknown, void, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar el usuario:", error);
    },
  });
};

export default useDeleteUser;
