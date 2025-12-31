"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingCart,
  Users,
  Video,
  ClipboardCheck,
  Bell,
  Package,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Navigation pour chaque type d'administrateur
const navigation = {
  super_admin: [
    { name: "Tableau de bord", href: "/admin/super/dashboard", icon: LayoutDashboard },
    { name: "Utilisateurs", href: "/admin/super/utilisateurs", icon: Users },
    { name: "Commandes", href: "/admin/super/commandes", icon: Package },
    { name: "Demandes", href: "/admin/super/demandes", icon: FileText },
    { name: "Messages", href: "/admin/super/messages", icon: MessageSquare },
    { name: "Boutique", href: "/admin/super/boutique", icon: ShoppingCart },
    { name: "Contenu", href: "/admin/super/contenu", icon: FileText },
    { name: "Statistiques", href: "/admin/super/statistiques", icon: BarChart3 },
    { name: "Paramètres", href: "/admin/super/parametres", icon: Settings },
  ],
  teacher: [
    { name: "Tableau de bord", href: "/admin/professeur/dashboard", icon: LayoutDashboard },
    { name: "Demandes", href: "/admin/professeur/demandes", icon: Users },
    { name: "Messages", href: "/admin/professeur/messages", icon: MessageSquare },
    { name: "Cours", href: "/admin/professeur/cours", icon: BookOpen },
    { name: "Exercices", href: "/admin/professeur/exercices", icon: FileText },
    { name: "Soumissions", href: "/admin/professeur/soumissions", icon: ClipboardCheck },
    { name: "Quiz", href: "/admin/professeur/quiz", icon: FileText },
    { name: "Vidéos", href: "/admin/professeur/videos", icon: Video },
    { name: "Notifications", href: "/admin/professeur/notifications", icon: Bell },
    { name: "Paramètres", href: "/admin/professeur/parametres", icon: Settings },
  ],
  tutor: [
    { name: "Tableau de bord", href: "/admin/tuteur/dashboard", icon: LayoutDashboard },
    { name: "Séances", href: "/admin/tuteur/seances", icon: BookOpen },
    { name: "Étudiants", href: "/admin/tuteur/etudiants", icon: Users },
    { name: "Messages", href: "/admin/tuteur/messages", icon: MessageSquare },
    { name: "Paramètres", href: "/admin/tuteur/parametres", icon: Settings },
  ],
  editor: [
    { name: "Tableau de bord", href: "/admin/redacteur/dashboard", icon: LayoutDashboard },
    { name: "Articles", href: "/admin/redacteur/articles", icon: FileText },
    { name: "Médias", href: "/admin/redacteur/medias", icon: Video },
    { name: "Paramètres", href: "/admin/redacteur/parametres", icon: Settings },
  ],
}

export function AdminSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const navItems = navigation[userRole as keyof typeof navigation] || []

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link href="/" className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-bold text-white">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Mathosphère</span>
            <span className="text-xs text-muted-foreground">Administration</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col space-y-1">
          <p className="text-xs text-muted-foreground">
            Connecté en tant que {userRole === "super_admin" ? "Super Admin" : userRole}
          </p>
          <p className="text-xs text-muted-foreground">v1.0.0</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
