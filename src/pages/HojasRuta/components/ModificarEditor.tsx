"use client";
import React from "react";
import QRCodeChips from "@/components/modules/new-route/components/qrcode-chips";
import { Repartidor } from "@/api/repartidor/types/repartidor.types";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import SelectRepartidorBySucursal from "./SelectRepartidorBySucursal";
import SelectRemitos from "@/components/modules/new-route/components/select-remitos";
import { RemitoQuantio } from "@/api/remito/types/remito.types";

interface ModificarEditorProps {
  selectedRepartidor: Repartidor | null;
  onSelectRepartidor: (r: Repartidor) => void;
  selectedRemitos: RemitoQuantio[];
  onChangeRemitos: (remitos: RemitoQuantio[]) => void;
  initialQrCodes?: QrData[];
  sucursalNombre: string;
  sucursalId: number;
  repartidorId: number;
  fechaCreacion: Date
}

const ModificarEditor: React.FC<ModificarEditorProps> = ({
  selectedRepartidor,
  onSelectRepartidor,
  selectedRemitos,
  onChangeRemitos,
  initialQrCodes,
  sucursalNombre,
  sucursalId,
  repartidorId,
  fechaCreacion
}) => {
  return (
    <div className="space-y-4">
      {/* Selección de repartidor filtrado por sucursal */}
      <SelectRepartidorBySucursal
        selectedRepartidor={selectedRepartidor}
        onSelect={onSelectRepartidor}
        sucursalId={sucursalId}
        initialRepartidorId={repartidorId}
      />
      {/* Componente para seleccionar remitos filtrados por el nombre de la sucursal */}
      <SelectRemitos
        sucursalNombre={sucursalNombre}
        selectedRemitos={selectedRemitos}
        onChange={onChangeRemitos}
        fechaCreacion={fechaCreacion}
      />
      {/* Mostrar códigos QR */}
      <QRCodeChips initialCodes={initialQrCodes} />
    </div>
  );
};

export default ModificarEditor;
