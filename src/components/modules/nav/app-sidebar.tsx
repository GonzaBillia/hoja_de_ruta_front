"use client"

import * as React from "react"
import {
  Command,
  Frame
} from "lucide-react"

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

const data = {

  projects: [
    { name: "Hojas de Ruta", url: ROUTES.MAIN, icon: Frame },
    //{ name: "Sales & Marketing", url: "#", icon: PieChart },
    //{ name: "Travel", url: "#", icon: Map },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useCurrentUser()

  if (isLoading) {
    return <AppSidebarSkeleton />
  }

  // Si no se obtuvo usuario, puedes mostrar un mensaje o simplemente no renderizar la sidebar
  if (!userData) {
    return <div>No se pudo cargar el usuario.</div>
  }

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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
