// components/EditarHojaRuta/EstadoEditor.tsx
"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEstados } from "@/api/estado/hooks/useEstados";

interface EstadoEditorProps {
  estadoId?: number;
  onChange: (id: number) => void;
}

const EstadoEditor: React.FC<EstadoEditorProps> = ({ estadoId, onChange }) => {
  const { data: estadoData, isLoading, error } = useEstados();

  if (isLoading) return <p>Cargando estados...</p>;
  if (error) return <p>Error al cargar estados</p>;

  return (
    <Select
      value={estadoId?.toString() || ""}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccione un estado" />
      </SelectTrigger>
      <SelectContent>
        {estadoData?.map((estado) => (
          <SelectItem key={estado.id} value={estado.id.toString()}>
            {estado.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EstadoEditor;
