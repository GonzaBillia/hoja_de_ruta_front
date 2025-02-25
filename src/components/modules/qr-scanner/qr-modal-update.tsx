import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QrScanner from "@/components/common/qr-scanner/QRScanner";
import { QrCode } from "lucide-react";
import QrManualInput from "../../common/qr-scanner/qr-manual-input";
import { isMobile } from "react-device-detect";
import QRReader from "@/components/common/qr-scanner/QRReader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const QrModalUpdate: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [manualInputEnabled, setManualInputEnabled] = useState(false);

  // Función para cerrar el modal manualmente.
  // En modo actualización se mantiene abierto tras escanear, salvo que el usuario decida cerrarlo.
  const handleClose = () => {
    setOpen(false);
    setScannerReady(false);
  };

  return (
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
        <div className="py-4 flex justify-center">
          {open && (
            <div className="flex flex-col justify-center space-y-4">
              {isMobile ? (
                manualInputEnabled ? (
                  <QrManualInput
                    onSuccess={(data) => {
                      console.log("QR Escaneado (manual):", data);
                      // En modo actualización no se cierra el modal
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
                      console.log("QR Escaneado (móvil):", data);
                      // En modo actualización, el modal permanece abierto
                    }}
                    width={300}
                    height={300}
                  />
                )
              ) : (
                manualInputEnabled ? (
                  <QrManualInput
                    onSuccess={(data) => {
                      console.log("QR Escaneado (manual):", data);
                      // Procesa el escaneo manual sin cerrar el modal
                    }}
                    onError={(error) =>
                      console.error("Error en ingreso manual:", error)
                    }
                  />
                ) : (
                  <QRReader
                    onScanSuccess={(data) => {
                      console.log("QR Escaneado (escritorio):", data);
                      // QRReader mantiene el modal abierto y re-enfoca el input
                    }}
                    onScanError={(error) =>
                      console.error("Error al escanear:", error)
                    }
                  />
                )
              )}
            </div>
          )}
          
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isMobile && !scannerReady}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrModalUpdate;
