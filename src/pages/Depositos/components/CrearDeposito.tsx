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
import useCreateDeposito from "@/api/deposito/hooks/useCreateDeposito";
import { CreateDepositoPayload } from "@/api/deposito/types/deposito.types";

interface CrearDepositoProps {
  open: boolean;
  onClose: () => void;
}

const CrearDeposito: React.FC<CrearDepositoProps> = ({ open, onClose }) => {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const createMutation = useCreateDeposito();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: CreateDepositoPayload = {
      codigo,
      nombre,
      ubicacion: ubicacion || undefined,
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
          <DialogTitle>Crear Depósito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-col space-y-1">
            <div className="flex flex-row justify-between">
            <Label htmlFor="codigo">Código</Label>
            <Label htmlFor="codigo" className="text-red-500"> No es editable luego de su creación</Label>
            </div>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código del depósito"
              required 
            />
          </div>
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

export default CrearDeposito;
