"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEstados } from "@/api/estado/hooks/useEstados";
import useCurrentUser from "@/api/auth/hooks/use-current-user";

interface Estado {
  id: number;
  nombre: string;
}

interface EstadoEditorProps {
  estadoId?: number;
  onChange: (id: number) => void;
}

const EstadoEditor: React.FC<EstadoEditorProps> = ({ estadoId, onChange }) => {
  const { data: estadoData, isLoading, error } = useEstados();
  const { data: user } = useCurrentUser();

  const rolId = user?.role_id;

  const opcionesPermitidas: Estado[] = React.useMemo(() => {
    if (!estadoData) return [];
    if (rolId === 4) {
      return estadoData;
    } else if (rolId === 1) {
      return estadoData.filter((estado) => {
        const nombre = estado.nombre.toLowerCase();
        return nombre === "creado" || nombre === "enviado";
      });
    } else if (rolId === 3) {
      return estadoData.filter((estado) => {
        const nombre = estado.nombre.toLowerCase();
        return (
          nombre === "enviado" ||
          nombre === "recibido" ||
          nombre === "recibido incompleto"
        );
      });
    }
    return [];
  }, [estadoData, rolId]);

  // Ejecutamos la inicialización sólo al montar el componente
  useEffect(() => {
    if (estadoId === undefined && opcionesPermitidas.length > 0) {
      onChange(opcionesPermitidas[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <p>Cargando estados...</p>;
  if (error) return <p>Error al cargar estados</p>;

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={estadoId?.toString() || ""}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Selecciona estado" />
        </SelectTrigger>
        <SelectContent>
          {opcionesPermitidas.map((opcion) => (
            <SelectItem key={opcion.id} value={opcion.id.toString()}>
              {opcion.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EstadoEditor;
