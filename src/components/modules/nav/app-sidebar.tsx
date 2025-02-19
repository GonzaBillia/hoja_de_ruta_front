"use client"

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


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useCurrentUser()

  if (isLoading) {
    return <AppSidebarSkeleton />
  }

  // Si no se obtuvo usuario, se muestra un mensaje o se puede redirigir
  if (!userData) {
    return <div>No se pudo cargar el usuario.</div>
  }

  // Filtramos los proyectos según el rol del usuario.
  const allowedProjects = data.projects.filter((project) => {
    // Si no se especifican roles, se asume que el proyecto es accesible para todos.
    if (!project.allowedRoles) return true;
    return project.allowedRoles.includes(userData.role?.name);
  });

  const allowedGestiones = data.gestiones.filter((gestion) => {
    // Si no se especifican roles, se asume que el proyecto es accesible para todos.
    if (!gestion.allowedRoles) return true;
    return gestion.allowedRoles.includes(userData.role?.name);
  });

  const allowedTools = data.tools.filter((tool) => {
    // Si no se especifican roles, se asume que el proyecto es accesible para todos.
    if (!tool.allowedRoles) return true;
    return tool.allowedRoles.includes(userData.role?.name);
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
                    {userData.role?.name || ""}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={allowedProjects} title="Menu" />
        <NavProjects projects={allowedGestiones} title="Gestión" />
        <NavProjects projects={allowedTools} title="Utilidades" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
