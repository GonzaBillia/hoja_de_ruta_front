import React, { useState, useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQRCodeById } from "@/api/qr-code/qrcode";
import { QRCode } from "@/api/qr-code/types/qrcode.types";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { useToast } from "@/hooks/use-toast";
import { useQrContext } from "@/components/context/qr-context";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/routes/routeConfig";

interface QrManualInputProps {
  onSuccess: (data: QrData) => void;
  onError?: (error: string) => void;
}

const MANUAL_CODE_LENGTH = 10;

const QrManualInput: React.FC<QrManualInputProps> = ({ onSuccess, onError }) => {
  const [inputCode, setInputCode] = useState("");
  const [codeToFetch, setCodeToFetch] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { qrCodes, addQrCode } = useQrContext();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref para el input

  const location = useLocation();
  const { refetch } = useQuery<QRCode>({
    queryKey: ["qrcode", codeToFetch],
    queryFn: () => getQRCodeById(codeToFetch),
    enabled: !!codeToFetch,
  });

  const handleValidate = async () => {
    if (inputCode.trim().length !== MANUAL_CODE_LENGTH) {
      toast({
        title: "Código incompleto",
        description: `El código debe tener ${MANUAL_CODE_LENGTH} dígitos.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const upperCode = inputCode.toUpperCase();
    const finalCode = `${upperCode.slice(0, 2)}-${upperCode.slice(2, 4)}-${upperCode.slice(4)}`;
    setCodeToFetch(finalCode);
    try {
      const result = await refetch();
      if (result.data) {
        const qrData: QrData = {
          codigo: result.data.codigo,
          tipoBultoId: result.data.tipo_bulto_id,
          tipoBultoCode: upperCode.slice(2, 4),
          depositId: result.data.deposito_id,
          depositCode: upperCode.slice(0, 2),
          serial: result.data.serial,
        };
        const duplicate = qrCodes.some((qr) => qr.codigo === qrData.codigo);
        if (duplicate && location.pathname === ROUTES.NUEVA) {
          toast({
            title: "Código duplicado",
            description: `El código QR ${qrData.codigo} ya fue escaneado.`,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Escaneo exitoso",
          description: `Código QR ${qrData.codigo} leído correctamente.`,
          variant: "success",
        });
        onSuccess(qrData);
        addQrCode(qrData);
      } else {
        throw new Error("No se encontró el código.");
      }
    } catch (err: any) {
      toast({
        title: "Error en la validación",
        description: err.message || "Error al validar el código.",
        variant: "destructive",
      });
      if (onError) onError(err.message);
    } finally {
      // Limpiar el input y volver a hacer foco
      setInputCode("");
      inputRef.current?.focus();
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setInputCode(upperValue);
    if (upperValue.length === MANUAL_CODE_LENGTH) {
      // Opcional: Enfocar el botón si se prefiere
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="mt-4 w-full flex flex-col items-center">
      <InputOTP
        ref={inputRef} // Se asigna la ref al InputOTP
        value={inputCode} // Se controla el valor del input
        maxLength={MANUAL_CODE_LENGTH}
        onChange={handleChange}
        className="max-w-24"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="h-6 w-6 capitalize" />
          <InputOTPSlot index={1} className="h-6 w-6 capitalize" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} className="h-6 w-6 capitalize" />
          <InputOTPSlot index={3} className="h-6 w-6 capitalize" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} className="h-6 w-6" />
          <InputOTPSlot index={5} className="h-6 w-6" />
          <InputOTPSlot index={6} className="h-6 w-6" />
          <InputOTPSlot index={7} className="h-6 w-6" />
          <InputOTPSlot index={8} className="h-6 w-6" />
          <InputOTPSlot index={9} className="h-6 w-6" />
        </InputOTPGroup>
      </InputOTP>
      <Button
        ref={buttonRef}
        className="mt-4"
        onClick={handleValidate}
        disabled={loading}
      >
        {loading ? "Validando..." : "Validar Código"}
      </Button>
    </div>
  );
};

export default QrManualInput;
