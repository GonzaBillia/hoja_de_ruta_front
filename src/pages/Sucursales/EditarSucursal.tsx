import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUpdateSucursal from "@/api/sucursal/hooks/useUpdateSucursal";
import { Sucursal } from "@/api/sucursal/types/sucursal.types";

interface EditarSucursalProps {
  rowData: Sucursal;
  open: boolean;
  onClose: () => void;
}

const EditarSucursal: React.FC<EditarSucursalProps> = ({ rowData, open, onClose }) => {
  // Inicializamos los estados con los datos de rowData
  const [nombre, setNombre] = useState<string>(rowData.nombre);
  const [direccion, setDireccion] = useState<string>(rowData.direccion);
  const [telefono, setTelefono] = useState<string>(rowData.telefono ?? "");

  // Actualizamos los estados si rowData cambia
  useEffect(() => {
    setNombre(rowData.nombre);
    setDireccion(rowData.direccion);
    setTelefono(rowData.telefono ?? "");
  }, [rowData]);

  // Usamos el hook para actualizar la sucursal
  const updateMutation = useUpdateSucursal(rowData.id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { nombre, direccion, telefono };
    updateMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Sucursal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la sucursal"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección de la sucursal"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono (opcional)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={updateMutation.isPending}>
              Guardar cambios
            </Button>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarSucursal;
