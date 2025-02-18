"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useQrContext } from "@/components/context/qr-context";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import QRCodeSummary from "./qrcode-sumary";
import QrModalUpdate from "../../qr-scanner/qr-modal-update";

interface QRCodeChipsProps {
  onChange?: (codes: QrData[]) => void;
  initialCodes?: QrData[];
}

const QRCodeChips: React.FC<QRCodeChipsProps> = ({ initialCodes, onChange }) => {
  const { qrCodes, removeQrCode, addQrCode, clearQrCodes } = useQrContext();

  // Si se recibe un array de códigos, actualiza el context.
  useEffect(() => {
    if (initialCodes) {
      clearQrCodes();
      initialCodes.forEach((code) => addQrCode(code));
    }
  }, [initialCodes]); // Se remueven addQrCode y clearQrCodes de las dependencias

  // Notifica al padre si se requiere, cada vez que cambien los qrCodes
  useEffect(() => {
    if (onChange) {
      onChange(qrCodes);
    }
  }, [qrCodes, onChange]);

  return (
    <div className="flex flex-col gap-4 py-2 my-4">
      <span>Códigos QR Escaneados</span>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {qrCodes.length !== 0 ? (
          qrCodes.map((code, index) => (
            <Badge key={index} className="flex items-center gap-1 overflow-auto">
              <span>{code.codigo}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQrCode(code)}
                className="py-0 pl-1 pr-0 hover:bg-transparent hover:text-red-600"
                title="Eliminar código"
              >
                <X size={16} />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="text-accent-foreground p-4">
            Escanea un Código QR para comenzar
          </p>
        )}
      </div>
      {initialCodes && (
          <div className="flex">
            <QrModalUpdate />
          </div>
        )}
      {!initialCodes && <QRCodeSummary />}
    </div>
  );
};

export default QRCodeChips;
