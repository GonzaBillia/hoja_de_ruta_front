import React from "react";
import useSucursal from "@/api/sucursal/hooks/useSucursal";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Sucursal } from "@/api/sucursal/types/sucursal.types";

interface DetalleSucursalProps {
    rowData: Sucursal;
    open: boolean;
    onClose: () => void;
}

const DetalleSucursal: React.FC<DetalleSucursalProps> = ({ rowData, open, onClose }) => {
    const { data, isLoading, error } = useSucursal(rowData.id);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>No se encontraron datos de la sucursal.</div>;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalle de Sucursal</DialogTitle>
                    <DialogDescription>
                        Información detallada de la sucursal.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <p>
                        <strong>ID:</strong> {data.id}
                    </p>
                    <p>
                        <strong>Nombre:</strong> {data.nombre}
                    </p>
                    <p>
                        <strong>Codigo:</strong> {data.codigo}
                    </p>
                    <p>
                        <strong>Dirección:</strong> {data.direccion}
                    </p>
                    {data.telefono && (
                        <p>
                            <strong>Teléfono:</strong> {data.telefono}
                        </p>
                    )}
                    {/* Agrega otros campos si es necesario */}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DetalleSucursal;
