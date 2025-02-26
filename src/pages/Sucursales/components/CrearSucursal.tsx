import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCreateSucursal from "@/api/sucursal/hooks/useCreateSucursal";
import { CreateSucursalPayload } from "@/api/sucursal/types/sucursal.types";

interface CrearSucursalProps {
  open: boolean;
  onClose: () => void;
}

const CrearSucursal: React.FC<CrearSucursalProps> = ({ open, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [codigo, setCodigo] = useState("");


  const createMutation = useCreateSucursal();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: CreateSucursalPayload = {
      nombre,
      direccion,
      telefono: telefono || undefined,
      codigo: codigo || undefined
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Sucursal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la sucursal"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label htmlFor="codigo">Codigo</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Codigo de la sucursal"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección de la sucursal"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono (opcional)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={createMutation.isPending}>
              Crear
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

export default CrearSucursal;
