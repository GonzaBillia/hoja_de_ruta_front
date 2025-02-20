import { useQuery } from '@tanstack/react-query';
import { getQRCodeById } from "../qrcode";
import { QRCode } from "../types/qrcode.types";

export const useQRCode = (codigo: string) => {
  return useQuery<QRCode>({
    queryKey: ['qrcode', codigo],
    queryFn: () => getQRCodeById(codigo),
    enabled: !!codigo,
  });
};

export default useQRCode;
