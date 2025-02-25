import { useQuery } from '@tanstack/react-query';
import { getBultoByCode } from '../bulto';
import { Bulto } from '../types/bulto.types';

export const useBultoByCode = (code: string) => {
  return useQuery<Bulto | null>({
    queryKey: ['bulto', 'code', code],
    queryFn: () => getBultoByCode(code),
    enabled: !!code,
  });
};

export default useBultoByCode;
