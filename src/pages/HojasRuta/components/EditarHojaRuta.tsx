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
import { useAuth } from "@/components/context/auth-context";

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
  const { isAuthorized } = useAuth()
  // Para la acción "modificar": usaremos QrData[] para manejar los remitos seleccionados.
  const [selectedRemitos, setSelectedRemitos] = useState<RemitoQuantio[]>([]);
  const [initialQRCodes, setInitialQRCodes] = useState<QrData[]>([])
  const [selectedRepartidor, setSelectedRepartidor] = useState<Repartidor | null>(null);
  const {qrCodes} = useQrContext()

  // Pre-poblar remitos si la hoja de ruta ya los tiene.
  useEffect(() => {
    if (transformedRouteSheet) {
      // Calcular los valores a establecer
      const newRemitos = transformedRouteSheet.remitos.map((r) => ({
        Numero: r.external_id, // o el campo que corresponda
        CliApeNom: transformedRouteSheet.sucursal,
      }));
  
      const newInitialQR = transformedRouteSheet.bultos.map((b: any) => ({
        codigo: b.codigo,
      }));
  
      // Actualizamos solo si los valores han cambiado
      // Puedes usar JSON.stringify para una comparación simple (si los datos no son muy grandes)
      if (JSON.stringify(newRemitos) !== JSON.stringify(selectedRemitos)) {
        setSelectedRemitos(newRemitos);
      }
      if (JSON.stringify(newInitialQR) !== JSON.stringify(initialQRCodes)) {
        setInitialQRCodes(newInitialQR);
      }
      if (transformedRouteSheet && estadoId === undefined) {
        setEstadoId(transformedRouteSheet.estado_id);
      }
    }
  }, [transformedRouteSheet, selectedRemitos, initialQRCodes, estadoId]);
  

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
          disabled={currentStateId === 4 || currentStateId === 5}
        >
          Cambiar Estado
        </Button>
        { isAuthorized(['superadmin', 'deposito']) && (
          <Button
          variant={action === "modificar" ? "default" : "outline"}
          onClick={() => setAction("modificar")}
          disabled={currentStateId !== 1}
        >
          Modificar Hoja
        </Button>
        )}
      </div>
      {action === "estado" ? (
        <EstadoEditor estadoId={currentStateId} onChange={setEstadoId} />
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
