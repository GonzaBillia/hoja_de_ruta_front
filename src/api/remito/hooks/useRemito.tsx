import { useQuery } from '@tanstack/react-query';
import { getRemitoById } from '../remito';
import { Remito } from '../types/remito.types';

export const useRemito = (id: number) => {
  return useQuery<Remito>({
    queryKey: ['remito', id],
    queryFn: () => getRemitoById(id),
    // Puedes agregar otras opciones aquí.
  });
};

export default useRemito;
