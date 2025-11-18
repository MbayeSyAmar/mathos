"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  PenTool,
  BrainCircuit,
  BookText,
  Youtube,
  ArrowRight,
  Clock,
  CheckCircle,
  Trophy,
  MessageSquare,
  Loader2,
  TrendingUp,
  Target,
  Star,
  Award,
  Calendar,
  Zap,
  Flame,
  BarChart3,
  Sparkles,
  Heart,
  Eye,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  getStudentProgress,
  getCourseProgress,
  getExerciseProgress,
  getQuizProgress,
  getRecentActivities,
  type StudentProgress,
  type CourseProgress,
  type ExerciseProgress,
  type QuizProgress,
  type Activity,
} from "@/lib/services/student-progress-service"
import {
  getStudentConversations,
  getUnreadMessageCount,
  type Conversation,
} from "@/lib/services/messaging-service"
import { getUserBadges, getAvailableBadges, type Badge as BadgeType } from "@/lib/services/badges-service"
import { format, subDays, startOfWeek } from "date-fns"
import { fr } from "date-fns/locale"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { getUserFavorites, type Favorite } from "@/lib/services/favorites-service"
import { toast } from "sonner"
import { getCourseImage, getExerciseImage, getQuizImage } from "@/lib/utils/course-images"

export default function DashboardPage() {
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [exercises, setExercises] = useState<ExerciseProgress[]>([])
  const [quizzes, setQuizzes] = useState<QuizProgress[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const [
        progressData,
        coursesData,
        exercisesData,
        quizzesData,
        activitiesData,
        conversationsData,
        unreadCount,
      ] = await Promise.all([
        getStudentProgress(user.uid),
        getCourseProgress(user.uid),
        getExerciseProgress(user.uid),
        getQuizProgress(user.uid),
        getRecentActivities(user.uid, 20),
        getStudentConversations(user.uid),
        getUnreadMessageCount(user.uid, "student"),
      ])

      setProgress(progressData)
      setCourses(coursesData)
      setExercises(exercisesData)
      setQuizzes(quizzesData)
      setActivities(activitiesData)
      setConversations(conversationsData)
      setUnreadMessages(unreadCount)

      // Charger les badges
      if (progressData?.badges) {
        const userBadges = getUserBadges(progressData.badges)
        setBadges(userBadges)
      }

      // Charger les favoris
      await loadFavorites()

      // Générer les données hebdomadaires
      generateWeeklyData(activitiesData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async () => {
    if (!user) return
    try {
      const favs = await getUserFavorites(user.uid, 20)
      setFavorites(favs)
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const generateWeeklyData = (activities: Activity[]) => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        day: format(date, "EEE", { locale: fr }),
        date: format(date, "d MMM", { locale: fr }),
        courses: 0,
        exercises: 0,
        quizzes: 0,
      }
    })

    activities.forEach((activity) => {
      const activityDate = activity.createdAt?.toDate ? activity.createdAt.toDate() : new Date(activity.createdAt)
      const dayIndex = Math.floor((activityDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dayIndex >= 0 && dayIndex < 7) {
        if (activity.type === "course_started" || activity.type === "course_completed") {
          days[dayIndex].courses++
        } else if (activity.type === "exercise_completed") {
          days[dayIndex].exercises++
        } else if (activity.type === "quiz_completed") {
          days[dayIndex].quizzes++
        }
      }
    })

    setWeeklyData(days)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "d MMM yyyy", { locale: fr })
  }

  const getXPForNextLevel = (level: number) => {
    return level * 1000
  }

  const progressPercentage = progress
    ? (progress.xp / getXPForNextLevel(progress.level)) * 100
    : 0

  const performanceData = [
    { name: "Cours", value: progress?.completedCourses || 0, color: "#3b82f6" },
    { name: "Exercices", value: progress?.completedExercises || 0, color: "#10b981" },
    { name: "Quiz", value: progress?.completedQuizzes || 0, color: "#8b5cf6" },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    )
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container py-6 md:py-10 space-y-8">
      {/* Header avec niveau et XP */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, <span className="font-semibold text-foreground">{userData?.displayName || user?.email?.split('@')[0] || "Étudiant"}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mes-professeurs">Mes Professeurs</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mes-demandes">Mes Demandes</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mon-profil">Mon profil</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/encadrement" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Encadrement
              {unreadMessages > 0 && (
                <Badge className="ml-1 bg-red-500 text-white" variant="secondary">
                  {unreadMessages}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Niveau et XP */}
      {progress && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {progress.level}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                      <Trophy className="h-4 w-4 text-yellow-900" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Niveau {progress.level}</h3>
                    <p className="text-sm text-muted-foreground">
                      {progress.xp} / {getXPForNextLevel(progress.level)} XP
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Taux de réussite</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{progress.successRate || 0}%</div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {Math.floor((progress.totalStudyTimeMinutes || 0) / 60)}h étudiées
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{badges.length} badges</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Flame className="h-3 w-3 mr-1" />
                  {progress.weeklyStudyTimeMinutes || 0} min cette semaine
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Cours</CardTitle>
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress?.completedCourses || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress?.inProgressCourses || 0} en cours
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Exercices</CardTitle>
                <PenTool className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress?.completedExercises || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress?.totalExercises || 0} au total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Quiz</CardTitle>
                <BrainCircuit className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress?.completedQuizzes || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Moyenne: {Math.round(progress?.averageQuizScore || 0)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Temps d'étude</CardTitle>
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor((progress?.totalStudyTimeMinutes || 0) / 60)}h
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(progress?.totalStudyTimeMinutes || 0) % 60} min
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphiques et progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de progression hebdomadaire */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activité de la semaine</CardTitle>
                  <CardDescription>Votre progression sur les 7 derniers jours</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExercises" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="courses"
                    stackId="1"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorCourses)"
                  />
                  <Area
                    type="monotone"
                    dataKey="exercises"
                    stackId="1"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorExercises)"
                  />
                  <Area
                    type="monotone"
                    dataKey="quizzes"
                    stackId="1"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorQuizzes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Répartition des activités */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Répartition des activités</CardTitle>
                  <CardDescription>Vos accomplissements par catégorie</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Vos badges
                  </CardTitle>
                  <CardDescription>Vos accomplissements et récompenses</CardDescription>
                </div>
                <Badge variant="secondary">{badges.length} débloqués</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.slice(0, 12).map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <p className="text-xs font-medium text-center">{badge.title}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Messages non lus */}
      {conversations.length > 0 && unreadMessages > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Nouveaux messages</CardTitle>
                <Badge className="bg-orange-500 text-white">{unreadMessages}</Badge>
              </div>
              <CardDescription>Vous avez {unreadMessages} message(s) non lu(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations
                  .filter((conv) => conv.unreadCountStudent > 0)
                  .slice(0, 3)
                  .map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                    >
                      <div>
                        <p className="font-medium">{conv.teacherName}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
                      </div>
                      <Badge variant="secondary" className="bg-orange-500 text-white">
                        {conv.unreadCountStudent}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/dashboard/encadrement">Voir tous les messages</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {/* Tabs pour cours, exercices, quiz, favoris */}
      <Tabs defaultValue="cours" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="cours" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Mes cours
          </TabsTrigger>
          <TabsTrigger value="exercices" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Mes exercices
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            Mes quiz
          </TabsTrigger>
          <TabsTrigger value="favoris" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Mes favoris
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cours" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Aucun cours en cours</p>
                <p className="text-muted-foreground mb-6">Commencez votre parcours d'apprentissage</p>
                <Button asChild>
                  <Link href="/cours">Découvrir les cours</Link>
                </Button>
              </div>
            ) : (
              courses.slice(0, 6).map((course) => (
                <motion.div key={course.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={getCourseImage((course as any).subject, (course as any).level)}
                        alt={course.courseTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-foreground text-lg mb-1 drop-shadow-lg">{course.courseTitle}</h3>
                        <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                          En cours
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          {Math.round(course.progress)}%
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {course.completedLessons}/{course.totalLessons} leçons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(course.lastAccessedAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        asChild
                      >
                        <Link href={`/cours/${course.courseId}`}>
                          Continuer <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="exercices" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {exercises.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <PenTool className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Aucun exercice commencé</p>
                <p className="text-muted-foreground mb-6">Entraînez-vous avec nos exercices</p>
                <Button asChild>
                  <Link href="/exercices">Découvrir les exercices</Link>
                </Button>
              </div>
            ) : (
              exercises.slice(0, 6).map((exercise) => (
                <motion.div key={exercise.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={getExerciseImage((exercise as any).difficulty, (exercise as any).subject)}
                        alt={exercise.exerciseTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-foreground text-lg mb-1 drop-shadow-lg">{exercise.exerciseTitle}</h3>
                        {exercise.completed && (
                          <Badge className="bg-green-600 text-white backdrop-blur-sm">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Terminé
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          {exercise.score || 0}%
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Score</span>
                          <span className="font-medium">{exercise.score || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Tentatives: {exercise.attempts}</span>
                          <span>{formatDate(exercise.lastAttemptAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                        asChild
                      >
                        <Link href={`/exercices/${exercise.exerciseId}`}>
                          {exercise.completed ? "Refaire" : "Continuer"}{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {quizzes.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <BrainCircuit className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Aucun quiz tenté</p>
                <p className="text-muted-foreground mb-6">Testez vos connaissances</p>
                <Button asChild>
                  <Link href="/quiz">Découvrir les quiz</Link>
                </Button>
              </div>
            ) : (
              quizzes.slice(0, 6).map((quiz) => (
                <motion.div key={quiz.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={getQuizImage((quiz as any).level)}
                        alt={quiz.quizTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-foreground text-lg mb-1 drop-shadow-lg">{quiz.quizTitle}</h3>
                        <Badge
                          className={`${
                            quiz.bestScore >= 80
                              ? "bg-green-600 text-white"
                              : quiz.bestScore >= 60
                                ? "bg-yellow-600 text-white"
                                : "bg-red-600 text-white"
                          } backdrop-blur-sm`}
                        >
                          {quiz.bestScore}%
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Trophy
                          className={`h-6 w-6 drop-shadow-lg ${
                            quiz.bestScore >= 80
                              ? "text-yellow-500"
                              : quiz.bestScore >= 60
                                ? "text-gray-400"
                                : "text-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Meilleur score</span>
                          <span className="font-medium">{quiz.bestScore}%</span>
                        </div>
                        <Progress
                          value={quiz.bestScore}
                          className={`h-2 ${
                            quiz.bestScore >= 80
                              ? "[&>div]:bg-green-600"
                              : quiz.bestScore >= 60
                                ? "[&>div]:bg-yellow-600"
                                : "[&>div]:bg-red-600"
                          }`}
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Tentatives: {quiz.attempts}</span>
                          <span>{formatDate(quiz.lastAttemptAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors"
                        asChild
                      >
                        <Link href={`/quiz/${quiz.quizId}`}>
                          Refaire le quiz <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="favoris" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {favorites.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Aucun favori</p>
                <p className="text-muted-foreground mb-6">Ajoutez du contenu à vos favoris pour y accéder rapidement</p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/cours">Explorer les cours</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/exercices">Explorer les exercices</Link>
                  </Button>
                </div>
              </div>
            ) : (
              favorites.map((favorite) => {
                const getIcon = () => {
                  switch (favorite.type) {
                    case "course":
                      return BookOpen
                    case "exercise":
                      return PenTool
                    case "quiz":
                      return BrainCircuit
                    case "video":
                      return Youtube
                    case "article":
                      return BookText
                    default:
                      return Star
                  }
                }
                const Icon = getIcon()
                return (
                  <motion.div key={favorite.id} variants={fadeIn}>
                    <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-rose-500/10">
                        {favorite.imageUrl ? (
                          <Image
                            src={favorite.imageUrl}
                            alt={favorite.title}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-bold text-foreground text-lg mb-1">{favorite.title}</h3>
                          <Badge variant="secondary" className="bg-pink-500/10 text-pink-600">
                            <Icon className="h-3 w-3 mr-1" />
                            {favorite.type}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                        </div>
                      </div>
                      <CardContent className="pt-4 flex-grow">
                        {favorite.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {favorite.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Ajouté le {formatDate(favorite.addedAt)}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-pink-600 group-hover:text-white transition-colors"
                          asChild
                        >
                          <Link href={`/${favorite.type === "course" ? "cours" : favorite.type === "exercise" ? "exercices" : favorite.type === "quiz" ? "quiz" : favorite.type === "video" ? "videos" : "blog"}/${favorite.itemId}`}>
                            Consulter <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Activités récentes */}
      {activities.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Activités récentes
                  </CardTitle>
                  <CardDescription>Vos dernières actions sur la plateforme</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/progression">Voir tout</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-8 mt-0.5">
                      {activity.type === "course_started" || activity.type === "course_completed" ? (
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </div>
                      ) : activity.type === "exercise_completed" ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <PenTool className="h-4 w-4 text-green-500" />
                        </div>
                      ) : activity.type === "quiz_completed" ? (
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <BrainCircuit className="h-4 w-4 text-purple-500" />
                        </div>
                      ) : activity.type === "badge_earned" ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center">
                          <Target className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
