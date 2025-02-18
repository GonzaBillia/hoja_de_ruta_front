import { useQuery } from "@tanstack/react-query";
import { getObservation } from "../observation";
import { Observation } from "../types/observation.types";

export const useObservation = (id: number) => {
  return useQuery<Observation>({
    queryKey: ["observation", id],
    queryFn: () => getObservation(id),
    enabled: !!id,
  });
};

export default useObservation;
