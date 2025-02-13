import { useQuery } from '@tanstack/react-query';
import { getRemitosQuantio } from '../remito';

export const useRemitosQuantio = () => {
  return useQuery<any[]>({
    queryKey: ['remitosQuantio'],
    queryFn: getRemitosQuantio,
    // Puedes configurar opciones adicionales si lo necesitas.
  });
};

export default useRemitosQuantio;
