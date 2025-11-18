"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { app } from "@/lib/firebase-init"
import { 
  Loader2, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Video, 
  TrendingUp,
  Award,
  Target,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
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
import { format, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import Image from "next/image"
import { getCourseImage, getExerciseImage, getQuizImage } from "@/lib/utils/course-images"

export default function ProgressionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [exercises, setExercises] = useState<ExerciseProgress[]>([])
  const [quizzes, setQuizzes] = useState<QuizProgress[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchProgressData()
    }
  }, [user])

  const fetchProgressData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const [progressData, coursesData, exercisesData, quizzesData, activitiesData] = await Promise.all([
        getStudentProgress(user.uid),
        getCourseProgress(user.uid),
        getExerciseProgress(user.uid),
        getQuizProgress(user.uid),
        getRecentActivities(user.uid, 50),
      ])

      setProgress(progressData)
      setCourses(coursesData)
      setExercises(exercisesData)
      setQuizzes(quizzesData)
      setActivities(activitiesData)

      // Générer les données hebdomadaires
      generateWeeklyData(activitiesData)
    } catch (error) {
      console.error("Erreur lors de la récupération des données de progression:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyData = (activities: Activity[]) => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        day: format(date, "EEE", { locale: fr }),
        date: format(date, "d MMM", { locale: fr }),
        courses: 0,
        exercises: 0,
        quizzes: 0,
        total: 0,
      }
    })

    activities.forEach((activity) => {
      const activityDate = activity.createdAt?.toDate ? activity.createdAt.toDate() : new Date(activity.createdAt)
      const dayIndex = Math.floor((Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dayIndex >= 0 && dayIndex < 7) {
        if (activity.type === "course_started" || activity.type === "course_completed") {
          days[6 - dayIndex].courses++
          days[6 - dayIndex].total++
        } else if (activity.type === "exercise_completed") {
          days[6 - dayIndex].exercises++
          days[6 - dayIndex].total++
        } else if (activity.type === "quiz_completed") {
          days[6 - dayIndex].quizzes++
          days[6 - dayIndex].total++
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

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de votre progression...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-10 space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Suivi de progression
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualisez votre parcours d'apprentissage et vos accomplissements
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Retour au dashboard</Link>
        </Button>
      </motion.div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Cours complétés</CardTitle>
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{progress?.completedCourses || 0}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>sur {progress?.totalCourses || 0} cours</span>
                {progress?.totalCourses ? (
                  <Progress
                    value={((progress.completedCourses || 0) / progress.totalCourses) * 100}
                    className="h-2 flex-1"
                  />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Exercices résolus</CardTitle>
                <FileText className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{progress?.completedExercises || 0}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>sur {progress?.totalExercises || 0} exercices</span>
                {progress?.totalExercises ? (
                  <Progress
                    value={((progress.completedExercises || 0) / progress.totalExercises) * 100}
                    className="h-2 flex-1"
                  />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Score moyen quiz</CardTitle>
                <HelpCircle className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{Math.round(progress?.averageQuizScore || 0)}%</div>
              <Progress value={progress?.averageQuizScore || 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {progress?.completedQuizzes || 0} quiz complétés
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Vidéos visionnées</CardTitle>
                <Video className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{progress?.watchedVideos || 0}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>sur {progress?.totalVideos || 0} vidéos</span>
                {progress?.totalVideos ? (
                  <Progress
                    value={((progress.watchedVideos || 0) / progress.totalVideos) * 100}
                    className="h-2 flex-1"
                  />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphique de progression */}
      {weeklyData.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Activité de la semaine
                  </CardTitle>
                  <CardDescription>Votre progression sur les 7 derniers jours</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabs pour cours, exercices, quiz, vidéos */}
      <Tabs defaultValue="cours" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cours" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Cours ({courses.length})
          </TabsTrigger>
          <TabsTrigger value="exercices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exercices ({exercises.length})
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Quiz ({quizzes.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vidéos
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
              courses.map((course) => (
                <motion.div key={course.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-40 overflow-hidden">
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
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
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
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Aucun exercice commencé</p>
                <p className="text-muted-foreground mb-6">Entraînez-vous avec nos exercices</p>
                <Button asChild>
                  <Link href="/exercices">Découvrir les exercices</Link>
                </Button>
              </div>
            ) : (
              exercises.map((exercise) => (
                <motion.div key={exercise.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-40 overflow-hidden">
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
                            <CheckCircle2 className="h-3 w-3 mr-1" />
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
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Aucun quiz tenté</p>
                <p className="text-muted-foreground mb-6">Testez vos connaissances</p>
                <Button asChild>
                  <Link href="/quiz">Découvrir les quiz</Link>
                </Button>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <motion.div key={quiz.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-40 overflow-hidden">
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
                        <Award
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

        <TabsContent value="videos" className="mt-6">
          <div className="text-center py-16">
            <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Fonctionnalité à venir</p>
            <p className="text-muted-foreground mb-6">Le suivi des vidéos sera bientôt disponible</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
