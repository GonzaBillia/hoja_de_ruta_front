import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import { UserWithRoleName } from "../hooks/useUsuariosData";
import useRepartidorSucursales from "@/api/repartidor-sucursal/hooks/useRepartidorSucursales";
import useSucursales from "@/api/sucursal/hooks/useSucursales";

interface DetalleUsuarioProps {
  rowData: UserWithRoleName;
  open: boolean;
  onClose: () => void;
}

const DetalleUsuario: React.FC<DetalleUsuarioProps> = ({ rowData, open, onClose }) => {
  // Llamamos al hook useSucursales para obtener todas las sucursales
  const { data: allSucursales } = useSucursales();

  // Para usuarios repartidor, usamos useRepartidorSucursales solo si el rol es "repartidor"
  const isRepartidor = rowData.roleName?.toLowerCase() === "repartidor";
  const { data: repSucData, isLoading: repSucLoading } = useRepartidorSucursales(
    isRepartidor ? rowData.id : 0
  );

  // Mientras se cargan las relaciones (en caso de repartidor) mostramos un loader
  if (repSucLoading) {
    return <FullScreenLoader />;
  }

  // Mapeo de nombres de sucursales para repartidor
  let repartidorSucursales: string | undefined = undefined;
  if (isRepartidor && repSucData && allSucursales) {
    const nombres = repSucData.map((rel) => {
      const found = allSucursales.find((s) => s.id === rel.sucursal_id);
      return found ? found.nombre : "Sin asignar";
    });
    repartidorSucursales = nombres.join(", ");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del Usuario</DialogTitle>
          <DialogDescription>
            Información detallada del usuario.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {rowData.id}
          </p>
          <p>
            <strong>Usuario:</strong> {rowData.username}
          </p>
          <p>
            <strong>Email:</strong> {rowData.email}
          </p>
          <p>
            <strong>Rol:</strong> {rowData.roleName || "Sin asignar"}
          </p>
          {rowData.deposito && (
            <p>
              <strong>Depósito:</strong> {rowData.deposito}
            </p>
          )}
          {rowData.sucursal && (
            <p>
              <strong>Sucursal:</strong> {rowData.sucursal}
            </p>
          )}
          {isRepartidor && (
            <p>
              <strong>Sucursales:</strong>{" "}
              {repartidorSucursales ? repartidorSucursales : "Sin asignar"}
            </p>
          )}
          {/* Agrega otros campos si es necesario */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalleUsuario;
