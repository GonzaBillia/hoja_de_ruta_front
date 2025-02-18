"use client";
import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useUpdateRouteSheet from "@/api/route-sheets/hooks/useUpdateRouteSheet";
import useUpdateRouteSheetState from "@/api/route-sheets/hooks/useUpdateRouteSheetState";
import useTransformedRouteSheet from "@/pages/DetallehojasRuta/hooks/useRouteSheetDetails";
import EstadoEditor from "./EstadoEditor";
import ModificarEditor from "./ModificarEditor";
import { Repartidor } from "@/api/repartidor/types/repartidor.types";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";
import { RemitoQuantio } from "@/api/remito/types/remito.types";
import { useQrContext } from "@/components/context/qr-context";

type EditAction = "estado" | "modificar";

interface EditarHojaRutaProps {
  codigo: string;
  onUpdated?: () => void;
  setEditModalOpen: (open: boolean) => void;
  currentStateId: number;
}

const EditarHojaRuta: React.FC<EditarHojaRutaProps> = ({
  codigo,
  onUpdated,
  setEditModalOpen,
  currentStateId,
}) => {
  // Obtenemos la hoja de ruta transformada mediante el hook.
  const {
    transformedRouteSheet,
    loading: transformedLoading,
    error: transformedError,
  } = useTransformedRouteSheet(codigo);

  const [action, setAction] = useState<EditAction>("estado");
  // Para la acción "estado"
  const [estadoId, setEstadoId] = useState<number | undefined>(undefined);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Para la acción "modificar": usaremos QrData[] para manejar los remitos seleccionados.
  const [selectedRemitos, setSelectedRemitos] = useState<RemitoQuantio[]>([]);
  const [initialQRCodes, setInitialQRCodes] = useState<QrData[]>([])
  const [selectedRepartidor, setSelectedRepartidor] = useState<Repartidor | null>(null);
  const {qrCodes} = useQrContext()

  // Pre-poblar remitos si la hoja de ruta ya los tiene.
  useEffect(() => {
    if (transformedRouteSheet && transformedRouteSheet.remitos) {
      // Transformamos cada remito (que se asume tiene la propiedad external_id) a QrData.
      // Se asignan los campos obligatorios según el interface QrData.
      const initialRemitos: RemitoQuantio[] = transformedRouteSheet.remitos.map((r) => ({
        Numero: r.external_id, // Usamos el external_id para identificar el QR.
        CliApeNom: transformedRouteSheet.sucursal, // Para filtrar por sucursal.
      }));
      const initialQR: QrData[] = transformedRouteSheet.bultos.map((b: any) => ({
        codigo: b.codigo
      }));
      setSelectedRemitos(initialRemitos);
      setInitialQRCodes(initialQR);
      (transformedRouteSheet)
    }
  }, [transformedRouteSheet]);

  // Hooks para actualizar la hoja de ruta.
  const stateMutation = useUpdateRouteSheetState(codigo);
  const modifyMutation = useUpdateRouteSheet(codigo);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (action === "estado") {
        if (!estadoId) {
          toast({
            title: "Error",
            description: "Debe seleccionar un estado",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        await stateMutation.mutateAsync({ estado_id: estadoId });
        toast({
          title: "Actualizado",
          description: "El estado se ha actualizado correctamente",
          variant: "default",
        });
      } else if (action === "modificar") {
        if (!selectedRepartidor || selectedRemitos.length === 0 || qrCodes.length === 0) {
          toast({
            title: "Error",
            description: "Debe seleccionar repartidor, al menos 1 remito y un QR valido",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        // Convertimos el array de QrData a Remito[] para el payload.
        const payloadRemitos = selectedRemitos.map((q, i) => ({
          id: i, // Id generado temporalmente.
          external_id: q.Numero,
        }));
        const payload = {
          repartidor_id: selectedRepartidor.id,
          sucursal_id: transformedRouteSheet?.sucursal_id,
          // Se envía solo el external_id de cada remito.
          remitos: payloadRemitos.map((r) => r.external_id),
          scannedQRCodes: qrCodes
        };
        console.log(payload)
        await modifyMutation.mutateAsync(payload);
        toast({
          title: "Actualizado",
          description: "La hoja de ruta se ha modificado correctamente",
          variant: "default",
        });
      }
      setEditModalOpen(false);
      if (onUpdated) onUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la hoja de ruta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (transformedLoading) return <p>Cargando hoja de ruta...</p>;
  if (transformedError || !transformedRouteSheet)
    return <p>Error al cargar la hoja de ruta</p>;

  return (
    <DialogContent className="max-h-[calc(100vh-50px)] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar Hoja de Ruta</DialogTitle>
        <DialogDescription>
          Seleccione la acción que desea realizar:
        </DialogDescription>
      </DialogHeader>
      <div className="mb-4 flex items-center space-x-4">
        <Button
          variant={action === "estado" ? "default" : "outline"}
          onClick={() => setAction("estado")}
        >
          Cambiar Estado
        </Button>
        <Button
          variant={action === "modificar" ? "default" : "outline"}
          onClick={() => setAction("modificar")}
          disabled={currentStateId !== 1}
        >
          Modificar Hoja
        </Button>
      </div>
      {action === "estado" ? (
        <EstadoEditor estadoId={estadoId} onChange={setEstadoId} />
      ) : (
        <ModificarEditor
          selectedRepartidor={selectedRepartidor}
          onSelectRepartidor={setSelectedRepartidor}
          selectedRemitos={selectedRemitos}
          onChangeRemitos={setSelectedRemitos}
          initialQrCodes={initialQRCodes}
          sucursalNombre={transformedRouteSheet.sucursal}
          sucursalId={transformedRouteSheet.sucursal_id}
          repartidorId={transformedRouteSheet.repartidor_id}
          fechaCreacion={transformedRouteSheet.created_at}
        />
      )}
      <DialogFooter>
        <Button variant="outline" onClick={() => setEditModalOpen(false)} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditarHojaRuta;
