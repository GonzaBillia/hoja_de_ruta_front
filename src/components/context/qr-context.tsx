"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { QrData } from "../common/qr-scanner/types/qr-scanner";

interface QrContextValue {
  qrCodes: QrData[];
  addQrCode: (code: QrData) => void;
  removeQrCode: (code: QrData) => void;
  clearQrCodes: () => void;
}

const QrContext = createContext<QrContextValue | undefined>(undefined);

export const QrProvider = ({ children }: { children: ReactNode }) => {
  const [qrCodes, setQrCodes] = useState<QrData[]>([]);

  const addQrCode = (code: QrData) => {
    setQrCodes((prev) => {
      if (!prev.includes(code)) {
        return [...prev, code];
      }
      return prev;
    });
  };

  const removeQrCode = (code: QrData) => {
    setQrCodes((prev) => prev.filter((c) => c !== code));
  };

  const clearQrCodes = () => {
    setQrCodes([]);
  };

  return (
    <QrContext.Provider value={{ qrCodes, addQrCode, removeQrCode, clearQrCodes }}>
      {children}
    </QrContext.Provider>
  );
};

export const useQrContext = () => {
  const context = useContext(QrContext);
  if (!context) {
    throw new Error("useQrContext must be used within a QrProvider");
  }
  return context;
};
