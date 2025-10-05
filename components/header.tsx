"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { useCart } from "./cart-provider"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { items, toggleCart } = useCart()
  const { user, userData, logout } = useAuth()
  const router = useRouter()

  // Vérifier que items existe et est un tableau avant d'utiliser reduce
  const cartItemsCount = items && Array.isArray(items) ? items.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=32&width=32" alt="Mathosphère Logo" width={32} height={32} />
            <span className="font-bold text-xl">Mathosphère</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/cours" className="text-sm font-medium hover:text-primary">
            Cours
          </Link>
          <Link href="/exercices" className="text-sm font-medium hover:text-primary">
            Exercices
          </Link>
          <Link href="/quiz" className="text-sm font-medium hover:text-primary">
            Quiz
          </Link>
          <Link href="/videos" className="text-sm font-medium hover:text-primary">
            Vidéos
          </Link>
          <Link href="/forum" className="text-sm font-medium hover:text-primary">
            Forum
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary">
            Blog
          </Link>
          <Link href="/boutique" className="text-sm font-medium hover:text-primary">
            Boutique
          </Link>
          <div className="relative group">
            <button className="text-sm font-medium hover:text-primary flex items-center gap-1">
              À propos <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-md shadow-lg hidden group-hover:block">
              <Link href="/encadrement" className="block px-4 py-2 text-sm hover:bg-muted">
                Encadrement personnalisé
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-sm hover:bg-muted">
                Contact
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>

          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {userData?.photoURL ? (
                  <Image
                    src={userData.photoURL || "/placeholder.svg"}
                    alt={userData.displayName || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background border rounded-md shadow-lg">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium">{userData?.displayName || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-muted">
                    Tableau de bord
                  </Link>
                  <Link href="/dashboard/mon-profil" className="block px-4 py-2 text-sm hover:bg-muted">
                    Mon profil
                  </Link>
                  {(userData?.role === "admin" ||
                    userData?.role === "superadmin" ||
                    userData?.role === "professor" ||
                    userData?.role === "tutor" ||
                    userData?.role === "editor") && (
                    <Link href="/admin/login" className="block px-4 py-2 text-sm hover:bg-muted">
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/connexion">Connexion</Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/cours" className="text-sm font-medium hover:text-primary">
              Cours
            </Link>
            <Link href="/exercices" className="text-sm font-medium hover:text-primary">
              Exercices
            </Link>
            <Link href="/quiz" className="text-sm font-medium hover:text-primary">
              Quiz
            </Link>
            <Link href="/videos" className="text-sm font-medium hover:text-primary">
              Vidéos
            </Link>
            <Link href="/forum" className="text-sm font-medium hover:text-primary">
              Forum
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              Blog
            </Link>
            <Link href="/boutique" className="text-sm font-medium hover:text-primary">
              Boutique
            </Link>
            <details className="group">
              <summary className="text-sm font-medium hover:text-primary cursor-pointer">À propos</summary>
              <div className="mt-2 ml-4 flex flex-col space-y-2">
                <Link href="/encadrement" className="text-sm hover:text-primary">
                  Encadrement personnalisé
                </Link>
                <Link href="/contact" className="text-sm hover:text-primary">
                  Contact
                </Link>
              </div>
            </details>
          </nav>
        </div>
      )}
    </header>
  )
}
