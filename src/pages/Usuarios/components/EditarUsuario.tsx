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
import useCreateRepartidorSucursal from "@/api/repartidor-sucursal/hooks/useCreateRepartidorSucursal";
import useRepartidorSucursales from "@/api/repartidor-sucursal/hooks/useRepartidorSucursales";
import useDeleteRepartidorSucursal from "@/api/repartidor-sucursal/hooks/useDeleteRepartidorSucursal";
interface EditarUsuarioProps {
  rowData: User;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

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
      {/* Lista de elementos seleccionados */}
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
      {/* Dropdown usando Popover sin estilos adicionales */}
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

const EditarUsuario: React.FC<EditarUsuarioProps> = ({
  rowData,
  open,
  onClose,
  onUpdated,
}) => {
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser(rowData.id);
  const createRepartidorSucursalMutation = useCreateRepartidorSucursal();
  const deleteRepartidorSucursalMutation = useDeleteRepartidorSucursal();

  const [username, setUsername] = useState<string>(rowData.username);
  const [email, setEmail] = useState<string>(rowData.email);
  const [roleId, setRoleId] = useState<number | undefined>(rowData.role_id);

  const [depositoId, setDepositoId] = useState<number | null>(
    rowData.deposito_id ?? null
  );
  const [sucursalId, setSucursalId] = useState<number | null>(
    rowData.sucursal_id ?? null
  );
  // Para el rol repartidor: estado para nuevas asociaciones
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

  const { data: roles } = useRoles();
  const { data: depositos } = useDepositos();
  const { data: sucursales } = useSucursales();

  useEffect(() => {
    setUsername(rowData.username);
    setEmail(rowData.email);
    setRoleId(rowData.role_id);
    setDepositoId(rowData.deposito_id ?? null);
    setSucursalId(rowData.sucursal_id ?? null);
    setSelectedSucursales([]);
  }, [rowData]);

  const selectedRole = roles?.find((rol) => rol.id === roleId);
  const roleName = selectedRole?.name?.toLowerCase() || "";
  const disableDeposito =
    roleName === "sucursal" || roleName === "repartidor" || roleName === "superadmin";
  const disableSucursal =
    roleName === "deposito" || roleName === "repartidor" || roleName === "superadmin";

  // Hook para obtener las asociaciones ya existentes para el repartidor.
  const { data: repartidorSucursales, isLoading: isLoadingAssoc } = useRepartidorSucursales(
    rowData.id
  );

  const handleDeleteAssoc = (sucursal_id: number) => {
    deleteRepartidorSucursalMutation.mutate(
      { user_id: rowData.id, sucursal_id },
      {
        onSuccess: () => {
          toast({
            title: "Asociación eliminada",
            description: "La asociación se eliminó correctamente.",
            variant: "success",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Error al eliminar la asociación.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: UpdateUserPayload = {
      username,
      email,
      role_id: roleId,
      deposito_id: depositoId,
      sucursal_id: roleName !== "repartidor" ? sucursalId : null,
    };

    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        // Para el rol repartidor, se crean las nuevas asociaciones
        if (roleName === "repartidor" && selectedSucursales.length > 0) {
          selectedSucursales.forEach((sucId) => {
            createRepartidorSucursalMutation.mutate({
              user_id: rowData.id,
              sucursal_id: sucId,
            });
          });
        }
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

  const sucursalOptions: MultiSelectOption[] = sucursales
    ? sucursales.map((suc) => ({ value: suc.id, label: suc.nombre }))
    : [];

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
          {/* Rol */}
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="role_id">Rol</Label>
            <Select
              value={roleId ? roleId.toString() : undefined}
              onValueChange={(value) => setRoleId(value ? Number(value) : undefined)}
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
                <Label htmlFor="repartidor_sucursales">Agregar nuevas sucursales</Label>
                <MultiSelectDropdown
                  options={sucursalOptions}
                  selected={selectedSucursales}
                  onChange={setSelectedSucursales}
                  placeholder="Seleccione sucursales"
                />
              </div>
              <div className="space-y-1 flex flex-col">
                <Label>Asociaciones existentes</Label>
                {isLoadingAssoc ? (
                  <p>Cargando asociaciones...</p>
                ) : repartidorSucursales && repartidorSucursales.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {repartidorSucursales.map((assoc) => (
                      <div key={assoc.sucursal_id} className="flex items-center justify-between border rounded px-2 py-1">
                        <span>
                          {
                            `Sucursal ${assoc.sucursal_id}`
                          }
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAssoc(assoc.sucursal_id)}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay asociaciones.</p>
                )}
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
