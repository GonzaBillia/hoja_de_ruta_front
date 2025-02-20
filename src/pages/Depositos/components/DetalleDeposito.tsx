import React from "react";
import useDeposito from "@/api/deposito/hooks/useDeposito"; // Asegúrate de que exista este hook y que esté en la ruta correcta
import FullScreenLoader from "@/components/common/loader/FSLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Deposito } from "@/api/deposito/types/deposito.types";

interface DetalleDepositoProps {
  rowData: Deposito;
  open: boolean;
  onClose: () => void;
}

const DetalleDeposito: React.FC<DetalleDepositoProps> = ({ rowData, open, onClose }) => {
  // Se usa el hook para obtener los detalles del depósito a partir del id
  const { data, isLoading, error } = useDeposito(rowData.id);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No se encontraron datos del depósito.</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle de Depósito</DialogTitle>
          <DialogDescription>
            Información detallada del depósito.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {data.id}
          </p>
          <p>
            <strong>Código:</strong> {data.codigo}
          </p>
          <p>
            <strong>Nombre:</strong> {data.nombre}
          </p>
          {data.ubicacion && (
            <p>
              <strong>Ubicación:</strong> {data.ubicacion}
            </p>
          )}
          {/* Agrega otros campos si es necesario */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalleDeposito;
