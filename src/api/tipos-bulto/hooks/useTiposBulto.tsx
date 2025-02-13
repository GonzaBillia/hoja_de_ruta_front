import { useQuery } from "@tanstack/react-query";
import { getTiposBulto } from "../tiposBulto";
import { TipoBulto } from "../types/tiposBulto.types";

export const useTiposBultos = () => {
  return useQuery<TipoBulto[]>({
    queryKey: ["tiposBulto"],
    queryFn: getTiposBulto,
    // Puedes agregar opciones adicionales (staleTime, refetchInterval, etc.)
  });
};

export default useTiposBultos;
