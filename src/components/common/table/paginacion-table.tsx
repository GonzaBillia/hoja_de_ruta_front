// PaginacionTabla.tsx
import { Button } from "@/components/ui/button";

interface PaginacionTablaProps {
  currentPage: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function PaginacionTabla({
  currentPage,
  pageCount,
  onPrevious,
  onNext,
}: PaginacionTablaProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentPage <= 1}
      >
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentPage >= pageCount}
      >
        Siguiente
      </Button>
    </div>
  );
}
