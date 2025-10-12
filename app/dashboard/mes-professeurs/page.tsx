"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  PenTool,
  BrainCircuit,
  Youtube,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getStudentAccesses, type StudentAccess } from "@/lib/services/student-access-service"
import {
  getPublishedCoursesByTeacher,
  getPublishedExercisesByTeacher,
  getPublishedQuizzesByTeacher,
  getPublishedVideosByTeacher,
  type Course,
  type Exercise,
  type Quiz,
  type Video,
} from "@/lib/services/content-service"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"

export default function MesProfesseursPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [accesses, setAccesses] = useState<StudentAccess[]>([])
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchAccesses()
    }
  }, [user])

  useEffect(() => {
    if (selectedTeacherId) {
      fetchTeacherContent(selectedTeacherId)
    }
  }, [selectedTeacherId])

  const fetchAccesses = async () => {
    if (!user) return

    try {
      setLoading(true)
      const studentAccesses = await getStudentAccesses(user.uid)
      setAccesses(studentAccesses)
      
      // Sélectionner automatiquement le premier professeur
      if (studentAccesses.length > 0) {
        setSelectedTeacherId(studentAccesses[0].teacherId)
      }
    } catch (error) {
      console.error("Error fetching accesses:", error)
      toast.error("Erreur lors du chargement de vos professeurs")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacherContent = async (teacherId: string) => {
    try {
      setContentLoading(true)
      const [coursesData, exercisesData, quizzesData, videosData] = await Promise.all([
        getPublishedCoursesByTeacher(teacherId),
        getPublishedExercisesByTeacher(teacherId),
        getPublishedQuizzesByTeacher(teacherId),
        getPublishedVideosByTeacher(teacherId),
      ])

      setCourses(coursesData)
      setExercises(exercisesData)
      setQuizzes(quizzesData)
      setVideos(videosData)
    } catch (error) {
      console.error("Error fetching teacher content:", error)
      toast.error("Erreur lors du chargement du contenu")
    } finally {
      setContentLoading(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (accesses.length === 0) {
    return (
      <div className="container py-10">
        <motion.div className="text-center py-20" initial="hidden" animate="visible" variants={fadeIn}>
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Aucun professeur assigné</h2>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas encore d'accès au contenu d'un professeur.
            <br />
            Faites une demande d'encadrement pour commencer !
          </p>
          <Button asChild>
            <Link href="/encadrement">Faire une demande</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  const selectedAccess = accesses.find((a) => a.teacherId === selectedTeacherId)

  return (
    <div className="container py-10">
      <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Mes Professeurs</h1>
        <p className="text-muted-foreground">Accédez au contenu de vos professeurs</p>
      </motion.div>

      {/* Liste des professeurs */}
      <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Vos Professeurs</CardTitle>
            <CardDescription>Sélectionnez un professeur pour voir son contenu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accesses.map((access) => (
                <Card
                  key={access.id}
                  className={`cursor-pointer transition-all ${
                    selectedTeacherId === access.teacherId
                      ? "border-primary ring-2 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedTeacherId(access.teacherId)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{access.teacherName}</h3>
                        <p className="text-sm text-muted-foreground">{access.subject}</p>
                        <Badge className="mt-2" variant="outline">
                          {access.formule}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenu du professeur sélectionné */}
      {selectedAccess && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Contenu de {selectedAccess.teacherName}</CardTitle>
              <CardDescription>
                {selectedAccess.subject} - {selectedAccess.formule}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <Tabs defaultValue="cours">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="cours">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Cours ({courses.length})
                    </TabsTrigger>
                    <TabsTrigger value="exercices">
                      <PenTool className="h-4 w-4 mr-2" />
                      Exercices ({exercises.length})
                    </TabsTrigger>
                    <TabsTrigger value="quiz">
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Quiz ({quizzes.length})
                    </TabsTrigger>
                    <TabsTrigger value="videos">
                      <Youtube className="h-4 w-4 mr-2" />
                      Vidéos ({videos.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cours" className="mt-6">
                    {courses.length === 0 ? (
                      <div className="text-center py-10">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucun cours disponible pour le moment</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((course) => (
                          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant="secondary">{course.level}</Badge>
                                <Badge variant="outline">{course.subject}</Badge>
                              </div>
                            </div>
                            <CardContent className="pt-4">
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {course.description}
                              </p>
                              <Button className="w-full" asChild>
                                <Link href={`/cours/${course.id}`}>
                                  Commencer <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="exercices" className="mt-6">
                    {exercises.length === 0 ? (
                      <div className="text-center py-10">
                        <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucun exercice disponible pour le moment</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map((exercise) => (
                          <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6">
                              <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant="secondary">{exercise.level}</Badge>
                                <Badge
                                  variant={
                                    exercise.difficulty === "easy"
                                      ? "default"
                                      : exercise.difficulty === "medium"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {exercise.difficulty === "easy"
                                    ? "Facile"
                                    : exercise.difficulty === "medium"
                                    ? "Moyen"
                                    : "Difficile"}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="pt-4">
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {exercise.description}
                              </p>
                              <Button className="w-full" asChild>
                                <Link href={`/exercices/${exercise.id}`}>
                                  Commencer <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-6">
                    {quizzes.length === 0 ? (
                      <div className="text-center py-10">
                        <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucun quiz disponible pour le moment</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizzes.map((quiz) => (
                          <Card key={quiz.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6">
                              <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant="secondary">{quiz.level}</Badge>
                                <Badge variant="outline">{quiz.questions.length} questions</Badge>
                              </div>
                            </div>
                            <CardContent className="pt-4">
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {quiz.description}
                              </p>
                              <Button className="w-full" asChild>
                                <Link href={`/quiz/${quiz.id}`}>
                                  Commencer <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="videos" className="mt-6">
                    {videos.length === 0 ? (
                      <div className="text-center py-10">
                        <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucune vidéo disponible pour le moment</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {videos.map((video) => (
                          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-6">
                              <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant="secondary">{video.level}</Badge>
                                <Badge variant="outline">{video.duration} min</Badge>
                              </div>
                            </div>
                            <CardContent className="pt-4">
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {video.description}
                              </p>
                              <Button className="w-full" asChild>
                                <Link href={`/videos/${video.id}`}>
                                  Regarder <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
