"use client";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTransformedRouteSheet from "./hooks/useRouteSheetDetails";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit, X } from "lucide-react";
import TablaGenerica from "@/components/common/table/table";
import { ColumnName } from "@/components/common/table/types/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/context/auth-context";
import useObservationsByRouteSheet from "@/api/observation/hooks/useObservationsByRouteSheet";
import useCreateObservation from "@/api/observation/hooks/useCreateObservation";
import useUpdateObservation from "@/api/observation/hooks/useUpdateObservation";
import useDeleteObservation from "@/api/observation/hooks/useDeleteObservation";
import { useToast } from "@/hooks/use-toast";
import { Observation } from "@/api/observation/types/observation.types";
import EditarHojaRuta from "../HojasRuta/components/EditarHojaRuta";
import WarningModal from "./components/WarningModal"; // Asegúrate de ajustar la ruta según tu estructura
import ControlarHojaRuta from "../HojasRuta/components/ControlarhojaRuta";

const BultosName: ColumnName[] = [
  { key: "codigo", label: "Codigo QR", opcional: false },
  { key: "recibido", label: "Recibido", opcional: false },
];

const DeleteObservationButton: React.FC<{ id: number }> = ({ id }) => {
  const { toast } = useToast();
  const deleteMutation = useDeleteObservation(id);
  return (
    <Button
      variant="ghost"
      onClick={() => {
        deleteMutation.mutate(undefined, {
          onSuccess: () => {
            toast({ title: "Observación eliminada" });
          },
          onError: (error) => {
            console.error("Error al eliminar observación:", error);
            toast({
              title: "Error",
              description: "Error al eliminar observación",
              variant: "destructive",
            });
          },
        });
      }}
    >
      <X size={16} />
    </Button>
  );
};

const RouteSheetDetail: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();
  const { toast } = useToast();

  const { transformedRouteSheet, loading, error } = useTransformedRouteSheet(codigo!);
  const { data: obs } = useObservationsByRouteSheet(transformedRouteSheet?.id || 0);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { mutate: createObservation, status: createStatus } = useCreateObservation();
  const creatingObservation = createStatus === "pending";

  const [isControlModalOpen, setIsControlModalOpen] = useState(false);

  const [obText, setObText] = useState("");
  const [isObservationDialogOpen, setIsObservationDialogOpen] = useState(false);
  const [editingObservation, setEditingObservation] = useState<Observation | null>(null);

  // Estado para controlar la apertura del WarningModal
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const updateMutation = useUpdateObservation(editingObservation ? editingObservation.id : -1);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Error al cargar los detalles</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  if (!transformedRouteSheet) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">No se encontró la hoja de ruta</h2>
      </div>
    );
  }

  const routeSheet = transformedRouteSheet;

  const handleSaveObservation = () => {
    if (!obText.trim()) return;
    const payload = {
      route_sheet_id: routeSheet.id,
      sucursal_id: routeSheet.sucursal_id,
      texto: obText,
    };
    if (editingObservation) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast({ title: "Observación actualizada exitosamente" });
          setObText("");
          setEditingObservation(null);
          setIsObservationDialogOpen(false);
        },
        onError: (error: any) => {
          console.error("Error al actualizar observación:", error);
          toast({
            title: "Error",
            description: "Error al actualizar observación",
            variant: "destructive",
          });
        },
      });
    } else {
      createObservation(payload, {
        onSuccess: () => {
          toast({ title: "Observación creada exitosamente" });
          setObText("");
          setIsObservationDialogOpen(false);
        },
        onError: (error: any) => {
          console.error("Error al crear observación:", error);
          toast({
            title: "Error",
            description: "Error al crear observación",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleControl = () => {
    if (routeSheet.estado === "creado") {
      setIsWarningModalOpen(true);
    } else {
      setIsControlModalOpen(true);
    }
  };

  return (
    <div className="p-4 flex-1 max-w-3xl mx-auto">
      <div className="flex justify-between">
        <Button variant="link" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft />
          Volver
        </Button>
        {isAuthorized(["superadmin", "sucursal", "deposito"]) && (
          <div className="gap-4 flex">
            {isAuthorized(["superadmin", "sucursal"]) && (
              <Button disabled={routeSheet.estado === "recibido"} onClick={handleControl}>
                Controlar
              </Button>
            )}
            {isAuthorized(["deposito", "superadmin"]) && (
              <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Editar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Hoja de Ruta</DialogTitle>
                  </DialogHeader>
                  {routeSheet && (
                    <EditarHojaRuta
                      codigo={routeSheet.codigo}
                      onUpdated={() => {
                        setEditModalOpen(false);
                      }}
                      setEditModalOpen={setEditModalOpen}
                      currentStateId={routeSheet.estado_id}
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Detalle de la Hoja de Ruta: {routeSheet.codigo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Estado Actual:</strong>{" "}
                {routeSheet.estado || routeSheet.estado_id}
              </p>
              <p>
                <strong>Depósito:</strong>{" "}
                {routeSheet.deposito || routeSheet.deposito_id}
              </p>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {routeSheet.createdAtFormatted || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Repartidor a Cargo:</strong>{" "}
                {routeSheet.repartidor || routeSheet.repartidor_id}
              </p>
              <p>
                <strong>Sucursal de Destino:</strong>{" "}
                {routeSheet.sucursal || routeSheet.sucursal_id}
              </p>
              <p>
                <strong>Total de Bultos:</strong>{" "}
                {routeSheet.bultosCount ?? 0}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mt-4 space-y-2">
              <p>
                <strong>Fecha de Envío:</strong>{" "}
                {routeSheet.sentAtFormatted || "Pendiente"}
              </p>
              <p>
                <strong>Fecha de Recepción:</strong>{" "}
                {routeSheet.receivedAtFormatted || "Pendiente"}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Remitos Asociados:</strong>
              </p>
              {routeSheet.remitos && routeSheet.remitos.length > 0 ? (
                <ul className="list-disc pl-5">
                  {routeSheet.remitos.map((remito: any) => (
                    <li key={remito.id}>{remito.external_id}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay remitos asignados.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-3xl mx-auto mt-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Observaciones ({obs?.length})
          </CardTitle>
          {isAuthorized(["sucursal", "superadmin"]) && (
            <Dialog
              open={isObservationDialogOpen}
              onOpenChange={(open) => {
                setIsObservationDialogOpen(open);
                if (!open) {
                  setObText("");
                  setEditingObservation(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingObservation(null);
                    setObText("");
                    setIsObservationDialogOpen(true);
                  }}
                >
                  Añadir Observación
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingObservation ? "Editar Observación" : "Nueva Observación"}
                  </DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="Escribe tu observación..."
                  className="w-full mb-4"
                  value={obText}
                  onChange={(e) => setObText(e.target.value)}
                />
                <DialogFooter className="flex justify-end space-x-2">
                  <Button
                    onClick={handleSaveObservation}
                    disabled={creatingObservation || !obText.trim()}
                  >
                    {creatingObservation ? "Guardando..." : "Guardar"}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setObText("");
                        setEditingObservation(null);
                      }}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {obs && obs.length > 0 ? (
            <ul className="space-y-2">
              {obs.map((ob) => (
                <li
                  key={ob.id}
                  className="p-2 border rounded flex justify-between items-center"
                >
                  <div className="flex gap-2">
                    <strong>{ob.created_at.toLocaleString().split("T")[0]}:</strong>{" "}
                    <span>{ob.texto}</span>
                  </div>
                  {isAuthorized(["sucursal", "superadmin"]) && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingObservation(ob);
                          setObText(ob.texto);
                          setIsObservationDialogOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <DeleteObservationButton id={ob.id} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay observaciones asignadas.</p>
          )}
        </CardContent>
      </Card>
      <Card className="max-w-3xl mx-auto mt-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Detalle de Bultos</CardTitle>
        </CardHeader>
        <CardContent>
          <TablaGenerica
            data={routeSheet.bultos}
            columnNames={BultosName}
            showActions={false}
            showFilter={false}
            showPagination={false}
          />
        </CardContent>
      </Card>
      
      {/* Se integra el WarningModal condicionalmente */}
      {isWarningModalOpen && (
        <WarningModal isOpen={isWarningModalOpen} onClose={() => setIsWarningModalOpen(false)} codigo={routeSheet.codigo} setIsControlModalOpen={setIsControlModalOpen}/>
      )}

      {isControlModalOpen && (
        <ControlarHojaRuta
          isOpen={isControlModalOpen}
          onClose={() => setIsControlModalOpen(false)}
          data={routeSheet}
        />
      )}
      
      <div className="h-20" />
    </div>
  );
};

export default RouteSheetDetail;
