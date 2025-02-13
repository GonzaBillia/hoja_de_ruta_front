"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useQrContext } from "@/components/context/qr-context";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";

interface QRCodeChipsProps {
  onChange?: (codes: QrData[]) => void;
}

const QRCodeChips: React.FC<QRCodeChipsProps> = () => {
  const { qrCodes, removeQrCode } = useQrContext();

  // Si deseas notificar a un componente padre, puedes utilizar un efecto.
  // Por ejemplo:
  // useEffect(() => { onChange && onChange(qrCodes); }, [qrCodes]);

  return (
    <div className="flex flex-col gap-4 py-2 my-4">
        <span>Remitos Escaneados</span>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {qrCodes.length != 0 ? qrCodes.map((code, index) => (
          <Badge key={index} className="flex items-center gap-1 overflow-auto">
            <span>{code.codigo}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeQrCode(code)}
              className="p-0 hover:bg-transparent hover:text-red-600"
              title="Eliminar código"
            >
              <X size={16} />
            </Button>
          </Badge>
        )) : <p className="text-accent-foreground p-4 ">Escanea un Código QR para comenzar</p>}
      </div>
    </div>
  );
};

export default QRCodeChips;
