import { ROUTES } from "@/routes/routeConfig";
import { Building2, Eye, Frame, QrCode, UserRoundCog, Vault } from "lucide-react";

export const data = {
    projects: [
      { 
        name: "Hojas de Ruta", 
        url: ROUTES.MAIN, 
        icon: Frame,
        allowedRoles: ["superadmin", "deposito", "repartidor", "sucursal"] // roles permitidos
      },
      { 
        name: "Observaciones", 
        url: ROUTES.OBS, 
        icon: Eye,
        allowedRoles: ["superadmin", "deposito"] // solo administradores pueden ver este módulo
      }
    ],
    gestiones: [
        { 
            name: "Depositos", 
            url: ROUTES.DEPOS, 
            icon: Vault,
            allowedRoles: ["superadmin"] // roles permitidos
          },
          { 
            name: "Sucursales", 
            url: ROUTES.SUCUS, 
            icon: Building2,
            allowedRoles: ["superadmin"] // solo administradores pueden ver este módulo
          },
          { 
            name: "Usuarios", 
            url: ROUTES.USERS, 
            icon: UserRoundCog,
            allowedRoles: ["superadmin"] // solo administradores pueden ver este módulo
          },
    ],
    tools: [
        { 
          name: "Generador de QR", 
          url: ROUTES.QR, 
          icon: QrCode,
          allowedRoles: ["superadmin"] // roles permitidos
        }
      ],
  }