import { useQuery } from '@tanstack/react-query';
import { getAllBultos } from '../bulto';
import { Bulto } from '../types/bulto.types';

export const useBultos = () => {
  return useQuery<Bulto[]>({
    queryKey: ['bultos'],
    queryFn: getAllBultos,
  });
};

export default useBultos;
