import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useRegisterUser from "@/api/auth/hooks/use-register";
import { RegisterUserPayload, User } from "@/api/auth/types/auth.types";
import { useToast } from "@/hooks/use-toast";
import useSucursales from "@/api/sucursal/hooks/useSucursales";
import useDepositos from "@/api/deposito/hooks/useDepositos";
import useRoles from "@/api/roles/hooks/useRoles";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useCreateRepartidorSucursal from "@/api/repartidor-sucursal/hooks/useCreateRepartidorSucursal";

export interface MultiSelectOption {
  value: number;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selected: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder,
}) => {
  const handleSelect = (option: MultiSelectOption) => {
    if (!selected.includes(option.value)) {
      onChange([...selected, option.value]);
    }
  };

  const handleRemove = (value: number) => {
    onChange(selected.filter(item => item !== value));
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Mostrar elementos seleccionados sin estilos adicionales */}
      <div className="flex flex-wrap gap-2">
        {selected.map(val => {
          const opt = options.find(o => o.value === val);
          if (!opt) return null;
          return (
            <div key={val} className="flex items-center gap-1 border rounded px-2 py-1">
              <span>{opt.label}</span>
              <button type="button" onClick={() => handleRemove(val)} aria-label="Remover">
                &times;
              </button>
            </div>
          );
        })}
      </div>
      {/* Dropdown usando Popover con estilos por defecto */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full text-left">
            {placeholder || "Seleccionar opciones"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="flex flex-col">
            {options.map(option => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className="cursor-pointer px-2 py-1"
              >
                {option.label}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface CrearUsuarioProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ open, onClose, onCreated }) => {
  const { toast } = useToast();
  const registerUserMutation = useRegisterUser();
  const createRepartidorSucursalMutation = useCreateRepartidorSucursal();

  // Estados para campos básicos y para el registro
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Para el rol, ahora se utiliza un string que contendrá el Role.name seleccionado.
  const [role, setRole] = useState<string>("");

  // Estados para depósitos y sucursal (única o múltiple)
  const [depositoId, setDepositoId] = useState<number | null>(null);
  const [sucursalId, setSucursalId] = useState<number | null>(null);
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

  // Hooks para obtener opciones
  const { data: rolesData } = useRoles();
  const { data: depositos } = useDepositos();
  const { data: sucursales } = useSucursales();

  // Reiniciamos los campos cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
      setDepositoId(null);
      setSucursalId(null);
      setSelectedSucursales([]);
    }
  }, [open]);

  // Para condiciones de campos activos, se utiliza role.toLowerCase()
  const roleName = role.toLowerCase();
  const disableDeposito =
    roleName === "sucursal" || roleName === "repartidor" || roleName === "superadmin";
  const disableSucursal =
    roleName === "deposito" || roleName === "repartidor" || roleName === "superadmin";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // En el payload se envía "role" con el valor del Role.name
    const payload: RegisterUserPayload = {
      username,
      email,
      password,
      role,
      deposito_id: depositoId,
      // Para roles que no sean repartidor se utiliza el campo sucursal_id único.
      sucursal_id: roleName !== "repartidor" ? sucursalId : null,
    };

    registerUserMutation.mutate(payload, {
      onSuccess: (newUser: User) => {
        // Si el rol es repartidor, crear las asociaciones para las nuevas sucursales seleccionadas.
        if (roleName === "repartidor" && selectedSucursales.length > 0) {
          selectedSucursales.forEach((sucId) => {
            createRepartidorSucursalMutation.mutate({
              user_id: newUser.id,
              sucursal_id: sucId,
            });
          });
        }
        toast({
          title: "Usuario creado",
          description: "El usuario se registró correctamente.",
          variant: "success",
        });
        onClose();
        if (onCreated) onCreated();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al registrar el usuario.",
          variant: "destructive",
        });
      },
    });
  };

  // Opciones para el select de roles: usamos Role.name como value
  const roleOptions = rolesData
    ? rolesData.map((rol) => ({ value: rol.name, label: rol.name }))
    : [];

  const sucursalOptions: MultiSelectOption[] = sucursales
    ? sucursales.map((suc) => ({ value: suc.id, label: suc.nombre }))
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
            />
          </div>
          {/* Email */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>
          {/* Password */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          {/* Rol */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={role || undefined}
              onValueChange={(value) => setRole(value || "")}
            >
              <SelectTrigger className="border rounded px-2 py-1">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Depósito */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="deposito_id">Depósito</Label>
            <Select
              value={depositoId !== null ? depositoId.toString() : undefined}
              onValueChange={(value) => setDepositoId(value ? Number(value) : null)}
              disabled={disableDeposito}
            >
              <SelectTrigger className="border rounded px-2 py-1">
                <SelectValue placeholder="Seleccione un depósito" />
              </SelectTrigger>
              <SelectContent>
                {depositos?.map((dep) => (
                  <SelectItem key={dep.id} value={dep.id.toString()}>
                    {dep.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Sucursal o selección múltiple para repartidor */}
          {roleName === "repartidor" ? (
            <div className="space-y-4">
              <div className="space-y-1 flex flex-col">
                <Label htmlFor="repartidor_sucursales">Sucursales</Label>
                <MultiSelectDropdown
                  options={sucursalOptions}
                  selected={selectedSucursales}
                  onChange={setSelectedSucursales}
                  placeholder="Seleccione sucursales"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1 flex flex-col">
              <Label htmlFor="sucursal_id">Sucursal</Label>
              <Select
                value={sucursalId !== null ? sucursalId.toString() : undefined}
                onValueChange={(value) => setSucursalId(value ? Number(value) : null)}
                disabled={disableSucursal}
              >
                <SelectTrigger className="border rounded px-2 py-1">
                  <SelectValue placeholder="Seleccione una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {sucursales?.map((suc) => (
                    <SelectItem key={suc.id} value={suc.id.toString()}>
                      {suc.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={registerUserMutation.isPending}>
              {registerUserMutation.isPending ? "Registrando..." : "Crear usuario"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CrearUsuario;
