import type { ReactNode } from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import AppShell from "@/components/app-shell"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}