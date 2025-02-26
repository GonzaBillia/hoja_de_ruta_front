// ControlarHojaRuta.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Tabladatas from "./ControlTable";
import { useState, useEffect } from "react";
import { Bulto } from "@/api/bulto/types/bulto.types";
import QrModalUpdate from "@/components/modules/qr-scanner/qr-modal-update";
import { useToast } from "@/hooks/use-toast";
import useUpdateBatchBulto from "@/api/bulto/hooks/useUpdateBatchBulto";
import useUpdateRouteSheetState from "@/api/route-sheets/hooks/useUpdateRouteSheetState";
import { useQrContext } from "@/components/context/qr-context";
import PDFDownloadModal from "./DownloadPDFModal";
import GeneratePDFRouteSheet from "./generateRouteSheetPDF";
import { formatDate } from "@/utils/formatDate";

interface ControlarHojaRutaProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Puedes tipar este objeto según tus modelos y el hook routeSheetDetails
}

export interface ExtendedBulto extends Bulto {
  // currentBultos contendrá el registro activo (o los activos) del historial
  currentBultos?: {
    actualRecibido: boolean;
    actualFechaRecibido: string;
    // Puedes agregar otros campos si lo requieres (por ejemplo, delivered_at, etc.)
  }[];
}

const ControlarHojaRuta: React.FC<ControlarHojaRutaProps> = ({ isOpen, onClose, data }) => {
  const { toast } = useToast();
  // Se espera que data.bultos ya tenga la propiedad currentBultos, gracias al hook routeSheetDetails.
  const [bultos, setBultos] = useState<ExtendedBulto[]>(data.bultos);
  const updateRouteSheetMutation = useUpdateRouteSheetState(data.codigo);
  const updateBatchBultoMutation = useUpdateBatchBulto();
  const { qrCodes, clearQrCodes } = useQrContext();

  const [showPDFModal, setShowPDFModal] = useState(false);
  const [triggerPDFDownload, setTriggerPDFDownload] = useState(false);

  // Procesa cada código QR escaneado
  useEffect(() => {
    if (qrCodes.length === 0) return;

    const scannedCode = qrCodes[0]?.codigo;
    if (!scannedCode) {
      clearQrCodes();
      return;
    }

    // Busca el bulto por código
    const index = bultos.findIndex((b) => b.codigo === scannedCode);
    if (index === -1) {
      toast({
        title: "Código no corresponde a ningún bulto de esta hoja de ruta",
        variant: "destructive",
      });
      clearQrCodes();
      return;
    }

    const bultoFound = bultos[index];
    // Se usa currentBultos para obtener el registro activo (se asume que es el primer elemento)
    const activeCurrent =
      bultoFound.currentBultos && bultoFound.currentBultos.length > 0
        ? bultoFound.currentBultos[0]
        : undefined;

    if (activeCurrent && activeCurrent.actualRecibido) {
      toast({
        title: "Este bulto ya ha sido escaneado",
        variant: "destructive",
      });
      clearQrCodes();
      return;
    }

    // Actualiza el registro activo: marca actualRecibido como true y actualFechaRecibido con el timestamp actual
    if (bultoFound.currentBultos) {
      const updatedCurrent = bultoFound.currentBultos.map((current, idx) =>
        idx === 0
          ? {
              ...current,
              actualRecibido: true,
              actualFechaRecibido: formatDate(new Date()),
            }
          : current
      );
      const updatedBultos = [...bultos];
      updatedBultos[index] = { ...bultoFound, currentBultos: updatedCurrent };
      setBultos(updatedBultos);
    }
    clearQrCodes();
  }, [qrCodes, bultos, clearQrCodes, toast]);

  // Handler del botón "Confirmar"
  const handleConfirm = () => {
    // Se verifica que en cada bulto el registro activo tenga actualRecibido verdadero
    const allScanned = bultos.every((b) => {
      const activeCurrent =
        b.currentBultos && b.currentBultos.length > 0 ? b.currentBultos[0] : undefined;
      return activeCurrent?.actualRecibido;
    });
    let newEstadoId = 4; // Estado por defecto: "recibido"

    if (!allScanned) {
      if (!window.confirm("No todos los bultos han sido escaneados. ¿Desea proceder de todas formas?")) {
        return;
      }
      newEstadoId = 5; // "recibido incompleto"
    }

    // Se arma el payload utilizando el código del bulto; el backend actualiza el registro activo basado en ello.
    const payload = bultos
      .filter((b) => b.currentBultos && b.currentBultos.length > 0)
      .map((b) => ({ codigo: b.codigo, recibido: true }));

    updateBatchBultoMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: "Bultos actualizados correctamente", variant: "success" });
        updateRouteSheetMutation.mutate(
          { estado_id: newEstadoId },
          {
            onSuccess: () => {
              toast({ title: "Hoja de ruta actualizada correctamente", variant: "success" });
              setShowPDFModal(true);
            },
            onError: () => {
              toast({ title: "Error al actualizar la hoja de ruta", variant: "destructive" });
            },
          }
        );
      },
      onError: () => {
        toast({ title: "Error al actualizar los bultos", variant: "destructive" });
      },
    });
  };

  const isProcessing = updateBatchBultoMutation.isPending || updateRouteSheetMutation.isPending;

  const handleDownloadComplete = () => {
    setTriggerPDFDownload(false);
    setShowPDFModal(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Controlar Hoja de Ruta: {data?.codigo}</DialogTitle>
          </DialogHeader>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Estado Actual:</strong> {data.estado || data.estado_id}
                </p>
                <p>
                  <strong>Depósito:</strong> {data.deposito || data.deposito_id}
                </p>
                <p>
                  <strong>Fecha de Creación:</strong> {data.createdAtFormatted || "-"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Repartidor a Cargo:</strong> {data.repartidor || data.repartidor_id}
                </p>
                <p>
                  <strong>Sucursal de Destino:</strong> {data.sucursal || data.sucursal_id}
                </p>
                <p>
                  <strong>Total de Bultos:</strong> {data.bultosCount ?? 0}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Fecha de Envío:</strong> {data.sentAtFormatted || "Pendiente"}
                </p>
                <p>
                  <strong>Fecha de Recepción:</strong> {data.receivedAtFormatted || "Pendiente"}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Remitos Asociados:</strong>
                </p>
                {data.remitos && data.remitos.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {data.remitos.map((remito: any) => (
                      <li key={remito.id}>{remito.external_id}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay remitos asignados.</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-1 mt-4">
            <QrModalUpdate bultos={bultos} setBultos={setBultos} />
            <Tabladatas data={bultos} />
          </div>
          <DialogFooter>
            <Button onClick={handleConfirm} disabled={isProcessing}>
              {isProcessing ? "Procesando..." : "Confirmar"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de descarga PDF */}
      <PDFDownloadModal
        isOpen={showPDFModal}
        onClose={() => { setShowPDFModal(false); onClose(); }}
        onDownload={() => setTriggerPDFDownload(true)}
      />

      {triggerPDFDownload && (
        <GeneratePDFRouteSheet codigo={data.codigo} onComplete={handleDownloadComplete} />
      )}
    </>
  );
};

export default ControlarHojaRuta;
