import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUpdateRouteSheetState from "@/api/route-sheets/hooks/useUpdateRouteSheetState";
import { useToast } from "@/hooks/use-toast";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  codigo: string;
  setIsControlModalOpen: (open: boolean) => void
}

const WarningModal = ({ isOpen, onClose, codigo, setIsControlModalOpen }: WarningModalProps) => {
  const [confirmText, setConfirmText] = useState("");
  const updateMutation = useUpdateRouteSheetState(codigo);
  const { toast } = useToast();

  const handleConfirm = () => {
    if (confirmText.trim().toLowerCase() === "me ha llegado") {
        updateMutation.mutate(
            { estado_id: 3 },
            {
              onSuccess: () => {
                toast({ title: "Estado actualizado a Enviado", variant: "success" });
                onClose(); // Cierra el WarningModal
                setConfirmText("");
                // Abre el modal de ControlarHojaRuta
                setIsControlModalOpen(true);
              },
              onError: () => {
                toast({
                  title: "Error",
                  description: "Error al actualizar el estado de la hoja de ruta",
                  variant: "destructive",
                });
              },
            }
          );
    } else {
      toast({
        title: "Error",
        description: 'Por favor, escribe "me ha llegado" para confirmar',
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advertencia</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            El depósito no confirmó el envío aún, ¿te ha llegado? <br />
            Confirmar esta acción cambiará el estado a "Enviado" para comenzar el control.
          </p>
          <Input
            placeholder='Confirmar escribiendo "me ha llegado"'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm}>Confirmar</Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => { onClose(); setConfirmText(""); }}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;
