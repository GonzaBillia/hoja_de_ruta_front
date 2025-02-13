import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useRemitosQuantio from "@/api/remito/hooks/useRemitosQuantio";

interface SelectRemitosProps {
  sucursalNombre: string;
  onChange?: (selectedRemitos: any[]) => void;
}

const SelectRemitos: React.FC<SelectRemitosProps> = ({ sucursalNombre, onChange }) => {
  const { data: remitos, isLoading, error } = useRemitosQuantio();
  const [selectedRemitos, setSelectedRemitos] = useState<any[]>([]);
    console.log(remitos)
  // Filtrar remitos para la sucursal seleccionada
  const filteredRemitos = remitos?.filter((remito: any) => remito.CliApeNom === sucursalNombre) || [];

  const handleCheckboxChange = (remito: any, checked: boolean) => {
    let updated: any[];
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
        {filteredRemitos.map((remito: any) => (
          <li key={remito.Numero} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedRemitos.some((r) => r.Numero === remito.Numero)}
              onCheckedChange={(checked: boolean) => handleCheckboxChange(remito, checked)}
            />
            <Label className="cursor-pointer">{remito.Numero}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectRemitos;

