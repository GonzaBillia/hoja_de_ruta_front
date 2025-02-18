import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { deleteObservation } from "../observation";

export const useDeleteObservation = (id: number): UseMutationResult<
  { message: string },
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteObservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observations"] });
    },
    onError: (error: unknown) => {
      console.error("Error al eliminar observación:", error);
    },
  });
};

export default useDeleteObservation;
