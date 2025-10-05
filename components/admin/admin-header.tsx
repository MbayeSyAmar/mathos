"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "@/components/ui/sidebar"

const roleNames = {
  super_admin: "Super Administrateur",
  teacher: "Professeur",
  tutor: "Tuteur",
  editor: "Rédacteur",
}

export function AdminHeader({ userRole }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(3)

  const handleLogout = () => {
    // Dans une vraie application, déconnexion avec Firebase Auth
    router.push("/admin/login")
  }

  const userName = `Demo ${roleNames[userRole] || "Utilisateur"}`
  const userEmail = `demo-${userRole === "super_admin" ? "superadmin" : userRole}@mathosphere.com`

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />

      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {notifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <div className="flex items-center justify-between p-2">
              <p className="font-medium">Notifications</p>
              <Button variant="ghost" size="sm" className="text-xs">
                Tout marquer comme lu
              </Button>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <div className="p-2 text-sm hover:bg-accent">
                <p className="font-medium">Nouvelle inscription</p>
                <p className="text-muted-foreground">Un nouvel utilisateur s'est inscrit</p>
                <p className="mt-1 text-xs text-muted-foreground">Il y a 10 minutes</p>
              </div>
              <div className="p-2 text-sm hover:bg-accent">
                <p className="font-medium">Nouvelle commande</p>
                <p className="text-muted-foreground">Une nouvelle commande a été passée</p>
                <p className="mt-1 text-xs text-muted-foreground">Il y a 1 heure</p>
              </div>
              <div className="p-2 text-sm hover:bg-accent">
                <p className="font-medium">Nouveau message</p>
                <p className="text-muted-foreground">Vous avez reçu un nouveau message</p>
                <p className="mt-1 text-xs text-muted-foreground">Il y a 3 heures</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
              <Link href="#" className="text-sm text-primary hover:underline">
                Voir toutes les notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer de thème</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-block">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/${userRole === "super_admin" ? "super" : userRole}/profil`}>
                <User className="mr-2 h-4 w-4" />
                <span>Mon profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/${userRole === "super_admin" ? "super" : userRole}/parametres`}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
