"use client"

import { SidebarIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import React from "react"
import { Link, useLocation } from "react-router-dom"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    ...pathnames.map((value, index) => ({
      label: value.charAt(0).toUpperCase() + value.slice(1), // Capitalizar el texto
      href: `/${pathnames.slice(0, index + 1).join("/")}`, // Crear la URL acumulativa
    })),
  ];

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background justify-between">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={breadcrumb.href}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink as={Link} to={breadcrumb.href}>
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
      </div>
    <div>
        <ModeToggle />
    </div>
    </header>
  )
}
