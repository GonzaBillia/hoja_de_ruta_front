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

interface ExtendedQrScannerProps extends QrScannerProps {
  /** 
   * Controla si el scanner está activo o no (por ejemplo, cuando el modal está abierto).
   */
  active: boolean;
  /** 
   * Callback que se llama cuando la inicialización del scanner ha terminado con éxito.
   */
  onScannerReady?: () => void;
}

const QrScanner: React.FC<ExtendedQrScannerProps> = ({
  active,
  onScannerReady,
  onScanSuccess,
  onScanError,
  width = 300,
  height = 300,
}) => {
  const qrRegionId = "qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerStarted = useRef(false);
  const errorShownRef = useRef(false);
  const { addQrCode, qrCodes } = useQrContext();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    // Iniciamos con un pequeño retardo para dar tiempo al DOM a renderizar
    const initTimeout = setTimeout(() => {
      if (cancelled) return;

      const qrElement = document.getElementById(qrRegionId);

      // Verificamos que el contenedor tenga un tamaño válido
      if (!qrElement || qrElement.offsetWidth === 0) {
        const errorMsg = "El contenedor del lector no tiene dimensiones válidas (width=0).";
        if (!errorShownRef.current) {
          console.error(errorMsg);
          toast({
            title: "Error en el escaneo",
            description: errorMsg,
            variant: "destructive",
          });
          errorShownRef.current = true;
        }
        return;
      }

      // Creamos la instancia de Html5Qrcode
      try {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      } catch (err) {
        console.error("Error al crear instancia de Html5Qrcode:", err);
        return;
      }

      // Configuración del escáner
      const config: Html5QrcodeCameraScanConfig = { 
        fps: 10,
        qrbox: { width: 250, height: 250 }
      };

      // Callback de errores de lectura
      const errorCallback: QrcodeErrorCallback = (errorMessage: string) => {
        // "NotFoundException" ocurre en cada frame que no se encuentra un QR, no lo toasteamos.
        if (errorMessage.includes("NotFoundException")) {
          return;
        }
        if (!errorShownRef.current) {
          console.error("Error callback:", errorMessage);
          if (onScanError) onScanError(errorMessage);
          toast({
            title: "Error en el escaneo",
            description: errorMessage,
            variant: "destructive",
          });
          errorShownRef.current = true;
        }
      };

      // Iniciamos el escáner
      html5QrCodeRef.current.start(
        { facingMode: "environment" },  // O { exact: "user" } si quieres cámara frontal
        config,
        (decodedText: string) => {
          // Éxito en la decodificación de un frame
          try {
            const data: QrData = JSON.parse(decodedText);

            // Verificamos si es un duplicado (caso de "Nueva" ruta, por ejemplo)
            const duplicate = qrCodes.some((qr) => qr.codigo === data.codigo);
            if (duplicate && location.pathname === ROUTES.NUEVA) {
              const duplicateMessage = `Código QR duplicado: ${data.codigo}`;
              if (!errorShownRef.current) {
                console.error(duplicateMessage);
                if (onScanError) onScanError(duplicateMessage);
                toast({
                  title: "Duplicado",
                  description: duplicateMessage,
                  variant: "destructive",
                });
                errorShownRef.current = true;
              }
              return;
            }

            // Si todo va bien, notificamos el escaneo
            toast({
              title: "Escaneo exitoso",
              description: `Código QR ${data.codigo} leído correctamente.`,
              variant: "success",
            });

            if (onScanSuccess) onScanSuccess(data);
            addQrCode(data);

          } catch (error) {
            const errorMsg = "Error al parsear el JSON: " + error;
            if (!errorShownRef.current) {
              console.error(errorMsg);
              if (onScanError) onScanError(errorMsg);
              toast({
                title: "Error en el escaneo",
                description: errorMsg,
                variant: "destructive",
              });
              errorShownRef.current = true;
            }
          }
        },
        errorCallback
      ).then(() => {
        // Una vez que start() se resuelve satisfactoriamente
        if (!cancelled) {
          scannerStarted.current = true;
          onScannerReady?.();
        }
      }).catch((err) => {
        // Si falla la promesa de start()
        const errMsg = "Error al iniciar el lector de QR: " + err;
        if (!errorShownRef.current) {
          console.error(errMsg);
          toast({
            title: "Error al iniciar el lector de QR",
            description: errMsg,
            variant: "destructive",
          });
          errorShownRef.current = true;
        }
      });
    }, 100);

    // Cleanup al desmontar
    return () => {
      cancelled = true;
      clearTimeout(initTimeout);

      if (html5QrCodeRef.current && scannerStarted.current) {
        // Envolvemos la detención y limpieza en try/catch para capturar errores
        try {
          html5QrCodeRef.current.stop()
            .then(() => {
              try {
                html5QrCodeRef.current?.clear();
              } catch (clearErr) {
                console.error("Error al limpiar el lector de QR:", clearErr);
              }
            })
            .catch((stopErr) => {
              console.error("Error al detener el lector de QR:", stopErr);
            });
        } catch (err) {
          console.error("Error al ejecutar stop en el lector de QR:", err);
        }
      }
    };
  }, [
    onScanSuccess,
    onScanError,
    addQrCode,
    qrCodes,
    toast,
    qrRegionId,
    onScannerReady
  ]);

  // Efecto para detener el escáner si "active" se vuelve false (por ejemplo, cierras el modal)
  useEffect(() => {
    if (!active && html5QrCodeRef.current && scannerStarted.current) {
      try {
        html5QrCodeRef.current.stop()
          .then(() => {
            try {
              html5QrCodeRef.current?.clear();
            } catch (clearErr) {
              console.error("Error al limpiar el lector de QR al desactivar:", clearErr);
            }
          })
          .catch((err) => {
            console.error("Error al detener el lector de QR al desactivar:", err);
          });
      } catch (err) {
        console.error("Error al ejecutar stop al desactivar:", err);
      }
    }
  }, [active, toast]);

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
