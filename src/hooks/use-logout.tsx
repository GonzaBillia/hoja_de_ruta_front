// src/hooks/useLogout.ts
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/api/auth/auth';
import { useNavigate } from 'react-router-dom';

export const useLogout = (): UseMutationResult<{ success: boolean }, unknown, void, unknown> => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, unknown, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate("/login")
    },
    onError: (error: unknown) => {
      console.error('Logout failed:', error);
    },
  });
};

export default useLogout;
