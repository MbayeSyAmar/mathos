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
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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
        getRecentActivities(user.uid, 10),
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "d MMM yyyy", { locale: fr })
  }

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
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
    <div className="container py-10">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre espace personnel, {userData?.displayName || user?.email?.split('@')[0] || "Étudiant"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mes-demandes">Mes Demandes</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mon-profil">Mon profil</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/encadrement">
              <MessageSquare className="h-4 w-4 mr-2" />
              Encadrement
              {unreadMessages > 0 && (
                <Badge className="ml-2 bg-red-500" variant="secondary">
                  {unreadMessages}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Progression globale</CardTitle>
              <CardDescription>Votre avancement dans tous les cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cours suivis</span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.completedCourses || 0}/{progress?.totalCourses || 0}
                    </span>
                  </div>
                  <Progress
                    value={
                      progress?.totalCourses
                        ? (progress.completedCourses / progress.totalCourses) * 100
                        : 0
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Exercices complétés</span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.completedExercises || 0}/{progress?.totalExercises || 0}
                    </span>
                  </div>
                  <Progress
                    value={
                      progress?.totalExercises
                        ? (progress.completedExercises / progress.totalExercises) * 100
                        : 0
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quiz réussis</span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.completedQuizzes || 0}/{progress?.totalQuizzes || 0}
                    </span>
                  </div>
                  <Progress
                    value={
                      progress?.totalQuizzes
                        ? (progress.completedQuizzes / progress.totalQuizzes) * 100
                        : 0
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Statistiques</CardTitle>
              <CardDescription>Vos performances récentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">
                    {Math.floor((progress?.totalStudyTimeMinutes || 0) / 60)}h
                  </span>
                  <span className="text-xs text-muted-foreground text-center">Temps d'étude total</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-2xl font-bold">{progress?.successRate || 0}%</span>
                  <span className="text-xs text-muted-foreground text-center">Taux de réussite</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                  <span className="text-2xl font-bold">{progress?.badges.length || 0}</span>
                  <span className="text-xs text-muted-foreground text-center">Badges obtenus</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold">{progress?.inProgressCourses || 0}</span>
                  <span className="text-xs text-muted-foreground text-center">Cours en cours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activités récentes</CardTitle>
              <CardDescription>Vos dernières actions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {activities.length === 0 ? (
                  <li className="text-sm text-muted-foreground text-center py-4">
                    Aucune activité récente
                  </li>
                ) : (
                  activities.slice(0, 3).map((activity) => (
                    <li key={activity.id} className="flex items-start gap-2">
                      <div className="min-w-4 mt-0.5">
                        {activity.type === "course_started" || activity.type === "course_completed" ? (
                          <BookOpen className="h-4 w-4 text-primary" />
                        ) : activity.type === "exercise_completed" ? (
                          <PenTool className="h-4 w-4 text-primary" />
                        ) : activity.type === "quiz_completed" ? (
                          <BrainCircuit className="h-4 w-4 text-primary" />
                        ) : (
                          <Target className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/progression">Voir toutes les activités</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Messages non lus */}
      {conversations.length > 0 && unreadMessages > 0 && (
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Nouveaux messages</CardTitle>
              </div>
              <CardDescription>Vous avez {unreadMessages} message(s) non lu(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations
                  .filter((conv) => conv.unreadCountStudent > 0)
                  .slice(0, 3)
                  .map((conv) => (
                    <div key={conv.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium">{conv.teacherName}</p>
                        <p className="text-sm text-muted-foreground">{conv.lastMessage}</p>
                      </div>
                      <Badge variant="secondary">{conv.unreadCountStudent}</Badge>
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

      <Tabs defaultValue="cours" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="cours">Mes cours</TabsTrigger>
          <TabsTrigger value="exercices">Mes exercices</TabsTrigger>
          <TabsTrigger value="quiz">Mes quiz</TabsTrigger>
          <TabsTrigger value="favoris">Mes favoris</TabsTrigger>
        </TabsList>

        <TabsContent value="cours" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun cours en cours</p>
                <Button className="mt-4" asChild>
                  <Link href="/cours">Découvrir les cours</Link>
                </Button>
              </div>
            ) : (
              courses.slice(0, 6).map((course) => (
                <motion.div key={course.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-bold text-foreground text-lg">{course.courseTitle}</h3>
                      </div>
                      <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
                        En cours
                      </div>
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Progression</span>
                            <span className="text-sm font-medium">{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {course.completedLessons}/{course.totalLessons} leçons
                          </span>
                          <span>Dernier accès: {formatDate(course.lastAccessedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
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
              <div className="col-span-full text-center py-10">
                <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun exercice commencé</p>
                <Button className="mt-4" asChild>
                  <Link href="/exercices">Découvrir les exercices</Link>
                </Button>
              </div>
            ) : (
              exercises.slice(0, 6).map((exercise) => (
                <motion.div key={exercise.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-40 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-bold text-foreground text-lg">{exercise.exerciseTitle}</h3>
                      </div>
                      {exercise.completed && (
                        <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Terminé
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Score:</span>
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
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
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
              <div className="col-span-full text-center py-10">
                <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun quiz tenté</p>
                <Button className="mt-4" asChild>
                  <Link href="/quiz">Découvrir les quiz</Link>
                </Button>
              </div>
            ) : (
              quizzes.slice(0, 6).map((quiz) => (
                <motion.div key={quiz.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-40 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-bold text-foreground text-lg">{quiz.quizTitle}</h3>
                      </div>
                      <div
                        className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${
                          quiz.bestScore >= 80
                            ? "bg-green-600 text-white"
                            : quiz.bestScore >= 60
                              ? "bg-yellow-600 text-white"
                              : "bg-red-600 text-white"
                        }`}
                      >
                        {quiz.bestScore}%
                      </div>
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Meilleur score</span>
                            <span className="text-sm font-medium">{quiz.bestScore}%</span>
                          </div>
                          <Progress
                            value={quiz.bestScore}
                            className={
                              quiz.bestScore >= 80
                                ? "[&>div]:bg-green-600"
                                : quiz.bestScore >= 60
                                  ? "[&>div]:bg-yellow-600"
                                  : "[&>div]:bg-red-600"
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Tentatives: {quiz.attempts}</span>
                          <span>{formatDate(quiz.lastAttemptAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
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
            {[
              {
                id: 1,
                title: "Les nombres complexes",
                description: "Vidéo explicative sur les nombres complexes",
                image: "/placeholder.svg?height=200&width=400",
                type: "video",
                icon: Youtube,
                date: "15 mars 2023",
              },
              {
                id: 2,
                title: "Préparation au Bac",
                description: "Article avec conseils pour réussir l'épreuve",
                image: "/placeholder.svg?height=200&width=400",
                type: "article",
                icon: BookText,
                date: "22 avril 2023",
              },
              {
                id: 3,
                title: "Intégration",
                description: "Cours complet sur le calcul intégral",
                image: "/placeholder.svg?height=200&width=400",
                type: "cours",
                icon: BookOpen,
                date: "10 mai 2023",
              },
            ].map((favorite) => {
              const Icon = favorite.icon
              return (
                <motion.div key={favorite.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-40">
                      <Image
                        src={favorite.image || "/placeholder.svg"}
                        alt={favorite.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-bold text-foreground text-lg">{favorite.title}</h3>
                      </div>
                      <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 rounded text-xs flex items-center">
                        <Icon className="h-3 w-3 mr-1" />
                        {favorite.type}
                      </div>
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <p className="text-sm text-muted-foreground">{favorite.description}</p>
                      <p className="mt-4 text-xs text-muted-foreground">Ajouté le {favorite.date}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        Consulter <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
