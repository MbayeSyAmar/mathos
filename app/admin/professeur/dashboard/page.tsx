"use client"

import Link from "next/link"
import { type ComponentType, useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  ClipboardList,
  Loader2,
  PlaySquare,
  Sparkles,
  Users,
  Video,
  FileStack,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import {
  type Course,
  type Exercise,
  type Quiz,
  type Video as TeacherVideo,
  getCoursesByTeacher,
  getExercisesByTeacher,
  getQuizzesByTeacher,
  getVideosByTeacher,
} from "@/lib/services/content-service"
import { getTeacherStudents, type StudentAccess } from "@/lib/services/student-access-service"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type ContentKind = "course" | "exercise" | "quiz" | "video"

type DashboardContentItem = {
  id: string
  title: string
  type: ContentKind
  level?: string
  subject?: string
  status?: string
  updatedAt?: Date
}

const contentTypeMeta: Record<
  ContentKind,
  { label: string; badgeClass: string; icon: ComponentType<{ className?: string }> }
> = {
  course: {
    label: "Cours",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: BookOpen,
  },
  exercise: {
    label: "Exercice",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: FileStack,
  },
  quiz: {
    label: "Quiz",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: Sparkles,
  },
  video: {
    label: "Vidéo",
    badgeClass: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    icon: PlaySquare,
  },
}

const EMPTY_STATS = {
  courses: 0,
  exercises: 0,
  quizzes: 0,
  videos: 0,
  drafts: 0,
  published: 0,
}

export default function TeacherDashboard() {
  const { user, loading: authLoading, userData } = useAuth()
  const { toast } = useToast()

  const [courses, setCourses] = useState<Course[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [videos, setVideos] = useState<TeacherVideo[]>([])
  const [students, setStudents] = useState<StudentAccess[]>([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadDashboard = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!user?.uid) return

      mode === "initial" ? setLoading(true) : setRefreshing(true)

      try {
        const [coursesData, exercisesData, quizzesData, videosData, studentsData] = await Promise.all([
          getCoursesByTeacher(user.uid),
          getExercisesByTeacher(user.uid),
          getQuizzesByTeacher(user.uid),
          getVideosByTeacher(user.uid),
          getTeacherStudents(user.uid),
        ])

        setCourses(coursesData)
        setExercises(exercisesData)
        setQuizzes(quizzesData)
        setVideos(videosData)
        setStudents(studentsData)
        setErrorMessage(null)
      } catch (error) {
        console.error("Teacher dashboard fetch error:", error)
        setErrorMessage("Impossible de charger toutes vos données en temps réel.")
        toast({
          title: "Erreur de chargement",
          description: "Vérifiez votre connexion ou réessayez plus tard.",
          variant: "destructive",
        })
      } finally {
        mode === "initial" ? setLoading(false) : setRefreshing(false)
      }
    },
    [toast, user?.uid],
  )

  useEffect(() => {
    if (!authLoading && user?.uid) {
      loadDashboard("initial")
    }
  }, [authLoading, loadDashboard, user?.uid])

  const contentStats = useMemo(() => {
    if (loading) return EMPTY_STATS

    const counts = {
      courses: courses.length,
      exercises: exercises.length,
      quizzes: quizzes.length,
      videos: videos.length,
      drafts:
        courses.filter((c) => c.status === "draft").length +
        exercises.filter((e) => e.status === "draft").length +
        quizzes.filter((q) => q.status === "draft").length +
        videos.filter((v) => v.status === "draft").length,
      published:
        courses.filter((c) => c.status === "published").length +
        exercises.filter((e) => e.status === "published").length +
        quizzes.filter((q) => q.status === "published").length +
        videos.filter((v) => v.status === "published").length,
    }

    return counts
  }, [courses, exercises, loading, quizzes, videos])

  const recentContent = useMemo<DashboardContentItem[]>(() => {
    const toDate = (timestamp?: any) => {
      if (!timestamp) return undefined
      if (timestamp.toDate) return timestamp.toDate()
      return new Date(timestamp)
    }

    const merged: DashboardContentItem[] = [
      ...courses.map((course) => ({
        id: course.id,
        title: course.title,
        type: "course" as const,
        level: course.level,
        subject: course.subject,
        status: course.status,
        updatedAt: toDate(course.updatedAt || course.createdAt),
      })),
      ...exercises.map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        type: "exercise" as const,
        level: exercise.level,
        subject: exercise.subject,
        status: exercise.status,
        updatedAt: toDate(exercise.updatedAt || exercise.createdAt),
      })),
      ...quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        type: "quiz" as const,
        level: quiz.level,
        subject: quiz.subject,
        status: quiz.status,
        updatedAt: toDate(quiz.updatedAt || quiz.createdAt),
      })),
      ...videos.map((video) => ({
        id: video.id,
        title: video.title,
        type: "video" as const,
        level: video.level,
        subject: video.subject,
        status: video.status,
        updatedAt: toDate(video.updatedAt || video.createdAt),
      })),
    ]

    return merged
      .sort((a, b) => {
        const aTime = a.updatedAt?.getTime() ?? 0
        const bTime = b.updatedAt?.getTime() ?? 0
        return bTime - aTime
      })
      .slice(0, 6)
  }, [courses, exercises, quizzes, videos])

  const studentsSorted = useMemo(() => {
    return [...students].sort((a, b) => {
      const aTime = a.grantedAt?.toDate()?.getTime() ?? 0
      const bTime = b.grantedAt?.toDate()?.getTime() ?? 0
      return bTime - aTime
    })
  }, [students])

  const handleRefresh = () => {
    if (!user?.uid) return
    loadDashboard("refresh")
  }

  if (authLoading || loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connexion requise</CardTitle>
          <CardDescription>Vous devez être connecté en tant que professeur pour voir ce tableau de bord.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/auth/login">Se connecter</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 -m-6 p-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
      {errorMessage && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/50 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-red-900 dark:text-red-200">Données incomplètes</CardTitle>
              <CardDescription className="text-red-700 dark:text-red-300/80">{errorMessage}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50">
              {refreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Cours actifs",
            value: contentStats.courses,
            subValue: `${courses.filter((c) => c.status === "published").length} publiés`,
            icon: BookOpen,
            iconBg: "bg-blue-100 dark:bg-blue-900/50",
            iconColor: "text-blue-600 dark:text-blue-400",
            textColor: "text-slate-900 dark:text-slate-100",
          },
          {
            label: "Exercices",
            value: contentStats.exercises,
            subValue: `${exercises.filter((e) => e.status === "published").length} prêts`,
            icon: ClipboardList,
            iconBg: "bg-purple-100 dark:bg-purple-900/50",
            iconColor: "text-purple-600 dark:text-purple-400",
            textColor: "text-slate-900 dark:text-slate-100",
          },
          {
            label: "Quiz",
            value: contentStats.quizzes,
            subValue: `${quizzes.filter((q) => q.status === "published").length} disponibles`,
            icon: Sparkles,
            iconBg: "bg-orange-100 dark:bg-orange-900/50",
            iconColor: "text-orange-600 dark:text-orange-400",
            textColor: "text-slate-900 dark:text-slate-100",
          },
          {
            label: "Vidéos",
            value: contentStats.videos,
            subValue: `${videos.filter((v) => v.status === "published").length} publiées`,
            icon: Video,
            iconBg: "bg-pink-100 dark:bg-pink-900/50",
            iconColor: "text-pink-600 dark:text-pink-400",
            textColor: "text-slate-900 dark:text-slate-100",
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={cn("overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1")}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className={cn("text-4xl font-bold mb-1", stat.textColor)}>{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.subValue}</p>
                </div>
                <div className={cn("rounded-2xl p-4 shadow-md", stat.iconBg)}>
                  <Icon className={cn("h-6 w-6", stat.iconColor)} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-blue-600 dark:text-blue-400">{contentStats.published}</span> ressources publiées · <span className="font-semibold text-orange-600 dark:text-orange-400">{contentStats.drafts}</span> brouillons à finaliser
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            {refreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Actualiser les données
          </Button>
          <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Link href="/admin/professeur/cours">
              Ajouter un contenu
              <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <CardTitle className="text-slate-900 dark:text-slate-100 text-xl">Activité récente</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Dernières ressources mises à jour ou publiées</CardDescription>
            </div>
            <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-400 font-medium">
              Temps réel
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {recentContent.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">Aucun contenu pour le moment. Publiez votre premier cours pour voir vos analytics ici.</p>
              </div>
            ) : (
              recentContent.map((item) => {
                const meta = contentTypeMeta[item.type]
                const Icon = meta.icon
                return (
                  <div
                    key={item.id}
                    className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("rounded-xl p-2.5 shadow-sm", meta.badgeClass)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                          <Badge className={cn("text-xs font-medium", meta.badgeClass)}>{meta.label}</Badge>
                          {item.status && (
                            <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                              {item.status === "published" ? "Publié" : item.status === "draft" ? "Brouillon" : item.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.level} • {item.subject} · {formatRelative(item.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <CardTitle className="text-slate-900 dark:text-slate-100 text-xl">Élèves connectés</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Les accès actifs à vos contenus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {studentsSorted.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">Aucun élève n&apos;a encore accès à vos cours.</p>
              </div>
            ) : (
              studentsSorted.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 hover:shadow-md transition-all duration-200">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-200 dark:ring-blue-900">
                    <AvatarImage src="" alt={student.studentName} />
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">
                      {getInitials(student.studentName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{student.studentName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {student.formule} · {student.subject || "Mathématiques"} · {formatRelative(student.grantedAt?.toDate())}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-medium">
                    Actif
                  </Badge>
                </div>
              ))
            )}
            {studentsSorted.length > 5 && (
              <Button asChild variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50">
                <Link href="/admin/professeur/demandes">Voir tous les accès</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <CardTitle className="text-slate-900 dark:text-slate-100 text-xl">Qualité & statut</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Suivez vos contenus publiés vs brouillons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {[
              { label: "Cours", total: courses.length, published: courses.filter((c) => c.status === "published").length, color: "blue" },
              {
                label: "Exercices",
                total: exercises.length,
                published: exercises.filter((c) => c.status === "published").length,
                color: "purple",
              },
              { label: "Quiz", total: quizzes.length, published: quizzes.filter((c) => c.status === "published").length, color: "orange" },
              { label: "Vidéos", total: videos.length, published: videos.filter((c) => c.status === "published").length, color: "pink" },
            ].map((row) => {
              const percentage = row.total === 0 ? 0 : (row.published / row.total) * 100
              const colorClasses = {
                blue: "bg-blue-500",
                purple: "bg-purple-500",
                orange: "bg-orange-500",
                pink: "bg-pink-500",
              }
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">
                      {row.published}/{row.total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500 shadow-sm", colorClasses[row.color as keyof typeof colorClasses])}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <CardTitle className="text-slate-900 dark:text-slate-100 text-xl">Actions rapides</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Gagnez du temps sur vos tâches récurrentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {[
              {
                label: "Créer un nouveau cours",
                href: "/admin/professeur/cours",
                hint: "Gabarits prêts à l'emploi",
                icon: "📚",
              },
              {
                label: "Ajouter un quiz adaptatif",
                href: "/admin/professeur/quiz",
                hint: "15 min pour le publier",
                icon: "✨",
              },
              {
                label: "Uploader une vidéo premium",
                href: "/admin/professeur/videos",
                hint: "Support YouTube ou MP4",
                icon: "🎥",
              },
              {
                label: "Traiter les copies envoyées",
                href: "/admin/professeur/soumissions",
                hint: "Notifiez vos élèves",
                icon: "📝",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 py-3.5 text-sm transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{action.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{action.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{action.hint}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-lg">
          <CardHeader className="border-b border-blue-200 dark:border-blue-900 pb-4">
            <CardTitle className="text-slate-900 dark:text-slate-100 text-xl">Observations</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">État global de votre espace professeur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 mb-2">Performances</p>
              <p className="text-slate-900 dark:text-slate-100 font-medium">
                {studentsSorted.length} élèves disposent d&apos;un accès actif à vos contenus.
              </p>
            </div>
            <Separator className="border-slate-200 dark:border-slate-800" />
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p>
                Dernière connexion :{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {userData?.lastLogin?.toDate ? userData.lastLogin.toDate().toLocaleDateString() : "—"}
                </span>
              </p>
              <p>
                Brouillons à finaliser : <span className="font-semibold text-orange-600 dark:text-orange-400">{contentStats.drafts}</span>
              </p>
              <p>
                Ressources publiées : <span className="font-semibold text-green-600 dark:text-green-400">{contentStats.published}</span>
              </p>
            </div>
            <div className="rounded-lg bg-blue-100/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 mt-4">
              <p className="text-xs text-slate-700 dark:text-slate-300">
                💡 <span className="font-medium">Astuce :</span> utilisez les onglets &quot;Cours&quot; et &quot;Quiz&quot; pour dupliquer vos meilleurs contenus
                plutôt que de repartir de zéro.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 -m-6 p-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-lg" />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-lg" />
      <div className="grid gap-6 lg:grid-cols-7">
        <Skeleton className="h-80 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-xl lg:col-span-4" />
        <Skeleton className="h-80 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-xl lg:col-span-3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-xl" />
        ))}
      </div>
    </div>
  )
}

function formatRelative(date?: Date) {
  if (!date) return "date inconnue"
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return "à l'instant"
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `il y a ${diffHours} h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `il y a ${diffDays} j`
  return date.toLocaleDateString()
}

function getInitials(name?: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
}
