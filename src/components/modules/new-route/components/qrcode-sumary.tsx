"use client";

import React from "react";
import { useQrContext } from "@/components/context/qr-context";
import useTiposBultos from "@/api/tipos-bulto/hooks/useTiposbulto";

const QRCodeSummary: React.FC = () => {
  const { qrCodes } = useQrContext();
  const { data: tiposBulto, isLoading, error } = useTiposBultos();

  // Agrupa y cuenta los QR según su propiedad "tipoBultoId"
  const counts = qrCodes.reduce((acc, code) => {
    const key = code.tipoBultoId;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mt-4">
      <p className="text-lg font-semibold">Recuento</p>
      {isLoading && <p>Cargando tipos...</p>}
      {error && <p>Error al cargar tipos de bulto</p>}
      {tiposBulto && (
        <ul className="mt-2 space-y-1">
          {Object.entries(counts).map(([tipoId, count]) => {
            const tipo = tiposBulto.find((t) => String(t.id) === String(tipoId));
            return (
              <li key={tipoId} className="text-sm">
                {tipo ? tipo.nombre : "Desconocido"}: {count}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default QRCodeSummary;
