import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { login, LoginCredentials, LoginResponse } from '../auth.ts';

export const useLogin = (): UseMutationResult<LoginResponse, unknown, LoginCredentials, unknown> => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, unknown, LoginCredentials>({
    mutationFn: login,
    onSuccess: () => {
      // Invalidar caché para forzar actualización del usuario autenticado
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error);
    },
  });
};

export default useLogin;
