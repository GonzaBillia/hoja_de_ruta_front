import * as React from "react"
import { Command } from "lucide-react"
import { NavProjects } from "@/components/modules/nav/nav-projects"
import { NavUser } from "@/components/modules/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useCurrentUser from "@/api/auth/hooks/use-current-user"
import { Link } from "react-router-dom"
import { ROUTES } from "@/routes/routeConfig"
import { AppSidebarSkeleton } from "./components/sidebar-skeleton"
import { data } from "./components/modules"
import { useAuth } from "@/components/context/auth-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useCurrentUser()
  const { isAuthorized } = useAuth()

  if (isLoading) {
    return <AppSidebarSkeleton />
  }

  // Si no se obtuvo usuario, se muestra un mensaje o se puede redirigir
  if (!userData) {
    return <div>No se pudo cargar el usuario.</div>
  }

  // Usamos un valor por defecto en caso de que role?.name sea undefined.
  const roleName = userData.role?.name ?? ""

  // Filtramos los proyectos según el rol del usuario.
  const allowedProjects = data.projects.filter((project) => {
    if (!project.allowedRoles) return true;
    return project.allowedRoles.includes(roleName);
  });

  const allowedGestiones = data.gestiones.filter((gestion) => {
    if (!gestion.allowedRoles) return true;
    return gestion.allowedRoles.includes(roleName);
  });

  const allowedTools = data.tools.filter((tool) => {
    if (!tool.allowedRoles) return true;
    return tool.allowedRoles.includes(roleName);
  });

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={ROUTES.MAIN}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Sanchez Antoniolli
                  </span>
                  <span className="truncate text-xs">
                    {roleName}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={allowedProjects} title="Menu" />
        {isAuthorized(["superadmin"]) && (
          <>
            <NavProjects projects={allowedGestiones} title="Gestión" />
            <NavProjects projects={allowedTools} title="Utilidades" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
