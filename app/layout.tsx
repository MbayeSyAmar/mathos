"use client"

import "./globals.css"
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import Cart from "@/components/cart"
import MathChatbot from "@/components/math-chatbot"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isDashboardPage = pathname?.startsWith('/dashboard')

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="mathosphere-theme">
            <CartProvider>
              {isAdminPage ? (
                // Layout pour les pages admin (pas de Header/Footer global)
                <>
                  {children}
                  <Toaster />
                </>
              ) : isDashboardPage ? (
                // Layout pour le dashboard étudiant (avec Header)
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <Cart />
                  <MathChatbot />
                  <Toaster />
                </div>
              ) : (
                // Layout normal pour les pages publiques
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
      </body>
    </html>
  )
}