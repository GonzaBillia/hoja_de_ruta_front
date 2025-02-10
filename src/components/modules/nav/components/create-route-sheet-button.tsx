import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {ROUTES} from "@/routes/routeConfig"

const NewRouteSheetButton: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTES.NUEVA);
    };
    return (
        <Button
            variant="default"
            className="rounded-md flex items-center px-4 py-2"
            onClick={handleClick}
        >
            <Plus className="mr-2 h-5 w-5" />
            Nueva Hoja de Ruta
        </Button>
    );
};

export default NewRouteSheetButton;
