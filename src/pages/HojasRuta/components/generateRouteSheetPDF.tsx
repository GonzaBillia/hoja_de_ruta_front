// components/GeneratePDFRouteSheet.tsx
import React, { useEffect } from "react";
import { generateRouteSheetPDF } from "@/utils/routeSheetPDF";
import useTransformedRouteSheet from "@/pages/DetallehojasRuta/hooks/useRouteSheetDetails";

interface GeneratePDFRouteSheetProps {
  codigo: string;
  onComplete?: () => void;
}

const GeneratePDFRouteSheet: React.FC<GeneratePDFRouteSheetProps> = ({ codigo, onComplete }) => {
  const { transformedRouteSheet, loading, error } = useTransformedRouteSheet(codigo);

  useEffect(() => {
    if (!loading && !error && transformedRouteSheet) {
      generateRouteSheetPDF(transformedRouteSheet);
      if (onComplete) onComplete();
    }
  }, [loading, error, transformedRouteSheet, onComplete]);

  return null; // Este componente no necesita renderizar nada.
};

export default GeneratePDFRouteSheet;
