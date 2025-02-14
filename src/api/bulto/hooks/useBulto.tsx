import { useQuery } from '@tanstack/react-query';
import { getBulto } from '../bulto';
import { Bulto } from '../types/bulto.types';

export const useBulto = (id: number) => {
  return useQuery<Bulto>({
    queryKey: ['bulto', id],
    queryFn: () => getBulto(id),
    enabled: !!id,
  });
};

export default useBulto;
