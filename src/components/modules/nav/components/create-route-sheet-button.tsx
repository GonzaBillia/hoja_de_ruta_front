import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from "@/routes/routeConfig";

const NewRouteSheetButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Compara la ruta actual con la ruta de "Nueva Hoja de Ruta"
  const isCurrentRoute = location.pathname === ROUTES.NUEVA;

  const handleClick = () => {
    if (!isCurrentRoute) {
      navigate(ROUTES.NUEVA);
    }
  };

  return (
    <Button
      variant="principal"
      className="rounded-md flex items-center px-4 py-2 "
      onClick={handleClick}
      disabled={isCurrentRoute}
    >
      <Plus className="mr-2 h-5 w-5" />
      Nueva Hoja de Ruta
    </Button>
  );
};

export default NewRouteSheetButton;

