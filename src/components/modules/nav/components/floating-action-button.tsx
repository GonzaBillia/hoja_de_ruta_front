import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

interface FloatingActionButtonProps {
  // Puedes definir props adicionales si lo necesitas.
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  (props, ref) => {
    return (
      <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-4 z-50">
        <Button
          ref={ref}
          variant="default"
          className="rounded-xl w-full mx-auto px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Escanear"
          {...props}
        >
          <QrCode className="h-8 w-8" />
        </Button>
      </div>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";
