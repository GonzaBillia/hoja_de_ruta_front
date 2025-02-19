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
import useUpdateDeposito from "@/api/deposito/hooks/useUpdateDeposito";
import { Deposito } from "@/api/deposito/types/deposito.types";
import { UpdateDepositoPayload } from "@/api/deposito/types/deposito.types";

interface EditarDepositoProps {
  rowData: Deposito;
  open: boolean;
  onClose: () => void;
}

const EditarDeposito: React.FC<EditarDepositoProps> = ({ rowData, open, onClose }) => {
  // Estados para los campos editables
  const [nombre, setNombre] = useState<string>(rowData.nombre);
  const [ubicacion, setUbicacion] = useState<string>(rowData.ubicacion ?? "");

  // Actualiza los estados si rowData cambia
  useEffect(() => {
    setNombre(rowData.nombre);
    setUbicacion(rowData.ubicacion ?? "");
  }, [rowData]);

  const updateMutation = useUpdateDeposito(rowData.id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Construimos el payload sin permitir modificar "codigo"
    const payload: UpdateDepositoPayload = {
      nombre,
      ubicacion: ubicacion || undefined,
    };

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
          <DialogTitle>Editar Depósito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Campo no editable para "codigo" */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="codigo">Código</Label>
            <Input id="codigo" value={rowData.codigo} disabled />
          </div>
          {/* Campo editable para "nombre" */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del depósito"
              required
            />
          </div>
          {/* Campo editable para "ubicacion" */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ubicación (opcional)"
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

export default EditarDeposito;
