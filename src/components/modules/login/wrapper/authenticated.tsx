import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '@/api/auth/hooks/use-current-user';
import FullScreenLoader from '@/components/common/loader/FSLoader';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

export const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user != null) {
      // Redirige sin agregar una nueva entrada en el historial
      navigate('/', { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};
