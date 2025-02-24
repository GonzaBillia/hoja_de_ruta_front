// components/PDFDownloadModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PDFDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const PDFDownloadModal: React.FC<PDFDownloadModalProps> = ({ isOpen, onClose, onDownload }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[425px] mx-auto">
        <DialogHeader>
          <DialogTitle>Descarga el Comprobante</DialogTitle>
          <DialogDescription>
            Descarga el Comprobante de Recepción para poder finalizar el proceso de control.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onDownload} variant="default">
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFDownloadModal;
