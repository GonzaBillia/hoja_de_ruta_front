import { useQuery } from '@tanstack/react-query';
import { getAllQRCodes } from "../qrcode";
import { QRCode } from "../types/qrcode.types";

export const useQRCodes = () => {
  return useQuery<QRCode[]>({
    queryKey: ['qrcodes'],
    queryFn: getAllQRCodes,
  });
};

export default useQRCodes;
