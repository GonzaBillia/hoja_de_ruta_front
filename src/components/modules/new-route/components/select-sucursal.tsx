// components/modules/new-route/components/select-sucursal.tsx
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Ajusta la ruta según tu estructura
import { useSucursalesByRepartidor } from "@/api/sucursal/hooks/useSucursalesRepartidor"; // Ajusta la ruta
import { Sucursal } from "@/api/sucursal/types/sucursal.types"; // Ajusta la ruta y nombre del type

interface SelectSucursalProps {
  repartidorId: number;
}

const SelectSucursal: React.FC<SelectSucursalProps> = ({ repartidorId }) => {
  const { data: sucursales, isLoading, error } = useSucursalesByRepartidor(repartidorId);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);

  const handleChange = (value: string) => {
    // Se busca la sucursal cuyo id (convertido a string) coincide con el valor seleccionado
    const sucursal = sucursales?.find((s) => s.id.toString() === value);
    if (sucursal) {
      setSelectedSucursal(sucursal);
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
        </div>
      )}
    </div>
  );
};

export default SelectSucursal;
