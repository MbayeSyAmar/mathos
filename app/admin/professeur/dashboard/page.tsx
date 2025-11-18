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
  { label: string; badgeClass: string; accent: string; icon: ComponentType<{ className?: string }> }
> = {
  course: {
    label: "Cours",
    badgeClass: "bg-primary/15 text-primary",
    accent: "from-primary/30 to-primary/5",
    icon: BookOpen,
  },
  exercise: {
    label: "Exercice",
    badgeClass: "bg-purple-500/15 text-purple-300",
    accent: "from-purple-500/30 to-purple-500/5",
    icon: FileStack,
  },
  quiz: {
    label: "Quiz",
    badgeClass: "bg-orange-500/15 text-orange-300",
    accent: "from-orange-500/30 to-orange-500/5",
    icon: Sparkles,
  },
  video: {
    label: "Vidéo",
    badgeClass: "bg-pink-500/15 text-pink-300",
    accent: "from-pink-500/30 to-pink-500/5",
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
    <div className="space-y-8">
      {errorMessage && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-full bg-red-500/20 p-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-red-200">Données incomplètes</CardTitle>
              <CardDescription className="text-red-100/70">{errorMessage}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              {refreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Cours actifs",
            value: contentStats.courses,
            subValue: `${courses.filter((c) => c.status === "published").length} publiés`,
            icon: BookOpen,
            gradient: "from-primary/30 to-primary/5",
          },
          {
            label: "Exercices",
            value: contentStats.exercises,
            subValue: `${exercises.filter((e) => e.status === "published").length} prêts`,
            icon: ClipboardList,
            gradient: "from-purple-500/25 to-purple-500/5",
          },
          {
            label: "Quiz",
            value: contentStats.quizzes,
            subValue: `${quizzes.filter((q) => q.status === "published").length} disponibles`,
            icon: Sparkles,
            gradient: "from-orange-500/25 to-orange-500/5",
          },
          {
            label: "Vidéos",
            value: contentStats.videos,
            subValue: `${videos.filter((v) => v.status === "published").length} publiées`,
            icon: Video,
            gradient: "from-pink-500/25 to-pink-500/5",
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={cn("overflow-hidden border-white/10 bg-white/5", `bg-gradient-to-br ${stat.gradient}`)}
            >
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                </div>
                <div className="rounded-2xl bg-black/20 p-3 text-white shadow-inner">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {contentStats.published} ressources publiées · {contentStats.drafts} brouillons à finaliser
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Actualiser les données
          </Button>
          <Button size="sm" asChild className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white">
            <Link href="/admin/professeur/cours">
              Ajouter un contenu
              <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Dernières ressources mises à jour ou publiées</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              Temps réel
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentContent.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
                Aucun contenu pour le moment. Publiez votre premier cours pour voir vos analytics ici.
              </div>
            ) : (
              recentContent.map((item) => {
                const meta = contentTypeMeta[item.type]
                const Icon = meta.icon
                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/5 p-2 text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">{item.title}</p>
                          <Badge className={cn("text-xs", meta.badgeClass)}>{meta.label}</Badge>
                          {item.status && (
                            <Badge variant="outline" className="border-white/20 text-xs text-muted-foreground">
                              {item.status === "published" ? "Publié" : item.status === "draft" ? "Brouillon" : item.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
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

        <Card className="lg:col-span-3 border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Élèves connectés</CardTitle>
            <CardDescription>Les accès actifs à vos contenus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentsSorted.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
                Aucun élève n&apos;a encore accès à vos cours.
              </div>
            ) : (
              studentsSorted.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={student.studentName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(student.studentName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-white">{student.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.formule} · {student.subject || "Mathématiques"} · {formatRelative(student.grantedAt?.toDate())}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                    Actif
                  </Badge>
                </div>
              ))
            )}
            {studentsSorted.length > 5 && (
              <Button asChild variant="ghost" className="w-full text-primary">
                <Link href="/admin/professeur/demandes">Voir tous les accès</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Qualité & statut</CardTitle>
            <CardDescription>Suivez vos contenus publiés vs brouillons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Cours", total: courses.length, published: courses.filter((c) => c.status === "published").length },
              {
                label: "Exercices",
                total: exercises.length,
                published: exercises.filter((c) => c.status === "published").length,
              },
              { label: "Quiz", total: quizzes.length, published: quizzes.filter((c) => c.status === "published").length },
              { label: "Vidéos", total: videos.length, published: videos.filter((c) => c.status === "published").length },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span>{row.label}</span>
                  <span className="text-muted-foreground">
                    {row.published}/{row.total}
                  </span>
                </div>
                <Progress value={row.total === 0 ? 0 : (row.published / row.total) * 100} className="mt-2 h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gagnez du temps sur vos tâches récurrentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Créer un nouveau cours",
                href: "/admin/professeur/cours",
                hint: "Gabarits prêts à l'emploi",
              },
              {
                label: "Ajouter un quiz adaptatif",
                href: "/admin/professeur/quiz",
                hint: "15 min pour le publier",
              },
              {
                label: "Uploader une vidéo premium",
                href: "/admin/professeur/videos",
                hint: "Support YouTube ou MP4",
              },
              {
                label: "Traiter les copies envoyées",
                href: "/admin/professeur/soumissions",
                hint: "Notifiez vos élèves",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div>
                  <p className="font-medium text-white">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.hint}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Observations</CardTitle>
            <CardDescription>État global de votre espace professeur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Performances</p>
              <p className="mt-1 text-white">
                {studentsSorted.length} élèves disposent d&apos;un accès actif à vos contenus.
              </p>
            </div>
            <Separator className="border-white/10" />
            <p>
              Dernière connexion :{" "}
              <span className="text-white">
                {userData?.lastLogin?.toDate ? userData.lastLogin.toDate().toLocaleDateString() : "—"}
              </span>
            </p>
            <p>
              Brouillons à finaliser : <span className="text-white">{contentStats.drafts}</span>
            </p>
            <p>
              Ressources publiées : <span className="text-white">{contentStats.published}</span>
            </p>
            <p>
              Astuce : utilisez les onglets &quot;Cours&quot; et &quot;Quiz&quot; pour dupliquer vos meilleurs contenus
              plutôt que de repartir de zéro.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl bg-white/5" />
        ))}
      </div>
      <Skeleton className="h-10 w-64 rounded-full bg-white/5" />
      <div className="grid gap-6 lg:grid-cols-7">
        <Skeleton className="h-80 rounded-3xl bg-white/5 lg:col-span-4" />
        <Skeleton className="h-80 rounded-3xl bg-white/5 lg:col-span-3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-3xl bg-white/5" />
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
