export interface QrData {
  codigo: string;
  depositCode: string;
  tipoBultoCode: string;
  depositId: string;
  tipoBultoId: string;
  serial: number;
  // Propiedades adicionales, por ejemplo, para filtrar por sucursal:
  CliApeNom?: string;
  // Propiedad para identificar el QR (se usa en el key y comparación)
  Numero: string;
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