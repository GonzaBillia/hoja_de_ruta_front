import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { login } from '../auth';
import { LoginCredentials, LoginResponse } from '../types/auth.types';

export const useLogin = (): UseMutationResult<LoginResponse, unknown, LoginCredentials, unknown> => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, unknown, LoginCredentials>({
    mutationFn: login,
    retry: (failureCount, error: any) => {
      // Aquí podemos detectar el error de conexión y reintentar hasta 2 veces
      if (error?.code === 'ERR_NETWORK' && failureCount < 2) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => {
      // Por ejemplo, espera 3 segundos en el primer intento y 5 segundos en el segundo.
      return attemptIndex === 0 ? 3000 : 5000;
    },
    onSuccess: () => {
      // Invalidar la caché para actualizar el usuario autenticado
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error);
    },
  });
};

export default useLogin;
