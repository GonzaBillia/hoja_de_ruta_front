import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateRouteSheetPDF = (routeSheet: any): void => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  // Definir paddings: superior e inferior para el contenido
  const contentPaddingTop = 2;
  const contentPaddingBottom = 1;
  const titlePadding = 4;   // Padding extra para separar los títulos del borde
  let yPos = 20;

  // Reducir grosor de borde para todos los rectángulos
  doc.setLineWidth(0.2);

  // -------------------------------
  // Encabezado principal
  // -------------------------------
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text(`Hoja de Ruta: ${routeSheet.codigo}`, margin, yPos);

  // Línea divisoria debajo del encabezado
  yPos += 4;
  doc.setLineWidth(0.5); // Línea divisoria más marcada
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  doc.setLineWidth(0.2); // Volver al grosor reducido

  // -------------------------------
  // Sección: Datos Generales (sin Total de Bultos)
  // -------------------------------
  yPos += 8;
  const datosSectionStart = yPos; // Inicio del borde de la sección
  yPos += contentPaddingTop; // Padding superior

  // Título con padding extra y línea divisoria debajo
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Datos Generales", margin + titlePadding, yPos + titlePadding);
  const datosTitleDividerY = yPos + titlePadding + 2;
  doc.line(margin + titlePadding, datosTitleDividerY, pageWidth - margin - titlePadding, datosTitleDividerY);
  // Separar el contenido de la línea divisoria (ahora 6 mm de separación)
  yPos = datosTitleDividerY + 6;

  // Dividir en dos columnas
  const columnWidth = (pageWidth - 2 * margin - 2 * contentPaddingTop) / 2;
  const leftX = margin + contentPaddingTop;
  const rightX = leftX + columnWidth;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Campos para cada columna (sin "Total de Bultos")
  const leftFields = [
    `Depósito: ${routeSheet.deposito || routeSheet.deposito_id}`,
    `Fecha de Envío: ${routeSheet.sentAtFormatted || "-"}`,
  ];
  const rightFields = [
    `Repartidor: ${routeSheet.repartidor || routeSheet.repartidor_id}`,
    `Sucursal: ${routeSheet.sucursal || routeSheet.sucursal_id}`,
  ];

  let leftY = yPos;
  leftFields.forEach((line) => {
    doc.text(line, leftX, leftY);
    leftY += 6;
  });

  let rightY = yPos;
  rightFields.forEach((line) => {
    doc.text(line, rightX, rightY);
    rightY += 6;
  });

  const contentEndY = Math.max(leftY, rightY);
  yPos = contentEndY;
  const datosSectionEnd = yPos + contentPaddingBottom; // Padding inferior reducido

  // Dibujar borde de la sección de Datos Generales
  doc.rect(margin, datosSectionStart, pageWidth - 2 * margin, datosSectionEnd - datosSectionStart, "S");
  yPos = datosSectionEnd + 6;

  // -------------------------------------------------------
  // Sección: Recuento (Remitos y Bultos en dos columnas)
  // -------------------------------------------------------
  const recuentoSectionStart = yPos;
  yPos += contentPaddingTop; // Padding superior

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  // Título de la sección con padding extra y línea divisoria debajo
  doc.text("Recuento", margin + titlePadding, yPos + titlePadding);
  const recuentoTitleDividerY = yPos + titlePadding + 2;
  doc.line(margin + titlePadding, recuentoTitleDividerY, pageWidth - margin - titlePadding, recuentoTitleDividerY);
  yPos = recuentoTitleDividerY + 6; // Separación aumentada a 6 mm

  // Definir columnas para la sección de recuento
  const recuentoColumnWidth = (pageWidth - 2 * margin - 2 * contentPaddingTop) / 2;
  const recLeftX = margin + contentPaddingTop;
  const recRightX = recLeftX + recuentoColumnWidth;

  // Calcular totales
  const remitosCount = routeSheet.remitos ? routeSheet.remitos.length : 0;
  const totalBultos = routeSheet.bultosCount ?? 0;

  // Encabezados para cada columna con totales
  const remitosHeader = `Remitos: [total: ${remitosCount}]`;
  const bultosHeader = `Bultos: [total: ${totalBultos}]`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(remitosHeader, recLeftX, yPos);
  doc.text(bultosHeader, recRightX, yPos);
  yPos += 6;

  // Contenido de la columna de Remitos
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let remitosY = yPos;
  if (routeSheet.remitos && routeSheet.remitos.length > 0) {
    routeSheet.remitos.forEach((remito: any) => {
      doc.text(`- ${remito.external_id}`, recLeftX, remitosY);
      remitosY += 5;
    });
  } else {
    doc.text("Sin remitos", recLeftX, remitosY);
    remitosY += 5;
  }

  // Contenido de la columna de Bultos (por tipo)
  let bultosY = yPos;
  if (routeSheet.bultosCountByTipo && Object.keys(routeSheet.bultosCountByTipo).length > 0) {
    const entries = Object.entries(routeSheet.bultosCountByTipo);
    console.log('Entries:', entries);
    for (const [tipo, count] of entries) {
      doc.text(`${tipo}: ${count}`, recRightX, bultosY);
      bultosY += 5;
    }
  } else {
    doc.text("Sin datos", recRightX, bultosY);
    bultosY += 5;
  }
  
  
  const recuentoContentEnd = Math.max(remitosY, bultosY);
  const recuentoSectionEnd = recuentoContentEnd + contentPaddingBottom; // Padding inferior reducido
  doc.rect(margin, recuentoSectionStart, pageWidth - 2 * margin, recuentoSectionEnd - recuentoSectionStart, "S");
  yPos = recuentoSectionEnd + 6;

  // -------------------------------------------------
  // Sección: Detalle de Bultos (Tabla con paddings)
  // -------------------------------------------------
  const detalleSectionStart = yPos;
  yPos += contentPaddingTop;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Detalle de Bultos", margin + titlePadding, yPos + titlePadding);
  const detalleTitleDividerY = yPos + titlePadding + 2;
  doc.line(margin + titlePadding, detalleTitleDividerY, pageWidth - margin - titlePadding, detalleTitleDividerY);
  yPos = detalleTitleDividerY + 6;
  
  const tableStartY = yPos;
  (doc as any).autoTable({
    startY: tableStartY,
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
  const tableEndY = (doc as any).lastAutoTable.finalY;
  const detalleSectionEnd = tableEndY + contentPaddingBottom;
  doc.rect(margin, detalleSectionStart, pageWidth - 2 * margin, detalleSectionEnd - detalleSectionStart, "S");
  yPos = detalleSectionEnd;

  // Guardar el PDF
  doc.save(`hoja_de_ruta_${routeSheet.codigo}.pdf`);
};
