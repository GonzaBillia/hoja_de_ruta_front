import { useState, useEffect } from "react";
import SelectRepartidor from "@/components/modules/new-route/components/select-repartidor";
import SelectSucursal from "@/components/modules/new-route/components/select-sucursal";
import QRCodeChips from "@/components/modules/new-route/components/qrcode-chips";
import { Repartidor } from "@/api/repartidor/types/repartidor.types";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { useQrContext } from "@/components/context/qr-context";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import { Button } from "@/components/ui/button";

const NuevaRuta = () => {
  const [routeData, setRouteData] = useState<RouteSheet | null>(null)
  const [selectedRepartidor, setSelectedRepartidor] = useState<Repartidor | null>(null);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(null);
  const [selectedRemitos, setSelectedRemitos] = useState<QrData[]>([]);
  const { qrCodes } = useQrContext();

  const handleClick = () => {
    return
  }

  useEffect(() => {
    console.log("Repartidor seleccionado:", selectedRepartidor);
    console.log("Sucursal ID seleccionado:", selectedSucursalId);
    console.log("Remitos seleccionados:", selectedRemitos);
    console.log("QRs escaneados: ", qrCodes)
  }, [selectedRepartidor, selectedSucursalId, selectedRemitos, qrCodes]);

  return (
    <div className="mx-auto min-w-md flex flex-col justify-between p-2">
      <SelectRepartidor
        selectedRepartidor={selectedRepartidor}
        onSelect={(r) => setSelectedRepartidor(r)}
      />
      {selectedRepartidor && (
        <>
          <SelectSucursal
            repartidorId={selectedRepartidor.id}
            onSucursalSelect={(id) => setSelectedSucursalId(id)}
            onRemitosSelect={(remitos) => setSelectedRemitos(remitos)}
          />
          {/* En este ejemplo se usa QRCodeChips para otros códigos o funcionalidades */}
          <QRCodeChips />
        </>
      )}
      <div className="w-full my-2">
        <Button onClick={handleClick} className="w-full my-4">
          Crear Hoja de Ruta
        </Button>
      </div>
    </div>
  );
};

export default NuevaRuta;
