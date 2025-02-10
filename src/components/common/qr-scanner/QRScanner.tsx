import React, { useEffect, useRef } from "react";
import { 
  Html5Qrcode, 
  Html5QrcodeCameraScanConfig, 
  QrcodeErrorCallback 
} from "html5-qrcode";
import { QrData, QrScannerProps } from "./types/qr-scanner";

const QrScanner: React.FC<QrScannerProps> = ({
  onScanSuccess,
  onScanError,
  width = 300,
  height = 300,
}) => {
  const qrRegionId = "qr-reader";
  // Referencia para guardar la instancia de Html5Qrcode.
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Retrasamos la inicialización para que el contenedor ya tenga dimensiones válidas.
    const initTimeout = setTimeout(() => {
      const qrElement = document.getElementById(qrRegionId);
      if (!qrElement || qrElement.offsetWidth === 0) {
        console.error("El contenedor del lector no tiene dimensiones válidas.");
        return;
      }

      // Crea la instancia del lector.
      html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

      // Configuración: fps y tamaño del área de detección.
      const config: Html5QrcodeCameraScanConfig = { 
        fps: 10,
        qrbox: { width: 250, height: 250 }
      };

      // Callback para manejar errores durante el escaneo.
      const errorCallback: QrcodeErrorCallback = (errorMessage: string) => {
        // Ignorar el error si indica que no se encontró un código (NotFoundException)
        if (errorMessage.includes("NotFoundException")) {
          return;
        }
        console.warn("Error durante la lectura del QR:", errorMessage);
        if (onScanError) {
          onScanError(errorMessage);
        }
      };

      // Inicia el escáner usando la cámara trasera.
      html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          // Intentamos parsear el JSON recibido en decodedText.
          try {
            const data: QrData = JSON.parse(decodedText);
            if (onScanSuccess) {
              onScanSuccess(data);
            }
          } catch (error) {
            console.error("Error al parsear el JSON:", error);
            if (onScanError) {
              onScanError("Error al parsear el JSON: " + error);
            }
          }
        },
        errorCallback
      ).catch((err) => {
        console.error("Error al iniciar el lector de QR:", err);
      });
    }, 100); // Retraso de 100 ms (ajustable según tus necesidades)

    return () => {
      clearTimeout(initTimeout);
      // Al desmontar, detener y limpiar la instancia.
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop()
          .then(() => html5QrCodeRef.current?.clear())
          .catch((err) => {
            console.error("Error al detener el lector de QR:", err);
          });
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div>
      {/* Contenedor donde se mostrará la vista de la cámara */}
      <div
        id={qrRegionId}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default QrScanner;
