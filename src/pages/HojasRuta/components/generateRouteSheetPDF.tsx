// components/GeneratePDFRouteSheet.tsx
import React, { useEffect } from "react";
import { generateRouteSheetPDF } from "@/utils/routeSheetPDF";
import { generateRecepcionPDF } from "@/utils/recepcionPDF";
import useTransformedRouteSheet from "@/pages/DetallehojasRuta/hooks/useRouteSheetDetails";

interface GeneratePDFRouteSheetProps {
  codigo: string;
  onComplete?: () => void;
}

const GeneratePDFRouteSheet: React.FC<GeneratePDFRouteSheetProps> = ({ codigo, onComplete }) => {
  const { transformedRouteSheet, loading, error } = useTransformedRouteSheet(codigo);

  useEffect(() => {
    if (!loading && !error && transformedRouteSheet) {
      // Ejemplo de condición:
      // Si el estado (o estado_id) indica que la hoja fue recibida, generamos el comprobante de recepción.
      if (
        transformedRouteSheet.estado_id === 4 ||
        transformedRouteSheet.estado_id === 5
      ) {
        generateRecepcionPDF(transformedRouteSheet);
      } else {
        generateRouteSheetPDF(transformedRouteSheet);
      }
      if (onComplete) onComplete();
    }
  }, [loading, error, transformedRouteSheet, onComplete]);

  return null;
};

export default GeneratePDFRouteSheet;
