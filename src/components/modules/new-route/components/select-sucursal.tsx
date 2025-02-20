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
import { RemitoQuantio } from "@/api/remito/types/remito.types";

interface SelectSucursalProps {
  repartidorId: number;
  onSucursalSelect?: (sucursalId: number) => void;
  onRemitosSelect?: (remitos: RemitoQuantio[]) => void;
}

const SelectSucursal: React.FC<SelectSucursalProps> = ({
  repartidorId,
  onSucursalSelect,
  onRemitosSelect,
}) => {
  const { data: sucursales, isLoading, error } = useSucursalesByRepartidor(repartidorId);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);

  const handleChange = (value: string) => {
    const sucursal = sucursales?.find((s) => s.id.toString() === value);
    if (sucursal) {
      setSelectedSucursal(sucursal);
      if (onSucursalSelect) {
        onSucursalSelect(sucursal.id);
      }
    }
  };

  if (isLoading) {
    return <p>Cargando sucursales...</p>;
  }
  if (error) {
    return <p>Error al cargar sucursales</p>;
  }

  return (
    <div className="w-full max-w-sm py-4">
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
          {/* Se integra el componente para seleccionar remitos */}
          <SelectRemitos
            sucursalNombre={selectedSucursal.nombre}
            onChange={(remitos: RemitoQuantio[]) => {
              if (onRemitosSelect) {
                onRemitosSelect(remitos);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SelectSucursal;
