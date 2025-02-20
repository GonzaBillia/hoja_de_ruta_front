import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQRCodeById } from "@/api/qr-code/qrcode"; // asegúrate de la ruta correcta
import { QRCode } from "@/api/qr-code/types/qrcode.types";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { useToast } from "@/hooks/use-toast";

interface QrManualInputProps {
  onSuccess: (data: QrData) => void;
  onError?: (error: string) => void;
}

// Se asume que el usuario ingresa 10 dígitos sin separadores.
// El código final tendrá el formato: XX-XX-XXXXXX (12 caracteres) y todas las letras en mayúsculas.
const MANUAL_CODE_LENGTH = 10;

const QrManualInput: React.FC<QrManualInputProps> = ({ onSuccess, onError }) => {
  // Estado para el valor que escribe el usuario (sin separadores)
  const [inputCode, setInputCode] = useState("");
  // Estado para el código final que se usará en la consulta.
  const [codeToFetch, setCodeToFetch] = useState("");

  const { toast } = useToast();

  // Usamos useQuery con enabled: !!codeToFetch para que no haga fetch hasta que codeToFetch sea no vacío.
  const { data, isLoading, error, refetch } = useQuery<QRCode>({
    queryKey: ["qrcode", codeToFetch],
    queryFn: () => getQRCodeById(codeToFetch),
    enabled: !!codeToFetch,
  });

  // Cuando el usuario presiona el botón, se valida el código y se arma el código final.
  const handleValidate = async () => {
    if (inputCode.trim().length !== MANUAL_CODE_LENGTH) {
      toast({
        title: "Código incompleto",
        description: `El código debe tener ${MANUAL_CODE_LENGTH} dígitos.`,
        variant: "destructive",
      });
      return;
    }
    // Convierte a mayúsculas y agrega los separadores.
    const upperCode = inputCode.toUpperCase();
    const finalCode = `${upperCode.slice(0, 2)}-${upperCode.slice(2, 4)}-${upperCode.slice(4)}`;
    // Asignamos el código final al estado que activa la consulta.
    setCodeToFetch(finalCode);
    try {
      await refetch();
    } catch (err: any) {
      toast({
        title: "Error en la validación",
        description: err.message || "Error al validar el código.",
        variant: "destructive",
      });
      if (onError) onError(err.message);
    }
  };

  // Cuando se obtiene la respuesta del query, se procede.
  useEffect(() => {
    if (data) {
      const qrData: QrData = { codigo: data.codigo };
      onSuccess(qrData);
    }
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      if (onError) onError(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  return (
    <div className="mt-4 w-full flex flex-col items-center">
      <p className="text-center font-medium pb-2">
        O ingresa manualmente el código:
      </p>
      <InputOTP
        maxLength={MANUAL_CODE_LENGTH}
        onChange={(value: string) => setInputCode(value.toUpperCase())}
        className="max-w-24"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="h-6 w-6" />
          <InputOTPSlot index={1} className="h-6 w-6" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} className="h-6 w-6" />
          <InputOTPSlot index={3} className="h-6 w-6" />
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
      <Button className="mt-4" onClick={handleValidate} disabled={isLoading}>
        {isLoading ? "Validando..." : "Validar Código"}
      </Button>
    </div>
  );
};

export default QrManualInput;
