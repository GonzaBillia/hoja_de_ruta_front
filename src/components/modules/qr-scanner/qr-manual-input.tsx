import React, { useState } from "react";
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
import { useQrContext } from "@/components/context/qr-context";

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

  const {qrCodes, addQrCode} = useQrContext()

  // Usamos useQuery con enabled: !!codeToFetch para que no haga fetch hasta que codeToFetch sea no vacío.
  const {  isLoading,  refetch } = useQuery<QRCode>({
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
    const upperCode = inputCode.toUpperCase();
    const finalCode = `${upperCode.slice(0, 2)}-${upperCode.slice(2, 4)}-${upperCode.slice(4)}`;
    setCodeToFetch(finalCode);
    try {
      const result = await refetch();
      if (result.data) {
        const qrData: QrData = { codigo: result.data.codigo, tipoBultoId: result.data.tipo_bulto_id, tipoBultoCode: upperCode.slice(2, 4), depositId: result.data.deposito_id, depositCode:upperCode.slice(0,2), serial: result.data.serial };
        // Verificar duplicados (si el contexto ya tiene ese código)
        const duplicate = qrCodes.some((qr) => qr.codigo === qrData.codigo);
        if (duplicate) {
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
    }
  };
  
  

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
      <Button className="mt-4" onClick={handleValidate} disabled={isLoading}>
        {isLoading ? "Validando..." : "Validar Código"}
      </Button>
    </div>
  );
};

export default QrManualInput;
