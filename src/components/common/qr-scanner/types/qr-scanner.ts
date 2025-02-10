export interface QrData {
  depositCode: string;
  tipoBultoCode: string;
  depositId: string;
  tipoBultoId: string;
  serial: number;
}

export interface QrScannerProps {
  // Callback que se ejecuta cuando se detecta un QR exitosamente.
  onScanSuccess?: (data: QrData) => void;
  // Callback para manejar errores durante el escaneo.
  onScanError?: (errorMessage: string) => void;
  // Opcionalmente, ancho y alto del contenedor.
  width?: number;
  height?: number;
}