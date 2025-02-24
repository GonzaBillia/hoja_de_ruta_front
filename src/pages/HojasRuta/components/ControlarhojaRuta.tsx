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

interface ControlarHojaRutaProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Puedes tipar este objeto según tus modelos
}

const ControlarHojaRuta: React.FC<ControlarHojaRutaProps> = ({ isOpen, onClose, data }) => {
  const { toast } = useToast();
  // Estado local: lista de bultos inicializada desde data
  const [bultos, setBultos] = useState<Bulto[]>(data.bultos);
  // Hook para actualizar el estado de la hoja de ruta
  const updateRouteSheetMutation = useUpdateRouteSheetState(data.codigo);
  // Hook para actualizar en lote los bultos
  const updateBatchBultoMutation = useUpdateBatchBulto();
  const { qrCodes, clearQrCodes } = useQrContext();

  // Estado para mostrar el modal de descarga PDF
  const [showPDFModal, setShowPDFModal] = useState(false);
  // Estado para controlar la generación del PDF mediante el componente GeneratePDFRouteSheet
  const [triggerPDFDownload, setTriggerPDFDownload] = useState(false);

  // Efecto para procesar cada nuevo código escaneado
  useEffect(() => {
    if (qrCodes.length === 0) return;
    
    const scannedCode = qrCodes[0]?.codigo;
    if (!scannedCode) {
      clearQrCodes();
      return;
    }
    
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
    if (bultoFound.recibido) {
      toast({
        title: "Este bulto ya ha sido escaneado",
        variant: "destructive",
      });
      clearQrCodes();
      return;
    }
    
    const updatedBultos = [...bultos];
    updatedBultos[index] = { ...bultoFound, recibido: true };
    setBultos(updatedBultos);
    clearQrCodes();
  }, [qrCodes, bultos, clearQrCodes, toast]);

  // Handler del botón Confirmar
  const handleConfirm = () => {
    const allScanned = bultos.every((b) => b.recibido);
    let newEstadoId = 4; // Por defecto, "recibido"
    
    if (!allScanned) {
      if (
        !window.confirm(
          "No todos los bultos han sido escaneados. ¿Desea proceder de todas formas?"
        )
      ) {
        return;
      }
      newEstadoId = 5; // "recibido incompleto"
    }
    
    // Arma el payload para actualizar los bultos escaneados
    const payload = bultos
      .filter((b) => b.recibido)
      .map((b) => ({ codigo: b.codigo, recibido: true }));
    
    // Actualiza en lote los bultos
    updateBatchBultoMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: "Bultos actualizados correctamente", variant: "success" });
        // Actualiza el estado de la hoja de ruta
        updateRouteSheetMutation.mutate(
          { estado_id: newEstadoId },
          {
            onSuccess: () => {
              toast({ title: "Hoja de ruta actualizada correctamente", variant: "success" });
              // Muestra el modal para descargar el PDF
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

  // Deshabilitamos el botón confirmar mientras se procesa alguna mutación
  const isProcessing = updateBatchBultoMutation.isPending || updateRouteSheetMutation.isPending;

  // Cuando se pulse "Descargar" en el modal, activamos la generación del PDF usando el componente GeneratePDFRouteSheet
  const handleDownloadComplete = () => {
    // Esta función se ejecuta una vez que GeneratePDFRouteSheet finaliza la descarga
    // Se cierra el modal y se finaliza el proceso de control
    setTriggerPDFDownload(false);
    setShowPDFModal(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent>
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
            <QrModalUpdate />
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
        onClose={() => setShowPDFModal(false)}
        // Al pulsar "Descargar" en el modal, activamos la generación del PDF
        onDownload={() => setTriggerPDFDownload(true)}
      />

      {/* Componente que genera el PDF. Se renderiza solo cuando se activa triggerPDFDownload */}
      {triggerPDFDownload && (
        <GeneratePDFRouteSheet codigo={data.codigo} onComplete={handleDownloadComplete} />
      )}
    </>
  );
};

export default ControlarHojaRuta;
