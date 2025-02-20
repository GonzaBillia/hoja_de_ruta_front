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
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { QrCode } from "lucide-react";

const QrModalUpdate: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button
          variant="ghost"
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
            Activa la cámara para leer el código QR.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex justify-center">
          {/* Solo renderiza el QrScanner cuando el modal está abierto */}
          {open && (
            <QrScanner
              onScanSuccess={(data: QrData) => {
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

export default QrModalUpdate;
