// src/components/LoginFormView.tsx
import {LoginFormViewProps} from "./types/loginProps.ts"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export function LoginFormView({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  isLoading,
  error,
  className,
  ...props
}: LoginFormViewProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Ingresa a tu Cuenta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Ingresa tu Email para Iniciar.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@sanchezantoniolli.com.ar"
            value={email}
            onChange={onEmailChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Olvide mi Contraseña
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando..." : "Iniciar Sesion"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
