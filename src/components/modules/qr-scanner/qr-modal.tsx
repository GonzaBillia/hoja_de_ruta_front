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

const QrModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [qrData, setQrData] = useState<QrData | null>(null);
  const location = useLocation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleQrScanSuccess = (data: QrData) => {
    setOpen(false); // Cierra el modal del scanner
    if (location.pathname !== ROUTES.NUEVA) {
      setQrData(data); // Guarda los datos del QR para renderizar el modal de información
    }
  };

  const handleCloseQrInfo = () => {
    setQrData(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
            {/* Renderiza el QrScanner solo cuando el modal está abierto */}
            {open && (
              <QrScanner
                onScanSuccess={handleQrScanSuccess}
                width={300}
                height={300}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renderizado condicional del modal de información */}
      {qrData && (
        <QrModalInfo key={qrData.codigo} qrData={qrData} onClose={handleCloseQrInfo} />
      )}
    </>
  );
};

export default QrModal;
