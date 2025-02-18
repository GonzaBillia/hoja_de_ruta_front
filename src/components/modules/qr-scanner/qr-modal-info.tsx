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

interface QrModalInfoProps {
  qrData: QrData;
  onClose?: () => void;
}

const QrModalInfo: React.FC<QrModalInfoProps> = ({ qrData, onClose }) => {
  const [open, setOpen] = useState(true);

  // Llamadas a hooks para obtener información general
  const { data: tiposBultos } = useTiposBultos();
  const { data: deposito } = useDeposito(qrData?.depositId || 0);

  // Hook para buscar el bulto asociado al QR
  const { data: bulto, refetch: refetchBultos } = useBultoByCode(qrData.codigo);

  // Hook para traer la información del RouteSheet a partir del routesheet_id del bulto
  const { data: routeSheet, refetch: refetchRouteSheet } = useRouteSheet(bulto?.route_sheet_id || 0);

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

  // Se extrae el nombre del tipo de bulto según el id (se asume que existe la propiedad "tipoBultoId")
  const tipoBultoNombre =
    bulto && tiposBultos
      ? tiposBultos.find((tipo: TipoBulto) => tipo.codigo === qrData.tipoBultoCode)?.nombre
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
          {bulto === null ? (
            <p>El código no está en USO.</p>
          ) : bulto ? (
            <div className="border p-3 rounded-md">
              <p>
                <span className="font-semibold">ID del Bulto:</span> {bulto.id}
              </p>
              <p>
                <span className="font-semibold">RouteSheet ID:</span> {bulto.route_sheet_id}
              </p>
              {tipoBultoNombre && (
                <p>
                  <span className="font-semibold">Tipo de Bulto:</span> {tipoBultoNombre}
                </p>
              )}
            </div>
          ) : (
            <p>Buscando información del bulto...</p>
          )}

          {/* Información del RouteSheet */}
          {routeSheet && (
            <div className="border p-3 rounded-md">
              <h4 className="font-bold mb-1">Información del RouteSheet</h4>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Código:</span> {routeSheet.codigo}
                </p>
                <p>
                  <span className="font-semibold">Estado:</span> {routeSheet.estado_id}
                </p>
                <p>
                  <span className="font-semibold">Creado:</span>{" "}
                  {new Date(routeSheet.created_at).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Enviado:</span>{" "}
                  {routeSheet.sent_at ? new Date(routeSheet.sent_at).toLocaleString() : "No enviado"}
                </p>
                <p>
                  <span className="font-semibold">Depósito:</span>{" "}
                  {deposito ? deposito.nombre : routeSheet.deposito_id}
                </p>
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
              <p>
                <span className="font-semibold">Ubicación:</span> {deposito.ubicacion}
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
