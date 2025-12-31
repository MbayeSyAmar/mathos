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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <Badge variant="outline" className="border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
                Espace professeur
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-slate-100">
                  Bonjour {displayName} <span aria-hidden="true">👋</span>
                </h1>
                <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
                  Pilotez vos cours, exercices, quiz et vidéos avec la même charte graphique que les pages publiques.
                  Chaque action est synchronisée instantanément avec vos élèves.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  <Link href="/admin/professeur/cours">Publier un contenu</Link>
                </Button>
                <Button variant="outline" asChild className="gap-2 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
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
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 font-semibold mb-1">{insight.label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400 font-semibold mb-3">Navigation</p>
            <div className="mt-3 space-y-2">
              {teacherNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-xl p-2 transition-colors",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={cn("font-semibold", isActive ? "text-white" : "text-slate-900 dark:text-slate-100")}>{item.title}</p>
                      <p className={cn("text-[11px]", isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400")}>{item.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-xs">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">💡 Astuce</p>
              <p className="text-slate-700 dark:text-slate-300">
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


