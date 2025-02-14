import useCurrentUser from "@/api/auth/hooks/use-current-user"
import { QrProvider } from "@/components/context/qr-context"
import { AppSidebar } from "@/components/modules/nav/app-sidebar"
import { SiteHeader } from "@/components/modules/nav/components/site-header"
import QrModal from "@/components/modules/qr-scanner/qr-modal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function DashboardLayout() {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  // Redirigir si no hay usuario autenticado después de la carga
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);
  
  return (
    <QrProvider>
      <div className="[--header-height:calc(theme('spacing.14'))] h-screen overflow-hidden">
          <SidebarProvider className="flex flex-col">
              <SiteHeader />
              <div className="flex flex-1 h-[calc(100svh-3.5rem)]">
                <AppSidebar />
                <SidebarInset>
                  <div className="h-full overflow-auto flex flex-1">
                    <Outlet />
                  </div>
                  <Toaster />
                </SidebarInset>
                <QrModal />
              </div>
          </SidebarProvider>
      </div>
    </QrProvider>
  )
}
