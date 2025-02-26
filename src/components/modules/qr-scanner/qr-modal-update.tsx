import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import QrScanner from "@/components/common/qr-scanner/QRScanner";
import QRReader from "@/components/common/qr-scanner/QRReader";
import QrManualInput from "@/components/common/qr-scanner/qr-manual-input";
import { isMobile } from "react-device-detect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Tabladatas from "@/pages/HojasRuta/components/ControlTable";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/routes/routeConfig";
import { useQrContext } from "@/components/context/qr-context";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/formatDate";
// Importa el tipo extendido que incluye la propiedad currentBultos
import { ExtendedBulto } from "@/pages/HojasRuta/components/ControlarhojaRuta";

interface QrModalUpdateProps {
  bultos: ExtendedBulto[];
  setBultos: React.Dispatch<React.SetStateAction<ExtendedBulto[]>>;
}

const QrModalUpdate: React.FC<QrModalUpdateProps> = ({ bultos, setBultos }) => {
  const [open, setOpen] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [manualInputEnabled, setManualInputEnabled] = useState(false);
  const location = useLocation();
  const { clearQrCodes, addQrCode, qrCodes } = useQrContext();
  const { toast } = useToast();

  // Al abrir el modal, limpiamos el contexto para comenzar vacío.
  useEffect(() => {
    if (open) clearQrCodes();
  }, [open, clearQrCodes]);

  // Para procesar cada nuevo código escaneado
  const [processing, setProcessing] = useState(false);
  const prevQrCodesLength = useRef(0);

  useEffect(() => {
    // Si no han aumentado los códigos, no procesamos
    if (qrCodes.length <= prevQrCodesLength.current) return;
    prevQrCodesLength.current = qrCodes.length;
    if (processing || qrCodes.length === 0) return;

    setProcessing(true);
    const scannedCode = qrCodes[0]?.codigo;
    if (!scannedCode) {
      clearQrCodes();
      setProcessing(false);
      return;
    }

    const index = bultos.findIndex((b) => b.codigo === scannedCode);
    if (index === -1) {
      toast({
        title: "Código no corresponde a ningún bulto de esta hoja de ruta",
        variant: "destructive",
      });
      clearQrCodes();
      setProcessing(false);
      return;
    }

    const bultoFound = bultos[index];
    // Se utiliza currentBultos para obtener el registro activo (se asume que es el primer elemento)
    const activeCurrent =
      bultoFound.currentBultos && bultoFound.currentBultos.length > 0
        ? bultoFound.currentBultos[0]
        : undefined;

    if (activeCurrent && activeCurrent.actualRecibido) {
      toast({
        title: "Este bulto ya ha sido escaneado",
        variant: "destructive",
      });
      clearQrCodes();
      setProcessing(false);
      return;
    }

    // Actualiza el registro activo: marca actualRecibido como true y actualFechaRecibido con el timestamp actual
    if (bultoFound.currentBultos) {
      const updatedCurrent = bultoFound.currentBultos.map((current, idx) =>
        idx === 0
          ? {
              ...current,
              actualRecibido: true,
              actualFechaRecibido: formatDate(new Date()),
            }
          : current
      );
      const updatedBultos = [...bultos];
      updatedBultos[index] = { ...bultoFound, currentBultos: updatedCurrent };
      setBultos(updatedBultos);
    }
    clearQrCodes();
    setProcessing(false);
  }, [qrCodes, bultos, clearQrCodes, toast, setBultos, processing]);

  // Handler para escaneo exitoso (automático o manual)
  const handleQrScanSuccess = (data: QrData) => {
    if (
      location.pathname === ROUTES.NUEVA ||
      location.pathname.startsWith(ROUTES.DETALLE)
    ) {
      // En modo "cola": actualizamos el estado directamente
      addQrCode(data);
    } else {
      setOpen(false);
      setScannerReady(false);
    }
  };

  const handleClose = () => {
    if (isMobile && !scannerReady) return;
    setOpen(false);
    setScannerReady(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-xl w-full mx-auto px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Escanear"
          >
            <QrCode className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Escanear Código QR</DialogTitle>
            <DialogDescription>
              {isMobile
                ? "Activa la cámara para leer el código QR."
                : "Utiliza el lector para capturar el código QR."}
            </DialogDescription>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="manual-input-checkbox"
                checked={manualInputEnabled}
                onCheckedChange={(checked) =>
                  setManualInputEnabled(checked as boolean)
                }
              />
              <Label htmlFor="manual-input-checkbox">
                Habilitar ingreso manual
              </Label>
            </div>
          </DialogHeader>
          <div className="py-4 flex flex-col space-y-4">
            {open && (
              <>
                {isMobile ? (
                  manualInputEnabled ? (
                    <QrManualInput
                      onSuccess={(data) => {
                        handleQrScanSuccess(data);
                      }}
                      onError={(error) =>
                        console.error("Error en ingreso manual:", error)
                      }
                    />
                  ) : (
                    <QrScanner
                      active={open}
                      onScannerReady={() => setScannerReady(true)}
                      onScanSuccess={(data) => {
                        handleQrScanSuccess(data);
                      }}
                      width={300}
                      height={300}
                    />
                  )
                ) : manualInputEnabled ? (
                  <QrManualInput
                    onSuccess={(data) => {
                      handleQrScanSuccess(data);
                    }}
                    onError={(error) =>
                      console.error("Error en ingreso manual:", error)
                    }
                  />
                ) : (
                  <QRReader
                    onScanSuccess={(data) => {
                      handleQrScanSuccess(data);
                    }}
                    onScanError={(error) =>
                      console.error("Error al escanear:", error)
                    }
                  />
                )}
                {/* Visualizamos la tabla de bultos */}
                <Tabladatas data={bultos} />
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleClose}>
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </>
  );
};

export default QrModalUpdate;
