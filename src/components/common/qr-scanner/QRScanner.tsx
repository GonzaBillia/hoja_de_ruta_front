import React, { useEffect, useRef } from "react";
import { 
  Html5Qrcode, 
  Html5QrcodeCameraScanConfig, 
  QrcodeErrorCallback 
} from "html5-qrcode";
import { useQrContext } from "@/components/context/qr-context";
import { QrData, QrScannerProps } from "./types/qr-scanner";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/routes/routeConfig";

const QrScanner: React.FC<QrScannerProps> = ({
  onScanSuccess,
  onScanError,
  width = 300,
  height = 300,
}) => {
  const qrRegionId = "qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  // Flag para saber si el scanner se inició correctamente.
  const scannerStarted = useRef(false);
  const { addQrCode, qrCodes } = useQrContext();
  const { toast } = useToast();

  useEffect(() => {
    const initTimeout = setTimeout(() => {
      const qrElement = document.getElementById(qrRegionId);
      if (!qrElement || qrElement.offsetWidth === 0) {
        console.error("El contenedor del lector no tiene dimensiones válidas.");
        return;
      }
      html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

      const config: Html5QrcodeCameraScanConfig = { 
        fps: 10,
        qrbox: { width: 250, height: 250 }
      };

      const errorCallback: QrcodeErrorCallback = (errorMessage: string) => {
        if (errorMessage.includes("NotFoundException")) {
          return;
        }
        if (onScanError) {
          onScanError(errorMessage);
        }
        toast({
          title: "Error en el escaneo",
          description: errorMessage,
          variant: "destructive",
        });
      };

      html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          try {
            const data: QrData = JSON.parse(decodedText);

            // Validar si el código ya fue leído
            const duplicate = qrCodes.some((qr) => qr.codigo === data.codigo);
            if (duplicate && location.pathname === ROUTES.NUEVA) {
              const duplicateMessage = `Código QR duplicado: ${data.codigo}`;
              if (onScanError) {
                onScanError(duplicateMessage);
              }
              toast({
                title: "Duplicado",
                description: duplicateMessage,
                variant: "destructive",
              });
              return;
            }

            // Notificar escaneo exitoso
            toast({
              title: "Escaneo exitoso",
              description: `Código QR ${data.codigo} leído correctamente.`,
              variant: "success",
            });

            if (onScanSuccess) {
              onScanSuccess(data);
            }
            addQrCode(data);
          } catch (error) {
            const errorMsg = "Error al parsear el JSON: " + error;
            if (onScanError) {
              onScanError(errorMsg);
            }
            toast({
              title: "Error en el escaneo",
              description: errorMsg,
              variant: "destructive",
            });
          }
        },
        errorCallback
      ).then(() => {
        // Indicamos que el scanner se inició correctamente
        scannerStarted.current = true;
      }).catch((err) => {
        console.error("Error al iniciar el lector de QR:", err);
        toast({
          title: "Error al iniciar el lector de QR",
          description: String(err),
          variant: "destructive",
        });
      });
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      // Solo se llama a stop si el scanner se inició
      if (html5QrCodeRef.current && scannerStarted.current) {
        html5QrCodeRef.current.stop()
          .then(() => html5QrCodeRef.current?.clear())
          .catch((err) => {
            // Si el error es de que el scanner no está corriendo, se ignora.
            if (err.toString().includes("scanner is not running or paused")) {
              return;
            }
            console.error("Error al detener el lector de QR:", err);
            toast({
              title: "Error al detener el lector",
              description: String(err),
              variant: "destructive",
            });
          });
      }
    };
  }, [onScanSuccess, onScanError, addQrCode, qrCodes, toast]);

  return (
    <div>
      <div
        id={qrRegionId}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default QrScanner;
