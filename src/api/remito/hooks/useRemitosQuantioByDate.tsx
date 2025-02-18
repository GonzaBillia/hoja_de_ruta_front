import { useQuery } from '@tanstack/react-query';
import { getRemitosQuantioByDate } from '../remito';

export const useRemitosQuantioByDate = (date: Date | string) => {
  return useQuery<any[]>({
    queryKey: ['remitosQuantio', date],
    queryFn: () => getRemitosQuantioByDate(date),
    // Puedes configurar opciones adicionales si lo necesitas.
  });
};

export default useRemitosQuantioByDate;
