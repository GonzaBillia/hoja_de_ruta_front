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
import useUpdateUser from "@/api/auth/hooks/useUpdateUser";
import { UpdateUserPayload, User } from "@/api/auth/types/auth.types";
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

interface EditarUsuarioProps {
  rowData: User;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const EditarUsuario: React.FC<EditarUsuarioProps> = ({
  rowData,
  open,
  onClose,
  onUpdated,
}) => {
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser(rowData.id);

  // Estados para campos simples
  const [username, setUsername] = useState<string>(rowData.username);
  const [email, setEmail] = useState<string>(rowData.email);
  // Role se maneja vía dropdown, por lo que almacenamos el id
  const [roleId, setRoleId] = useState<number | undefined>(rowData.role_id);

  // Estados para dropdowns de Depósito y Sucursal (opcionales)
  const [depositoId, setDepositoId] = useState<number | null>(
    rowData.deposito_id ?? null
  );
  const [sucursalId, setSucursalId] = useState<number | null>(
    rowData.sucursal_id ?? null
  );

  // Hooks para obtener opciones de los dropdowns
  const { data: roles } = useRoles();
  const { data: depositos } = useDepositos();
  const { data: sucursales } = useSucursales();

  // Actualizamos los estados si rowData cambia
  useEffect(() => {
    setUsername(rowData.username);
    setEmail(rowData.email);
    setRoleId(rowData.role_id);
    setDepositoId(rowData.deposito_id ?? null);
    setSucursalId(rowData.sucursal_id ?? null);
  }, [rowData]);

  // Calculamos el rol seleccionado para determinar qué dropdowns deshabilitar
  const selectedRole = roles?.find((rol) => rol.id === roleId);
  const roleName = selectedRole?.name?.toLowerCase() || "";
  const disableDeposito =
    roleName === "sucursal" || roleName === "repartidor" || roleName === "superadmin";
  const disableSucursal =
    roleName === "deposito" || roleName === "repartidor" || roleName === "superadmin";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: UpdateUserPayload = {
      username,
      email,
      role_id: roleId,
      deposito_id: depositoId,
      sucursal_id: sucursalId,
    };
    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Usuario actualizado",
          description: "El usuario se actualizó correctamente.",
          variant: "success",
        });
        onClose();
        if (onUpdated) onUpdated();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al actualizar el usuario.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Correo electrónico"
              required
            />
          </div>
          {/* Rol */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="role_id">Rol</Label>
            <Select
              value={roleId ? roleId.toString() : ""}
              onValueChange={(value) =>
                setRoleId(value ? Number(value) : undefined)
              }
            >
              <SelectTrigger className="border rounded px-2 py-1">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((rol) => (
                  <SelectItem key={rol.id} value={rol.id.toString()}>
                    {rol.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Depósito */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="deposito_id">Depósito</Label>
            <Select
              value={depositoId !== null ? depositoId.toString() : ""}
              onValueChange={(value) =>
                setDepositoId(value ? Number(value) : null)
              }
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
          {/* Sucursal */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="sucursal_id">Sucursal</Label>
            <Select
              value={sucursalId !== null ? sucursalId.toString() : ""}
              onValueChange={(value) =>
                setSucursalId(value ? Number(value) : null)
              }
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
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Actualizando..." : "Guardar cambios"}
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

export default EditarUsuario;
