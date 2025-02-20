import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { deleteRole } from "../Role";

export const useDeleteRole = (id: number): UseMutationResult<
  { message: string },
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar el rol:", error);
    },
  });
};

export default useDeleteRole;
