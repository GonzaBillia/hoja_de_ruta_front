import { AppSidebar } from "@/components/modules/nav/app-sidebar"
import FloatingActionButton from "@/components/modules/nav/components/floating-action-button"
import { SiteHeader } from "@/components/modules/nav/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="[--header-height:calc(theme('spacing.14'))] h-screen">
        <SidebarProvider className="flex flex-col h-full">
            <SiteHeader />
            <div className="flex flex-1 overflow-hidden">
            <AppSidebar className="flex-shrink-0" />
            <SidebarInset className="flex-1 overflow-auto">
                <Outlet />
            </SidebarInset>
            <FloatingActionButton />
            </div>
        </SidebarProvider>
        </div>

  )
}
