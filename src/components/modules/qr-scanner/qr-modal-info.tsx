import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrData } from "@/components/common/qr-scanner/types/qr-scanner";

import useDeposito from "@/api/deposito/hooks/useDeposito";
import useRouteSheet from "@/api/route-sheets/hooks/useRouteSheet";
import useBultoByCode from "@/api/bulto/hooks/useBultoByCode";
import useTiposBultos from "@/api/tipos-bulto/hooks/useTiposBulto";
import { TipoBulto } from "@/api/tipos-bulto/types/tiposBulto.types";
import useEstados from "@/api/estado/hooks/useEstados";
import { Estado } from "@/api/estado/types/estado.types";
import useSucursal from "@/api/sucursal/hooks/useSucursal";

interface QrModalInfoProps {
  qrData: QrData;
  onClose?: () => void;
}

const QrModalInfo: React.FC<QrModalInfoProps> = ({ qrData, onClose }) => {
  const [open, setOpen] = useState(true);

  // Llamadas a hooks para obtener información general
  const { data: tiposBultos } = useTiposBultos();
  const { data: deposito } = useDeposito(qrData?.depositId || 0);
  const { data: estados } = useEstados()

  // Hook para buscar el bulto asociado al QR
  const { data: bulto, refetch: refetchBultos } = useBultoByCode(qrData.codigo);

  // Hook para traer la información del RouteSheet a partir del routesheet_id del bulto
  const { data: routeSheet, refetch: refetchRouteSheet } = useRouteSheet(bulto?.route_sheet_id || 0);
  const { data: sucursal, refetch: refetchSucursal } = useSucursal(routeSheet?.sucursal_id || 0)

  // Cuando el componente se monta o cambia el qrData se busca el bulto asociado
  useEffect(() => {
    refetchBultos();
  }, [qrData, refetchBultos]);

  // Si se encontró el bulto y tiene un routesheet_id, se busca la información del RouteSheet
  useEffect(() => {
    if (bulto && bulto.route_sheet_id) {
      refetchRouteSheet();
    }
  }, [bulto, refetchRouteSheet]);

  useEffect(() => {
    if (routeSheet && routeSheet.sucursal_id) {
      refetchSucursal()
    }
  },[routeSheet, refetchSucursal])

  // Se extrae el nombre del tipo de bulto según el id (se asume que existe la propiedad "tipoBultoId")
  const tipoBultoNombre =
    bulto && tiposBultos
      ? tiposBultos.find((tipo: TipoBulto) => tipo.codigo === qrData.tipoBultoCode)?.nombre
      : undefined;

    const estadoNombre =
      estados && routeSheet
        ? estados.find((est: Estado) => est.id === routeSheet.estado_id)?.nombre
        : undefined;
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Información del QR</DialogTitle>
          <DialogDescription>
            Se muestra la información asociada al código QR escaneado.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col gap-6">
          {/* Datos del QR */}
          <div>
            <h3 className="text-lg font-bold mb-2">Datos del QR</h3>
            <p>
              <span className="font-semibold">Código:</span> {qrData.codigo}
            </p>
          </div>

          {/* Información del bulto */}
          {bulto === null || sucursal === null ? (
            <p>El código no está en USO.</p>
          ) : bulto && sucursal ? (
            <div className="border p-3 rounded-md">
              {tipoBultoNombre && (
                <p>
                  <span className="font-semibold">Tipo de Bulto:</span> {tipoBultoNombre}
                </p>
              )}
              <p>
                <span className="font-semibold">Sucursal:</span> {sucursal.nombre}
              </p>
            </div>
          ) : (
            <p>Buscando información del bulto...</p>
          )}

          {/* Información del RouteSheet */}
          {routeSheet && (
            <div className="border p-3 rounded-md">
              <h4 className="font-bold mb-1">Información de la Hoja de Ruta</h4>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Código:</span> {routeSheet.codigo}
                </p>
                <p>
                  <span className="font-semibold">Estado Actual:</span> {estadoNombre}
                </p>
                <p>
                  <span className="font-semibold">Creado:</span>{" "}
                  {new Date(routeSheet.created_at).toLocaleString()}
                </p>
                {routeSheet.sent_at && (
                  <p>
                  <span className="font-semibold">Enviado:</span>{" "}
                  {routeSheet.sent_at ? new Date(routeSheet.sent_at).toLocaleString() : "No enviado"}
                </p>
                )}
                {routeSheet.received_incomplete_at && (
                  <p>
                  <span className="font-semibold">Recibido Incompleto:</span>{" "}
                  {routeSheet.received_incomplete_at ? new Date(routeSheet.received_incomplete_at).toLocaleString() : "No recibido"}
                </p>
                )}
                {routeSheet.received_at && (
                  <p>
                  <span className="font-semibold">Recibido:</span>{" "}
                  {routeSheet.received_at ? new Date(routeSheet.received_at).toLocaleString() : "No recibido"}
                </p>
                )}
              </div>
            </div>
          )}

          {/* Información del Depósito */}
          {deposito && (
            <div className="border p-3 rounded-md">
              <h4 className="font-bold mb-1">Información del Depósito</h4>
              <p>
                <span className="font-semibold">Código:</span> {deposito.codigo}
              </p>
              <p>
                <span className="font-semibold">Nombre:</span> {deposito.nombre}
              </p>
            </div>
          )}

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrModalInfo;
