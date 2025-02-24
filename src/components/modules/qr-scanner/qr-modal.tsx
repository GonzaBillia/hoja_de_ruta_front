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
import QrManualInput from "./qr-manual-input";

const QrModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [qrData, setQrData] = useState<QrData | null>(null);
  const location = useLocation();

  /**
   * Evita que se cierre el modal si el scanner no está listo.
   */
  const handleClose = () => {
    if (!scannerReady) return;
    setOpen(false);
    setScannerReady(false); // Reinicia el estado para la próxima apertura
  };

  /**
   * Lógica al capturar un QR exitoso.
   */
  const handleQrScanSuccess = (data: QrData) => {
    setOpen(false);
    setScannerReady(false);

    // Si no estamos en la ruta "NUEVA", abrimos otro modal de info
    if (location.pathname !== ROUTES.NUEVA) {
      setQrData(data);
    }
  };

  /**
   * Cierra el modal de información.
   */
  const handleCloseQrInfo = () => {
    setQrData(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          // Si se intenta cerrar (isOpen=false) pero el scanner no está listo, se ignora
          if (!isOpen && !scannerReady) return;
          setOpen(isOpen);

          // Si cierra, limpiamos el estado
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
              Activa la cámara para leer el código QR.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 flex justify-center">
            {open && (
              <div className="flex flex-col justify-center">
                <QrScanner
                  active={open}
                  onScannerReady={() => setScannerReady(true)}
                  onScanSuccess={handleQrScanSuccess}
                  width={300}
                  height={300}
                />
                <QrManualInput onSuccess={handleQrScanSuccess} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={!scannerReady}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de información si se escaneó un QR con éxito */}
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
