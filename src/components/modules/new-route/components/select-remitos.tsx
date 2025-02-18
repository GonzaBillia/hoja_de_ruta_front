"use client";
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useRemitosQuantio from "@/api/remito/hooks/useRemitosQuantio";
import { RemitoQuantio } from "@/api/remito/types/remito.types";
import useRemitosQuantioByDate from "@/api/remito/hooks/useRemitosQuantioByDate";

interface SelectRemitosProps {
  sucursalNombre: string;
  selectedRemitos?: RemitoQuantio[];
  onChange?: (selectedRemitos: RemitoQuantio[]) => void;
  fechaCreacion?: Date;
}

const SelectRemitos: React.FC<SelectRemitosProps> = ({
  sucursalNombre,
  selectedRemitos: selectedRemitosProp,
  onChange,
  fechaCreacion,
}) => {
  const [selectedRemitos, setSelectedRemitos] = useState<RemitoQuantio[]>(selectedRemitosProp || []);

  // Selecciona el hook a usar según la existencia de fechaCreacion
  const { data: remitos, isLoading, error } = fechaCreacion
    ? useRemitosQuantioByDate(new Date(fechaCreacion).toISOString().split("T")[0])
    : useRemitosQuantio();

  // Actualiza el estado local si cambia la prop (si se pasó)
  useEffect(() => {
    if (selectedRemitosProp) {
      setSelectedRemitos(selectedRemitosProp);
    }
  }, [selectedRemitosProp]);

  // Filtrar remitos para la sucursal (se compara con CliApeNom)
  const filteredRemitos = remitos?.filter(
    (remito: RemitoQuantio) => remito.CliApeNom === sucursalNombre
  ) || [];

  const handleCheckboxChange = (remito: RemitoQuantio, checked: boolean) => {
    let updated: RemitoQuantio[];
    if (checked) {
      updated = [...selectedRemitos, remito];
    } else {
      updated = selectedRemitos.filter((r) => r.Numero !== remito.Numero);
    }
    setSelectedRemitos(updated);
    if (onChange) onChange(updated);
  };

  if (isLoading) {
    return <p>Cargando remitos...</p>;
  }

  if (error) {
    return <p>Error al cargar remitos.</p>;
  }

  return (
    <div className="w-full max-w-md mt-4">
      <p className="mb-2 font-semibold">Selecciona Remitos</p>
      <ul className="space-y-2">
        {filteredRemitos.map((remito: RemitoQuantio) => (
          <li key={remito.Numero} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedRemitos.some(
                (r) => String(r.Numero) === String(remito.Numero)
              )}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange(remito, checked)
              }
            />
            <Label className="cursor-pointer">{remito.Numero}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectRemitos;
