import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSucursalesByRepartidor } from "@/api/sucursal/hooks/useSucursalesRepartidor";
import { Sucursal } from "@/api/sucursal/types/sucursal.types";
import SelectRemitos from "./select-remitos";

interface SelectSucursalProps {
  repartidorId: number;
  onSucursalSelect?: (sucursal: Sucursal) => void;
}

const SelectSucursal: React.FC<SelectSucursalProps> = ({ repartidorId, onSucursalSelect }) => {
  const { data: sucursales, isLoading, error } = useSucursalesByRepartidor(repartidorId);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);

  const handleChange = (value: string) => {
    const sucursal = sucursales?.find((s) => s.id.toString() === value);
    if (sucursal) {
      setSelectedSucursal(sucursal);
      if (onSucursalSelect) onSucursalSelect(sucursal);
    }
  };

  if (isLoading) {
    return <p>Cargando sucursales...</p>;
  }

  if (error) {
    return <p>Error al cargar sucursales</p>;
  }

  return (
    <div className="w-full max-w-sm">
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona una sucursal" />
        </SelectTrigger>
        <SelectContent>
          {sucursales?.map((sucursal) => (
            <SelectItem key={sucursal.id} value={sucursal.id.toString()}>
              {sucursal.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedSucursal && (
        <div className="mt-2 text-sm">
          <strong>Seleccionado:</strong> {selectedSucursal.nombre}
          {/* Aquí se integra el componente para seleccionar remitos */}
          <SelectRemitos sucursalNombre={selectedSucursal.nombre} onChange={(selected) => console.log("Remitos seleccionados:", selected)} />
        </div>
      )}
    </div>
  );
};

export default SelectSucursal;
