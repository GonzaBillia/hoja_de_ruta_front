import { QrProvider } from "@/components/context/qr-context"
import { AppSidebar } from "@/components/modules/nav/app-sidebar"
import { SiteHeader } from "@/components/modules/nav/components/site-header"
import QrModal from "@/components/modules/qr-scanner/qr-modal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <QrProvider>
      <div className="[--header-height:calc(theme('spacing.14'))] h-screen max-w-screen overflow-hidden">
          <SidebarProvider className="flex flex-col h-full">
              <SiteHeader />
              <div className="flex flex-1 overflow-hidden">
              <AppSidebar className="flex-shrink-0" />
              <SidebarInset className="flex-1 overflow-auto">
                  <Outlet />
                  <Toaster />
              </SidebarInset>
              <QrModal />
              </div>
          </SidebarProvider>
      </div>
    </QrProvider>
  )
}
