import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateRouteSheetPDF = (routeSheet: any) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const marginLeft = 14;
  const marginRight = doc.internal.pageSize.getWidth() - 14;
  let yPos = 20;

  // Encabezado principal
  doc.setFontSize(22);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text(`Remito - Hoja de Ruta: ${routeSheet.codigo}`, marginLeft, yPos);

  // Línea divisoria
  yPos += 4;
  doc.setLineWidth(0.5);
  doc.line(marginLeft, yPos, marginRight, yPos);

  // Datos Generales
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Datos Generales", marginLeft, yPos);

  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Depósito: ${routeSheet.deposito || routeSheet.deposito_id}`, marginLeft, yPos);
  yPos += 6;
  doc.text(`Fecha de Creación: ${routeSheet.createdAtFormatted || "-"}`, marginLeft, yPos);
  yPos += 6;
  doc.text(`Fecha de Envío: ${routeSheet.sentAtFormatted || "-"}`, marginLeft, yPos);
  yPos += 6;
  doc.text(`Repartidor: ${routeSheet.repartidor || routeSheet.repartidor_id}`, marginLeft, yPos);
  yPos += 6;
  doc.text(`Sucursal: ${routeSheet.sucursal || routeSheet.sucursal_id}`, marginLeft, yPos);
  yPos += 6;
  doc.text(`Total de Bultos: ${routeSheet.bultosCount ?? 0}`, marginLeft, yPos);

  // Remitos Asociados
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Remitos Asociados:", marginLeft, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  if (routeSheet.remitos && routeSheet.remitos.length > 0) {
    routeSheet.remitos.forEach((remito: any) => {
      doc.text(`- ${remito.external_id}`, marginLeft + 4, yPos);
      yPos += 6;
    });
  } else {
    doc.text("No hay remitos asignados.", marginLeft + 4, yPos);
    yPos += 6;
  }

    // Línea divisoria
    yPos += 2;
    doc.setLineWidth(0.3);
    doc.line(marginLeft, yPos, marginRight, yPos);

  // Sección: Recuento de Bultos
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Recuento de Bultos:", marginLeft, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  // Se asume que routeSheet.bultosCountByTipo es un objeto del tipo { [tipo: string]: number }
  if (routeSheet.bultosCountByTipo) {
    Object.entries(routeSheet.bultosCountByTipo).forEach(([tipo, count]) => {
      doc.text(`${tipo}: ${count}`, marginLeft + 4, yPos);
      yPos += 6;
    });
  } else {
    doc.text("Sin información de recuento.", marginLeft + 4, yPos);
    yPos += 6;
  }

  // Detalle de Bultos
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Detalle de Bultos", marginLeft, yPos);
  yPos += 4;

  // Tabla de Bultos usando jspdf-autotable (mostrando el código QR de cada bulto)
  (doc as any).autoTable({
    startY: yPos,
    head: [["Código QR"]],
    body: routeSheet.bultos.map((bulto: any) => [bulto.codigo]),
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: 50,
      halign: "center",
    },
    theme: "grid",
  });

  // Guarda el PDF usando el id de la hoja de ruta
  doc.save(`hoja_de_ruta_${routeSheet.codigo}.pdf`);
};
