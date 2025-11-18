"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpenCheck,
  Dumbbell,
  FileStack,
  PlaySquare,
  Send,
  BellRing,
  ClipboardList,
  Settings2,
  MessageCircle,
} from "lucide-react"

const teacherNav = [
  {
    title: "Dashboard",
    description: "Vue d'ensemble",
    href: "/admin/professeur/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cours",
    description: "Publier & gérer",
    href: "/admin/professeur/cours",
    icon: BookOpenCheck,
  },
  {
    title: "Exercices",
    description: "Sujets & corrigés",
    href: "/admin/professeur/exercices",
    icon: Dumbbell,
  },
  {
    title: "Quiz",
    description: "Évaluer vos élèves",
    href: "/admin/professeur/quiz",
    icon: FileStack,
  },
  {
    title: "Vidéos",
    description: "Bibliothèque premium",
    href: "/admin/professeur/videos",
    icon: PlaySquare,
  },
  {
    title: "Soumissions",
    description: "Copies à corriger",
    href: "/admin/professeur/soumissions",
    icon: ClipboardList,
  },
  {
    title: "Messages",
    description: "Accompagnement",
    href: "/admin/professeur/messages",
    icon: MessageCircle,
  },
  {
    title: "Notifications",
    description: "Alertes & retours",
    href: "/admin/professeur/notifications",
    icon: BellRing,
  },
  {
    title: "Demandes",
    description: "Encadrements",
    href: "/admin/professeur/demandes",
    icon: Send,
  },
  {
    title: "Paramètres",
    description: "Profil & préférences",
    href: "/admin/professeur/parametres",
    icon: Settings2,
  },
]

export function TeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { userData } = useAuth()
  const displayName = userData?.displayName || "Professeur"

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(48,78,140,0.35),_transparent_55%)] from-slate-950 via-slate-950 to-slate-900 text-foreground">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-white/10 bg-gradient-to-br from-primary/20 via-slate-950 to-slate-900 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary/40 bg-primary/15 text-primary">
                Espace professeur
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Bonjour {displayName} <span aria-hidden="true">👋</span>
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Pilotez vos cours, exercices, quiz et vidéos avec la même charte graphique que les pages publiques.
                  Chaque action est synchronisée instantanément avec vos élèves.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="gap-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white">
                  <Link href="/admin/professeur/cours">Publier un contenu</Link>
                </Button>
                <Button variant="outline" asChild className="gap-2 border-dashed border-primary/40 text-primary hover:bg-primary/5">
                  <Link href="/admin/professeur/soumissions">Corriger les copies</Link>
                </Button>
              </div>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-3 lg:max-w-xl">
              {[
                { label: "Élèves connectés", value: userData?.studentsCount ? userData.studentsCount : "—" },
                { label: "Dernier contenu", value: userData?.lastContentAt ? "Mis à jour" : "À publier" },
                { label: "Rôle", value: userData?.role === "admin" ? "Admin & Prof" : "Professeur" },
              ].map((insight) => (
                <div
                  key={insight.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em]">{insight.label}</p>
                  <p className="text-lg font-semibold text-foreground">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Navigation</p>
            <div className="mt-3 space-y-2">
              {teacherNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary-foreground shadow-lg shadow-primary/15"
                        : "text-muted-foreground hover:bg-white/5",
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-2xl p-2",
                        isActive ? "bg-primary text-white" : "bg-white/10 text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground/80">{item.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/10 p-4 text-xs text-muted-foreground">
              <p className="text-sm font-semibold text-primary">Astuce</p>
              <p className="mt-1">
                Préparez vos contenus en brouillon puis publiez-les en un clic pour garantir une expérience premium à vos élèves.
              </p>
            </div>
          </aside>

          <main className="space-y-8">{children}</main>
        </div>
      </div>
    </div>
  )
}


