"use client";

import React, { useState, useEffect } from "react";
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
  const [localEstadoId, setLocalEstadoId] = useState<number | null>(null);

  // Determinamos el rol del usuario directamente a partir de user?.role_id
  // Suponiendo: 1 = superadmin, 2 = depósito, 3 = sucursal.
  const rolId = user?.role_id;

  // Filtrar opciones según rol
  const opcionesPermitidas: Estado[] = React.useMemo(() => {
    if (!estadoData) return [];
    if (rolId === 4) {
      // Superadmin puede elegir cualquier estado
      return estadoData;
    } else if (rolId === 1) {
      // Para depósito, se permiten solo "creado" y "enviado"
      return estadoData.filter((estado) => {
        const nombre = estado.nombre.toLowerCase();
        return nombre === "creado" || nombre === "enviado";
      });
    } else if (rolId === 3) {
      // Para sucursal, se permiten "enviado", "recibido" y "recibido incompleto"
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

  // Usamos el estado del padre si está definido; de lo contrario, usamos un estado local.
  // Si no hay estado seleccionado aún y hay opciones, inicializamos localmente una sola vez.
  const selectedId = estadoId ?? localEstadoId;
  useEffect(() => {
    if (!estadoId && opcionesPermitidas.length > 0 && localEstadoId === null) {
      // Seleccionamos la primera opción de la lista (puedes ajustar la lógica si requieres descartar la actual)
      setLocalEstadoId(opcionesPermitidas[0].id);
    }
  }, [estadoId, opcionesPermitidas, localEstadoId]);

  if (isLoading) return <p>Cargando estados...</p>;
  if (error) return <p>Error al cargar estados</p>;

  // Para mostrar el estado actual (del padre) en el texto
  const estadoActual: Estado | undefined = estadoData?.find(
    (estado) => estado.id === estadoId
  );

  return (
    <div className="flex flex-col gap-4 space-y-1">
      <p>
        Cambiar a estado siguiente:{" "}
        <strong>{estadoActual ? estadoActual.nombre : "Desconocido"}</strong>{" "}
        -&gt;{" "}
        <Select
          value={selectedId?.toString() || ""}
          onValueChange={(val) => {
            const nuevoId = Number(val);
            // Actualizamos el estado local y notificamos al padre
            setLocalEstadoId(nuevoId);
            onChange(nuevoId);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecciona estado" />
          </SelectTrigger>
          <SelectContent>
            {opcionesPermitidas
              // Si el padre ya tiene un estado seleccionado, se puede optar por no mostrar esa opción
              .filter((opcion) => (estadoId ? opcion.id !== estadoId : true))
              .map((opcion) => (
                <SelectItem key={opcion.id} value={opcion.id.toString()}>
                  {opcion.nombre}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </p>
    </div>
  );
};

export default EstadoEditor;
