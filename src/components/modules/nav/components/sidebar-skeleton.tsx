"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { ROUTES } from "@/routes/routeConfig"

export function AppSidebarSkeleton(props: React.ComponentProps<typeof Sidebar>) {
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
                <div className="flex items-center gap-2">
                  {/* Simula el avatar */}
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  {/* Simula el texto del usuario */}
                  <div className="flex flex-col">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Simula el contenido principal del sidebar */}
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full mt-4" />
      </SidebarContent>
      <SidebarFooter>
        {/* Simula la parte inferior, por ejemplo el NavUser */}
        <Skeleton className="h-8 w-full" />
      </SidebarFooter>
    </Sidebar>
  )
}
