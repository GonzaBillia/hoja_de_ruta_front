import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateRecepcionPDF = (routeSheet: any) => {
    // Creamos el documento en formato A4
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const marginLeft = 14;
    const marginRight = doc.internal.pageSize.getWidth() - 14;
    let yPos = 20;

    // Título principal
    doc.setFontSize(24);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("Comprobante de Recepción", marginLeft, yPos);

    // Subtítulo
    yPos += 10;
    doc.setFontSize(18);
    doc.text(`Hoja de Ruta: ${routeSheet.codigo}`, marginLeft, yPos);


    // Mostrar el estado actual en negrita justo debajo
    yPos += 10;
    doc.setFontSize(16);
    const estado = routeSheet.estado || routeSheet.estado_id;
    const estadoStr = estado.toString();
    const capitalizedEstado = estadoStr.charAt(0).toUpperCase() + estadoStr.slice(1);
    doc.text(`Estado Actual: ${capitalizedEstado}`, marginLeft, yPos);


    // Línea divisoria para separar encabezado
    yPos += 6;
    doc.setLineWidth(0.5);
    doc.line(marginLeft, yPos, marginRight, yPos);

    // Datos Generales
    yPos += 10;
    doc.setFontSize(18);
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

    // Línea divisoria extra
    yPos += 2;
    doc.setLineWidth(0.3);
    doc.line(marginLeft, yPos, marginRight, yPos);

    // Sección: Recuento de Bultos (igual que en el otro PDF)
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Recuento de Bultos:", marginLeft, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    if (routeSheet.bultosCountByTipo) {
        Object.entries(routeSheet.bultosCountByTipo).forEach(([tipo, count]) => {
            doc.text(`${tipo}: ${count}`, marginLeft + 4, yPos);
            yPos += 6;
        });
    } else {
        doc.text("Sin información de recuento.", marginLeft + 4, yPos);
        yPos += 6;
    }

    // Detalle de Bultos: se muestra una tabla con dos columnas ("Código QR" y "Recibido")
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Detalle de Bultos", marginLeft, yPos);
    yPos += 4;

    // Preparamos la data para la tabla: cada fila es [Código QR, Recibido]
    const tableBody = routeSheet.bultos.map((bulto: any) => [
        bulto.codigo,
        bulto.actualRecibido ? "SI" : "NO",
    ]);

    // Usamos jspdf-autotable para generar la tabla
    (doc as any).autoTable({
        startY: yPos,
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

    // Obtener el alto y ancho de la página
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Definir la posición vertical para las firmas (por ejemplo, 30mm desde el final)
    const signatureY = pageHeight - 30;

    // Definimos el ancho disponible para el texto de firma (por ejemplo, 60mm)
    const signatureWidth = 50;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Para el lado izquierdo (Firma del Repartidor)
    doc.line(marginLeft, signatureY, marginLeft + signatureWidth, signatureY);
    const repartidorText = `Firma del Repartidor: ${routeSheet.repartidor || routeSheet.repartidor_id}`;
    const repartidorLines = doc.splitTextToSize(repartidorText, signatureWidth);
    doc.text(repartidorLines, marginLeft, signatureY + 6);

    // Para el lado derecho (Firma de Responsable en sucursal)
    const rightX = pageWidth - marginLeft - signatureWidth;
    doc.line(rightX, signatureY, rightX + signatureWidth, signatureY);
    const sucursalText = `Firma de Responsable de la sucursal: ${routeSheet.sucursal || routeSheet.sucursal_id}`;
    const sucursalLines = doc.splitTextToSize(sucursalText, signatureWidth);
    doc.text(sucursalLines, rightX, signatureY + 6);

    // Guarda el PDF usando el id de la hoja de ruta
    doc.save(`comprobante_recepcion_${routeSheet.codigo}.pdf`);
};
