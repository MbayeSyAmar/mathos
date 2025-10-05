import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import Cart from "@/components/cart"
import MathChatbot from "@/components/math-chatbot"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mathosphère - Plateforme d'apprentissage des mathématiques",
  description:
    "Découvrez Mathosphère, la plateforme complète pour apprendre et progresser en mathématiques à tous les niveaux.",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Cart />
                <MathChatbot />
              </div>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
