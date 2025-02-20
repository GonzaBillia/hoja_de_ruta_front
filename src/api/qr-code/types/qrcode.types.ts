export interface QRCode {
  codigo: string;         // Código armado único (primary key)
  qr_base64: string | null;
  serial: number;
  deposito_id: number;
  bulto_id?: number | null;
  tipo_bulto_id: number;
  created_at: string;
}

export interface QRCodeResponse {
  success: boolean;
  message: string;
  data: QRCode | QRCode[];
}

export interface QRCodeStrResponse {
  success: boolean;
  message: string;
  data: string | string[];
}

export interface CreateQRCodePayload {
  codigo_deposito: string,
  deposito_id: number,
  tipo_bulto: string,
  tipo_bulto_id: number,
  cantidad: number
}

export interface UpdateQRCodePayload {
  // Campos a actualizar, por ejemplo:
  qr_base64?: string;
  bulto_id?: number | null;
}
