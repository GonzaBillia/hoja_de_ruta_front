// src/components/LoginForm.tsx
import React, { useState, FormEvent } from "react";
import { useLogin } from "@/api/auth/hooks/use-login.tsx";
import { LoginFormView } from "./login-form-view.tsx";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast.ts";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { toast } = useToast()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
  
    loginMutation.mutate(
      { email, password },
      {
        onError: (err: any) => {
          // Extrae el mensaje de error
          const errorMessage =
            err.response?.data?.message || "Error al iniciar sesión";
          
          // Si el error es de conexión, podemos notificar que se reintentará
          if (err.code === "ERR_CONNECTION_RESET" || err.message.includes("connection")) {
            toast({
              title: "Error de conexión",
              description: `${errorMessage}. Se reintentará automáticamente...`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
            });
          }
          
          setError(errorMessage);
        },
        onSuccess: () => {
          // Esperar un poco para asegurarnos de que `useCurrentUser` obtiene la actualización
          setTimeout(() => {
            navigate("/");
          }, 100);
        },
      }
    );
    
  };

   // Usamos la propiedad 'status' para determinar si está cargando
   const isLoading = loginMutation.status === "pending";

   return (
     <LoginFormView
       onSubmit={handleSubmit}
       email={email}
       password={password}
       onEmailChange={(e) => setEmail(e.target.value)}
       onPasswordChange={(e) => setPassword(e.target.value)}
       isLoading={isLoading}
       error={error || undefined}
     />
   );
};
