import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateRecepcionPDF = (routeSheet: any): void => {
    // Configuración base del documento
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 14;
    const marginRight = pageWidth - 14;
    // Definir paddings
    const contentPaddingTop = 2;  // espacio interno superior de cada sección
    const contentPaddingBottom = 1; // espacio interno inferior (reducido)
    const titlePadding = 4;       // separación extra para los títulos respecto del borde
    let yPos = 20;

    // Establecemos grosor de borde reducido para los recuadros
    doc.setLineWidth(0.2);

    // ---------------------------------
    // Encabezado principal
    // ---------------------------------
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text(`Comprobante de Recepción: ${routeSheet.codigo}`, marginLeft, yPos);

    // Estado Actual en negrita
    yPos += 10;
    doc.setFontSize(16);
    const estado = routeSheet.estado || routeSheet.estado_id;
    const estadoStr = estado.toString();
    const capitalizedEstado = estadoStr.charAt(0).toUpperCase() + estadoStr.slice(1);
    doc.text(`Estado Actual: ${capitalizedEstado}`, marginLeft, yPos);

    // Línea divisoria del encabezado
    yPos += 6;
    doc.setLineWidth(0.5);
    doc.line(marginLeft, yPos, marginRight, yPos);
    doc.setLineWidth(0.2);

    // ---------------------------------
    // Sección: Datos Generales
    // ---------------------------------
    yPos += 8;
    const datosSectionStart = yPos;
    yPos += contentPaddingTop; // Padding superior

    // Título con línea divisoria
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Datos Generales", marginLeft + titlePadding, yPos + titlePadding);
    const datosTitleDividerY = yPos + titlePadding + 2;
    doc.line(marginLeft + titlePadding, datosTitleDividerY, marginRight - titlePadding, datosTitleDividerY);
    // Desplazamos el contenido 6 mm debajo de la línea divisoria
    yPos = datosTitleDividerY + 6;

    // Dividir en dos columnas
    const columnWidth = (pageWidth - 2 * marginLeft - 2 * contentPaddingTop) / 2;
    const leftX = marginLeft + contentPaddingTop;
    const rightX = leftX + columnWidth;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    // Campos para la columna izquierda
    const fechaRecepcion = routeSheet.receivedAtFormatted
        ? routeSheet.receivedAtFormatted
        : (routeSheet.receivedIncompleteFormatted ? routeSheet.receivedIncompleteFormatted : "-");

    const leftFields = [
        `Depósito: ${routeSheet.deposito || routeSheet.deposito_id}`,
        `Fecha de Recepción: ${fechaRecepcion}`,
    ];

    // Campos para la columna derecha
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
    const datosSectionEnd = yPos + contentPaddingBottom;
    // Dibujar el borde de Datos Generales
    doc.rect(marginLeft, datosSectionStart, pageWidth - 2 * marginLeft, datosSectionEnd - datosSectionStart, "S");
    yPos = datosSectionEnd + 6;

    // ---------------------------------
    // Sección: Recuento (Remitos y Bultos)
    // ---------------------------------
    const recuentoSectionStart = yPos;
    yPos += contentPaddingTop;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    // Título de la sección con línea divisoria
    doc.text("Recuento", marginLeft + titlePadding, yPos + titlePadding);
    const recuentoTitleDividerY = yPos + titlePadding + 2;
    doc.line(marginLeft + titlePadding, recuentoTitleDividerY, marginRight - titlePadding, recuentoTitleDividerY);
    yPos = recuentoTitleDividerY + 6;

    // Dividir la sección en dos columnas
    const recuentoColumnWidth = (pageWidth - 2 * marginLeft - 2 * contentPaddingTop) / 2;
    const recLeftX = marginLeft + contentPaddingTop;
    const recRightX = recLeftX + recuentoColumnWidth;

    // Calcular totales
    const remitosCount = routeSheet.remitos ? routeSheet.remitos.length : 0;
    const totalBultos = routeSheet.bultosCount ?? 0;
    // Encabezados con totales
    const remitosHeader = `Remitos: [total: ${remitosCount}]`;
    const bultosHeader = `Bultos: [total: ${totalBultos}]`;
    doc.setFontSize(14);
    doc.text(remitosHeader, recLeftX, yPos);
    doc.text(bultosHeader, recRightX, yPos);
    yPos += 6;

    // Columna izquierda: Lista de remitos
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
    // Columna derecha: Recuento de bultos por tipo
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
    const recuentoSectionEnd = recuentoContentEnd + contentPaddingBottom;
    doc.rect(marginLeft, recuentoSectionStart, pageWidth - 2 * marginLeft, recuentoSectionEnd - recuentoSectionStart, "S");
    yPos = recuentoSectionEnd + 6;

    // ---------------------------------
    // Sección: Detalle de Bultos (Tabla)
    // ---------------------------------
    const detalleSectionStart = yPos;
    yPos += contentPaddingTop;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Detalle de Bultos", marginLeft + titlePadding, yPos + titlePadding);
    const detalleTitleDividerY = yPos + titlePadding + 2;
    doc.line(marginLeft + titlePadding, detalleTitleDividerY, marginRight - titlePadding, detalleTitleDividerY);
    yPos = detalleTitleDividerY + 6;

    // Preparar la data para la tabla: [Código QR, Recibido]
    const tableBody = routeSheet.bultos.map((bulto: any) => [
        bulto.codigo,
        bulto.actualRecibido ? "SI" : "NO",
    ]);

    const tableStartY = yPos;
    (doc as any).autoTable({
        startY: tableStartY,
        head: [["Código QR", "Recibido"]],
        body: tableBody,
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
    doc.rect(marginLeft, detalleSectionStart, pageWidth - 2 * marginLeft, detalleSectionEnd - detalleSectionStart, "S");
    yPos = detalleSectionEnd;

    // ---------------------------------
    // Sección: Firmas
    // ---------------------------------
    // Posición para las firmas (por ejemplo, 30 mm desde el final)
    const signatureY = pageHeight - 30;
    const signatureWidth = 50;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    // Firma del Repartidor (lado izquierdo)
    doc.line(marginLeft, signatureY, marginLeft + signatureWidth, signatureY);
    const repartidorText = `Firma del Repartidor: ${routeSheet.repartidor || routeSheet.repartidor_id}`;
    const repartidorLines = doc.splitTextToSize(repartidorText, signatureWidth);
    doc.text(repartidorLines, marginLeft, signatureY + 6);
    // Firma de Responsable de Sucursal (lado derecho)
    const rightSignatureX = pageWidth - marginLeft - signatureWidth;
    doc.line(rightSignatureX, signatureY, rightSignatureX + signatureWidth, signatureY);
    const sucursalText = `Firma de Responsable de la sucursal: ${routeSheet.sucursal || routeSheet.sucursal_id}`;
    const sucursalLines = doc.splitTextToSize(sucursalText, signatureWidth);
    doc.text(sucursalLines, rightSignatureX, signatureY + 6);

    // Guardar el PDF
    doc.save(`comprobante_recepcion_${routeSheet.codigo}.pdf`);
};
