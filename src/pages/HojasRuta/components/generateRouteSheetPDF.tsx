// components/GeneratePDFRouteSheet.tsx
import React, { useEffect, useRef } from "react";
import { generateRouteSheetPDF } from "@/utils/routeSheetPDF";
import { generateRecepcionPDF } from "@/utils/recepcionPDF";
import useTransformedRouteSheet from "@/pages/DetallehojasRuta/hooks/useRouteSheetDetails";

interface GeneratePDFRouteSheetProps {
  codigo: string;
  onComplete?: () => void;
}

const GeneratePDFRouteSheet: React.FC<GeneratePDFRouteSheetProps> = ({ codigo, onComplete }) => {
  const { transformedRouteSheet, loading, error } = useTransformedRouteSheet(codigo);
  const didEffectRun = useRef(false);

  useEffect(() => {
    // Si ya se ejecutó el efecto, no hacemos nada.
    if (didEffectRun.current) return;
    
    if (!loading && !error && transformedRouteSheet) {
      if (
        transformedRouteSheet.estado_id === 4 ||
        transformedRouteSheet.estado_id === 5
      ) {
        generateRecepcionPDF(transformedRouteSheet);
      } else {
        generateRouteSheetPDF(transformedRouteSheet);
      }
      didEffectRun.current = true;
      if (onComplete) onComplete();
    }
  }, [loading, error, transformedRouteSheet, onComplete]);

  return null;
};

export default GeneratePDFRouteSheet;
