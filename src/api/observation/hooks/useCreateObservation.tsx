import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { createObservation } from "../observation";
import { CreateObservationPayload, Observation } from "../types/observation.types";

export const useCreateObservation = (): UseMutationResult<
  Observation,
  unknown,
  CreateObservationPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createObservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observations"] });
    },
    onError: (error: unknown) => {
      console.error("Error al crear observación:", error);
    },
  });
};

export default useCreateObservation;
