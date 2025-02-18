import { useQuery } from "@tanstack/react-query";
import { getObservationsByRouteSheet } from "../observation";
import { Observation } from "../types/observation.types";

export const useObservationsByRouteSheet = (routeSheetId: number) => {
  return useQuery<Observation[]>({
    queryKey: ["observations", routeSheetId],
    queryFn: () => getObservationsByRouteSheet(routeSheetId),
    enabled: !!routeSheetId,
  });
};

export default useObservationsByRouteSheet;
