// src/hooks/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/api/auth/auth';
import { User } from '../types/auth.types';

const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false,        // No reintenta la consulta si falla
    staleTime: Infinity, // Los datos se consideran frescos indefinidamente
  });
};

export default useCurrentUser;
