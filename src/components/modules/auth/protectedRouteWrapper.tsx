import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/context/auth-context";
import { ReactNode } from "react";
import { ROUTES } from "@/routes/routeConfig";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: string | string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthorized } = useAuth();

  if (!isAuthorized(requiredRole)) {
    return <Navigate to={ROUTES.MAIN} replace />;
  }

  return <>{children}</>;
}
