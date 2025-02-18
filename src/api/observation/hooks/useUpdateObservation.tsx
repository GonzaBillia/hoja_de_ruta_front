import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { updateObservation } from "../observation";
import { UpdateObservationPayload, Observation } from "../types/observation.types";

export const useUpdateObservation = (id: number): UseMutationResult<
  Observation,
  unknown,
  UpdateObservationPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateObservationPayload) => updateObservation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observation", id] });
      queryClient.invalidateQueries({ queryKey: ["observations"] });
    },
    onError: (error: unknown) => {
      console.error("Error al actualizar observación:", error);
    },
  });
};

export default useUpdateObservation;
