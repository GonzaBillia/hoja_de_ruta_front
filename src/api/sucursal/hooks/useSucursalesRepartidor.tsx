// hooks/useSucursalesByRepartidor.ts
import { useQuery } from "@tanstack/react-query";
import { getSucursalesByRepartidor } from "../sucursal";// Ajusta la ruta según tu estructura
import { Sucursal } from "../types/sucursal.types";

export const useSucursalesByRepartidor = (id: number) => {
    return useQuery<Sucursal[]>({
      queryKey: ['sucursales', id],
      queryFn: () => getSucursalesByRepartidor(id),
      enabled: !!id, // Se ejecuta solo si id es válido.
    });
  };
