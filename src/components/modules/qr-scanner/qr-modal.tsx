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

const QrModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
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
          {/* Solo renderiza el QrScanner cuando el modal está abierto */}
          {open && (
            <QrScanner
              onScanSuccess={(data: QrData) => {
                console.log("Datos parseados del QR:", data);
                setOpen(false); // Cierra el modal si ya se escaneó algo
              }}
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
  );
};

export default QrModal;
