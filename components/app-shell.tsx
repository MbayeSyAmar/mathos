"use client"

import type { ReactNode } from "react"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/toaster"

const Cart = dynamic(() => import("@/components/cart"), {
  ssr: false,
  loading: () => null,
})

const MathChatbot = dynamic(() => import("@/components/math-chatbot"), {
  ssr: false,
  loading: () => null,
})

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")
  const isDashboardPage = pathname?.startsWith("/dashboard")

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="mathosphere-theme">
        <CartProvider>
          {isAdminPage ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Cart />
              <MathChatbot />
              <Toaster />
            </div>
          )}
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

