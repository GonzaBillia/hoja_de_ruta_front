import { useState, useEffect } from "react";
import SelectRepartidor from "@/components/modules/new-route/components/select-repartidor";
import SelectSucursal from "@/components/modules/new-route/components/select-sucursal";
import QRCodeChips from "@/components/modules/new-route/components/qrcode-chips";
import { Repartidor } from "@/api/repartidor/types/repartidor.types";
import { useQrContext } from "@/components/context/qr-context";
import { RouteSheet } from "@/api/route-sheets/types/route-sheets.types";
import { Button } from "@/components/ui/button";
import useCreateRouteSheet from "@/api/route-sheets/hooks/useCreateRouteSheet";
import { useToast } from "@/hooks/use-toast";
import { RemitoQuantio } from "@/api/remito/types/remito.types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routeConfig";

const NuevaRuta = () => {
  const [routeData, setRouteData] = useState<RouteSheet | null>(null);
  const [notReady, setNotReady] = useState<boolean>(true)
  const [selectedRepartidor, setSelectedRepartidor] = useState<Repartidor | null>(null);
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(null);
  const [selectedRemitos, setSelectedRemitos] = useState<RemitoQuantio[]>([]);
  const { qrCodes, clearQrCodes } = useQrContext();
  const { toast } = useToast()

  useEffect(() => {
    setTimeout(() => {
      clearQrCodes();
    }, 0);
  }, []);

  // Hook para crear la hoja de ruta
  const { mutate: createRouteSheet, status } = useCreateRouteSheet();
  const navigate = useNavigate()
  const handleClear = () => {
    setRouteData(null)
    setSelectedRepartidor(null)
    setSelectedSucursalId(null)
    setSelectedRemitos([])
    clearQrCodes()
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
        toast({
          title: "Operación Exitosa",
          description: `Se ha creado la hoja de ruta ${routeData?.codigo}`,
          variant: "success",
        });
        handleClear()
        navigate(ROUTES.MAIN)
      },
      onError: (error) => {
        console.error("Error al crear la hoja de ruta:", error);
        let errorMessage = "Error al crear la hoja de ruta.";
        if (error && typeof error === "object" && "response" in error) {
          // @ts-ignore
          errorMessage = error.response?.data?.message || error.response?.data || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  useEffect(() => {
    if (selectedRepartidor && selectedSucursalId && selectedRemitos.length > 0 && qrCodes.length > 0) {
      setNotReady(false)
    } else {
      setNotReady(true)
    }
  }, [selectedRemitos, selectedRepartidor, selectedSucursalId, qrCodes]);

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
            onRemitosSelect={(remitosData) => setSelectedRemitos(remitosData)}
          />
          {selectedRemitos.length > 0 && (
            <QRCodeChips />
          )}
        </>
      )}
      <div className="w-full mt-2 mb-8 md:mb-2">
        <Button onClick={handleClick} className="w-full my-4" disabled={notReady}>
          {status == "pending" ? "Creando..." : "Crear Hoja de Ruta"}
        </Button>
      </div>
    </div>
  );
};

export default NuevaRuta;
