import type { ReactNode } from "react"

import "./globals.css"
import AppShell from "@/components/app-shell"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}