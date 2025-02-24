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
  
  interface ControlarHojaRutaProps {
    isOpen: boolean;
    onClose: () => void;
    data: any; // Puedes tipar este objeto según tus modelos
  }
  
  const ControlarHojaRuta = ({ isOpen, onClose, data }: ControlarHojaRutaProps) => {
    const { toast } = useToast();
    // Estado local: lista de bultos inicializada desde data
    const [bultos, setBultos] = useState<Bulto[]>(data.bultos);
    // Hook para actualizar el estado de la hoja de ruta
    const updateRouteSheetMutation = useUpdateRouteSheetState(data.codigo);
    // Hook para actualizar en lote los bultos
    const updateBatchBultoMutation = useUpdateBatchBulto();
  
    // Accedemos al contexto QR
    const { qrCodes, clearQrCodes } = useQrContext();
  
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
        // Si el usuario decide proceder a pesar de no haber escaneado todos, se asigna "recibido incompleto"
        newEstadoId = 5;
      }
      
      // Arma el payload para actualizar los bultos escaneados
      const payload = bultos
        .filter((b) => b.recibido)
        .map((b) => ({ codigo: b.codigo, recibido: true }));
      
      // Actualiza en lote los bultos usando el hook useUpdateBatchBulto
      updateBatchBultoMutation.mutate(payload, {
        onSuccess: () => {
          toast({ title: "Bultos actualizados correctamente", variant: "success" });
          // Actualiza el estado de la hoja de ruta según la condición
          updateRouteSheetMutation.mutate(
            { estado_id: newEstadoId },
            {
              onSuccess: () => {
                toast({ title: "Hoja de ruta actualizada correctamente", variant: "success" });
                onClose();
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
  
    // Deshabilitamos el botón confirmar mientras se procesa alguna de las mutaciones
    const isProcessing = updateBatchBultoMutation.isPending || updateRouteSheetMutation.isPending;
  
    return (
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
            {/* Componente que activa el escáner QR y actualiza el contexto */}
            <QrModalUpdate />
            {/* Tabla que muestra los bultos con sus códigos y estado (escaneado o no) */}
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
    );
  };
  
  export default ControlarHojaRuta;
  