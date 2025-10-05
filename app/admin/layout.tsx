"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    // Vérifier si l'utilisateur est sur la page de connexion
    if (pathname === "/admin/login") {
      setIsLoggedIn(false)
      return
    }

    // Simuler la vérification d'authentification
    // Dans une vraie application, cela serait fait avec Firebase Auth
    setIsLoggedIn(true)

    // Déterminer le rôle en fonction du chemin
    if (pathname.includes("/admin/super")) {
      setUserRole("super_admin")
    } else if (pathname.includes("/admin/professeur")) {
      setUserRole("teacher")
    } else if (pathname.includes("/admin/tuteur")) {
      setUserRole("tutor")
    } else if (pathname.includes("/admin/redacteur")) {
      setUserRole("editor")
    }
  }, [pathname])

  // Si l'utilisateur est sur la page de connexion, ne pas afficher le layout admin
  if (pathname === "/admin/login") {
    return children
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar userRole={userRole} />
        <div className="flex flex-col flex-1">
          <AdminHeader userRole={userRole} />
          <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">{children}</main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
