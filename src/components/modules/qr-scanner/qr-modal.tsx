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
import { FloatingActionButton } from "../nav/components/floating-action-button";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { ROUTES } from "@/routes/routeConfig";
import { useLocation } from "react-router-dom";
import QrModalInfo from "./qr-modal-info";
import QrManualInput from "../../common/qr-scanner/qr-manual-input";
import { isMobile } from "react-device-detect";
import QRReader from "@/components/common/qr-scanner/QRReader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import QRCodeChips from "../new-route/components/qrcode-chips";

const QrModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [qrData, setQrData] = useState<QrData | null>(null);
  const [manualInputEnabled, setManualInputEnabled] = useState(false);
  const location = useLocation();

  /**
   * handleQrScanSuccess:
   * - En modo "cola" (ruta NUEVA) el modal se mantiene abierto para permitir múltiples escaneos.
   * - En modo individual, se cierra el modal y se muestra la info en otro modal.
   */
  const handleQrScanSuccess = (data: QrData) => {
    if (location.pathname === ROUTES.NUEVA) {
      // Modo cola: no se cierra el modal. Se asume que se notifica con toast y se acumula el código.
    } else {
      setOpen(false);
      setScannerReady(false);
      setQrData(data);
    }
  };

  /**
   * Cierra el modal de información.
   */
  const handleCloseQrInfo = () => {
    setQrData(null);
  };

  /**
   * Función de cierre para el modal principal.
   * En modo NUEVA, se permite cerrar el modal manualmente, pero no se cierra automáticamente luego de un escaneo.
   */
  const handleClose = () => {
    if (isMobile && !scannerReady) return;
    setOpen(false);
    setScannerReady(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          // En modo individual se evita cerrar el modal si el scanner no está listo
          if (!isOpen && !scannerReady) return;
          setOpen(isOpen);
          if (!isOpen) {
            setScannerReady(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <FloatingActionButton />
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
                  // En móvil: si el ingreso manual no está habilitado se usa QrScanner, de lo contrario QrManualInput
                  manualInputEnabled ? (
                    <QrManualInput onSuccess={handleQrScanSuccess} />
                  ) : (
                    <QrScanner
                      active={open}
                      onScannerReady={() => setScannerReady(true)}
                      onScanSuccess={handleQrScanSuccess}
                      width={300}
                      height={300}
                    />
                  )
                ) : (
                  // En escritorio: si el ingreso manual no está habilitado se usa QRReader, de lo contrario QrManualInput
                  manualInputEnabled ? (
                    <QrManualInput onSuccess={handleQrScanSuccess} />
                  ) : (
                    <>
                      <QRReader onScanSuccess={handleQrScanSuccess} />
                      {location.pathname === ROUTES.NUEVA && (
                        <QRCodeChips />
                      )}
                    </>
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

      {/* Modal de información para modo individual */}
      {qrData && (
        <QrModalInfo
          key={qrData.codigo}
          qrData={qrData}
          onClose={handleCloseQrInfo}
        />
      )}
    </>
  );
};

export default QrModal;
