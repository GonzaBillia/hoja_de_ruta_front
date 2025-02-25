import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getQRCodeById } from "@/api/qr-code/qrcode";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { ROUTES } from "@/routes/routeConfig";
import { parseCustomFormat } from "@/utils/parseFormatQR";
import { useQrContext } from "@/components/context/qr-context";
import { useToast } from "@/hooks/use-toast";
import { QRCode } from "@/api/qr-code/types/qrcode.types";

interface QRReaderProps {
  onScanSuccess: (data: QrData) => void;
  onScanError?: (error: string) => void;
}

const QRReader: React.FC<QRReaderProps> = ({ onScanSuccess, onScanError }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addQrCode, removeQrCode } = useQrContext();

  // Estado para almacenar el valor que llega del lector
  const [rawInput, setRawInput] = useState("");
  // Estado para activar la consulta (código a validar)
  const [codeToFetch, setCodeToFetch] = useState("");
  // Cola para acumular múltiples códigos (modo múltiple)
  const [queue, setQueue] = useState<QrData[]>([]);
  const location = useLocation();
  const allowMultiple = location.pathname === ROUTES.NUEVA;

  // Usamos useQuery para validar el código
  const { refetch, isLoading } = useQuery<QRCode>({
    queryKey: ["qrcode", codeToFetch],
    queryFn: () => getQRCodeById(codeToFetch),
    enabled: !!codeToFetch,
  });

  // Variable para tener acceso a scannedQr en el bloque catch
  let scannedQr: QrData | null = null;

  const handleEnter = async () => {
    try {
      // Parseamos la cadena recibida del lector
      const parsedResult = parseCustomFormat(rawInput);
      // Convertimos a unknown y luego a QrData para indicarle a TypeScript
      scannedQr = parsedResult as unknown as QrData;
      // Se asume que parseCustomFormat ya corrige el campo "codigo"

      // Verificamos que el código esté definido
      if (!scannedQr.codigo) {
        throw new Error("Código QR inválido o no detectado.");
      }

      // Activamos la consulta asignando el código
      setCodeToFetch(scannedQr.codigo);

      // Validamos el código mediante refetch
      const result = await refetch();
      console.log(result);
      if (result.data) {
        // Construimos el objeto validado; adapta según tu estructura
        const validatedQr: QrData = {
          codigo: result.data.codigo,
          depositCode: scannedQr.depositCode, // o, si la respuesta trae este dato, result.data.depositCode
          tipoBultoCode: scannedQr.tipoBultoCode,
          depositId: result.data.deposito_id,
          tipoBultoId: result.data.tipo_bulto_id,
          serial: result.data.serial,
        };
        console.log(validatedQr);
        if (allowMultiple) {
          // Verifica duplicados antes de agregar
          const isDuplicate = queue.some((qr) => qr.codigo === validatedQr.codigo);
          if (isDuplicate) {
            const duplicateMsg = `Código duplicado: ${validatedQr.codigo}`;
            onScanError?.(duplicateMsg);
            toast({
              title: "Duplicado",
              description: duplicateMsg,
              variant: "destructive",
            });
            return; // No se continúa con el proceso
          }
          // Agregamos a la cola y al contexto
          setQueue((prev) => [...prev, validatedQr]);
          addQrCode(validatedQr);
          toast({
            title: "Escaneo exitoso",
            description: `Código QR ${validatedQr.codigo} leído correctamente.`,
            variant: "success",
          });
          onScanSuccess(validatedQr);
        } else {
          // Modo individual: se agrega al contexto y se notifica el éxito
          addQrCode(validatedQr);
          toast({
            title: "Escaneo exitoso",
            description: `Código QR ${validatedQr.codigo} leído correctamente.`,
            variant: "success",
          });
          onScanSuccess(validatedQr);
        }
      } else {
        throw new Error("No se encontró el código.");
      }
    } catch (error: any) {
      const errMsg = error.message || "Error al validar el código.";
      onScanError?.(errMsg);
      toast({
        title: "Error en el escaneo",
        description: errMsg,
        variant: "destructive",
      });
      // En caso de error, remueve del contexto (si existe) para evitar agregar un objeto vacío
      if (scannedQr && scannedQr.codigo) {
        removeQrCode(scannedQr);
      }
    } finally {
      // Reiniciamos el input y el estado para la próxima lectura
      setRawInput("");
      setCodeToFetch("");
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleEnter();
    }
  };

  // Forzamos el re-enfoque del input si se pierde (cuando no se permite el ingreso manual)
  useEffect(() => {
    if (!inputRef.current) return;
    const handleDocumentClick = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Aseguramos que el input se enfoque al montar
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <label className="text-sm font-medium">Escanea el Código QR con el Lector</label>
      {/* Input oculto para estética, pero activo para capturar la entrada */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Escanea el QR..."
        onKeyDown={handleKeyDown}
        onChange={(e) => setRawInput(e.target.value)}
        onBlur={() => {
          setTimeout(() => {
            if (inputRef.current && document.activeElement !== inputRef.current) {
              inputRef.current.focus();
            }
          }, 10);
        }}
        style={{
          opacity: 0,
          position: "absolute",
          left: "-9999px",
        }}
      />
    </div>
  );
};

export default QRReader;
