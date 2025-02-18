// src/context/AuthContext.tsx
"use client"

import React, { createContext, useContext } from 'react';
import useCurrentUser from '@/api/auth/hooks/use-current-user';
import { User } from '@/api/auth/types/auth.types';

type AuthContextType = {
    user: User | null;
    isAuthorized: (requiredRole: string | string[]) => boolean;
  };
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthorized: () => false,
  });
  
  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: currentUser, isLoading } = useCurrentUser();
  
    // Normalizamos: si currentUser es undefined, lo transformamos a null
    const user: User | null = currentUser ?? null;
  
    const isAuthorized = (requiredRole: string | string[]): boolean => {
        if (!user || !user.role) return false;
        
        // Si el usuario es superadmin, siempre tiene acceso.
        if (user.role.name === "superadmin") return true;
      
        // Si requiredRole es un arreglo, se verifica si el rol del usuario está incluido.
        if (Array.isArray(requiredRole)) {
          return requiredRole.includes(user.role.name);
        }
        
        // Si es un string, se compara de forma exacta.
        return user.role.name === requiredRole;
      };
      
  
    if (isLoading) return <div>Cargando...</div>;
  
    return (
      <AuthContext.Provider value={{ user, isAuthorized }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);