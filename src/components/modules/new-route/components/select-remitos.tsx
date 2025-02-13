import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useRemitosQuantio from "@/api/remito/hooks/useRemitosQuantio";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";

interface SelectRemitosProps {
  sucursalNombre: string;
  onChange?: (selectedRemitos: QrData[]) => void;
}

const SelectRemitos: React.FC<SelectRemitosProps> = ({ sucursalNombre, onChange }) => {
  const { data: remitos, isLoading, error } = useRemitosQuantio();
  const [selectedRemitos, setSelectedRemitos] = useState<QrData[]>([]);

  // Filtrar remitos para la sucursal seleccionada (se compara con CliApeNom)
  const filteredRemitos = remitos?.filter((remito: QrData) => remito.CliApeNom === sucursalNombre) || [];

  const handleCheckboxChange = (remito: QrData, checked: boolean) => {
    let updated: QrData[];
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
        {filteredRemitos.map((remito: QrData) => (
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
