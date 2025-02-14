import { useState, useEffect } from "react";
import SelectRepartidor from "@/components/modules/new-route/components/select-repartidor";
import SelectSucursal from "@/components/modules/new-route/components/select-sucursal";
import QRCodeChips from "@/components/modules/new-route/components/qrcode-chips";
import { Repartidor } from "@/api/repartidor/types/repartidor.types";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { useQrContext } from "@/components/context/qr-context";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import { Button } from "@/components/ui/button";
import useCreateRouteSheet from "@/api/route-sheets/hooks/useCreateRouteSheet";

const NuevaRuta = () => {
  const [routeData, setRouteData] = useState<RouteSheet | null>(null);
  const [selectedRepartidor, setSelectedRepartidor] = useState<Repartidor | null>(null);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(null);
  const [selectedRemitos, setSelectedRemitos] = useState<QrData[]>([]);
  const { qrCodes } = useQrContext();

  // Hook para crear la hoja de ruta
  const { mutate: createRouteSheet, status } = useCreateRouteSheet();

  const handleClear = () => {

  }

  const handleClick = () => {
    // Verifica que se hayan seleccionado todos los datos requeridos
    if (!selectedRepartidor || !selectedSucursalId || selectedRemitos.length === 0 || qrCodes.length === 0) {
      console.error("Faltan datos para crear la hoja de ruta");
      return;
    }

    // Prepara el payload de acuerdo a lo que espera tu API.
    const payload = {
      repartidor_id: selectedRepartidor.id,
      sucursal_id: selectedSucursalId,
      remitos: selectedRemitos,
      scannedQRCodes: qrCodes
    };

    // Llama al hook para crear la hoja de ruta.
    createRouteSheet(payload, {
      onSuccess: (data) => {
        setRouteData(data);
        handleClear()
      },
      onError: (error) => {
        console.error("Error al crear la hoja de ruta:", error);
      },
    });
  };

  useEffect(() => {
    console.log("Hoja Creada", routeData);
  }, [routeData]);

  return (
    <div className="mx-auto min-w-64 max-w-[22rem] md:max-w-[412px] flex flex-col justify-start p-2">
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
          {/* Se usa QRCodeChips para otros códigos o funcionalidades */}
          <QRCodeChips />
        </>
      )}
      <div className="w-full mt-2 mb-8 md:mb-2">
        <Button onClick={handleClick} className="w-full my-4" disabled={status == "pending"}>
          {status == "pending" ? "Creando..." : "Crear Hoja de Ruta"}
        </Button>
      </div>
    </div>
  );
};

export default NuevaRuta;
