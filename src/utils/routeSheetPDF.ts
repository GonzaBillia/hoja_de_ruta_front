import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateRouteSheetPDF = (routeSheet: any) => {
  const doc = new jsPDF();

  // Título principal
  doc.setFontSize(18);
  doc.text(`Detalle de la Hoja de Ruta: ${routeSheet.codigo}`, 14, 20);

  // Sección: Datos Generales (similares a la Card de detalles)
  doc.setFontSize(12);
  let yPos = 30;

  doc.text("Detalles Generales:", 16, yPos);
  yPos += 8;
  doc.text(`Depósito: ${routeSheet.deposito || routeSheet.deposito_id}`, 14, yPos);
  yPos += 8;
  doc.text(`Fecha de Creación: ${routeSheet.createdAtFormatted || "-"}`, 14, yPos);
  yPos += 8;
  doc.text(`Repartidor a Cargo: ${routeSheet.repartidor || routeSheet.repartidor_id}`, 14, yPos);
  yPos += 8;
  doc.text(`Sucursal de Destino: ${routeSheet.sucursal || routeSheet.sucursal_id}`, 14, yPos);
  yPos += 8;
  doc.text(`Total de Bultos: ${routeSheet.bultosCount ?? 0}`, 14, yPos);
  yPos += 8;

  // Sección: Remitos Asociados
  doc.text("Remitos Asociados:", 14, yPos);
  yPos += 8;
  if (routeSheet.remitos && routeSheet.remitos.length > 0) {
    routeSheet.remitos.forEach((remito: any) => {
      doc.text(`- ${remito.external_id}`, 18, yPos);
      yPos += 8;
    });
  } else {
    doc.text("No hay remitos asignados.", 18, yPos);
    yPos += 8;
  }

  // Espacio antes de la tabla de bultos
  yPos += 10;
  doc.text("Detalle de Bultos", 14, yPos);
  yPos += 8;

  // Sección: Tabla de Bultos
  // Usamos jspdf-autotable para generar la tabla. Aquí solo mostramos la columna "Código QR"
  const tableColumn = ["Código QR"];
  const tableRows = routeSheet.bultos.map((bulto: any) => [bulto.codigo]);

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: yPos,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [230, 230, 230] },
  });

  // Guarda el PDF usando el id de la hoja de ruta para el nombre del archivo
  doc.save(`hoja_de_ruta_${routeSheet.id}.pdf`);
};
