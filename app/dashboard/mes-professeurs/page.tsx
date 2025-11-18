"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  GraduationCap,
  Mail,
  MessageSquare,
  Sparkles,
  Star,
  Award,
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
import { BackButton } from "@/components/back-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { getCourseImage, getExerciseImage, getQuizImage } from "@/lib/utils/course-images"

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
          <p className="text-muted-foreground">Chargement de vos professeurs...</p>
        </div>
      </div>
    )
  }

  if (accesses.length === 0) {
    return (
      <div className="container py-10">
        <motion.div className="text-center py-20" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="relative mb-6">
            <AlertCircle className="h-20 w-20 mx-auto text-muted-foreground" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Aucun professeur assigné
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Vous n'avez pas encore d'accès au contenu d'un professeur.
            Faites une demande d'encadrement pour commencer votre apprentissage personnalisé !
          </p>
          <Button size="lg" asChild>
            <Link href="/encadrement">
              <GraduationCap className="h-4 w-4 mr-2" />
              Faire une demande d'encadrement
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  const selectedAccess = accesses.find((a) => a.teacherId === selectedTeacherId)

  return (
    <div className="container py-6 md:py-10 space-y-8">
      <div className="mb-6">
        <BackButton href="/dashboard" label="Retour au dashboard" />
      </div>

      <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Mes Professeurs
        </h1>
        <p className="text-muted-foreground">Accédez au contenu exclusif de vos professeurs</p>
      </motion.div>

      {/* Liste des professeurs */}
      <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Vos Professeurs
            </CardTitle>
            <CardDescription>Sélectionnez un professeur pour voir son contenu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accesses.map((access) => (
                <motion.div
                  key={access.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all h-full ${
                      selectedTeacherId === access.teacherId
                        ? "border-primary ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-purple-500/5"
                        : "hover:border-primary/50 hover:shadow-md"
                    }`}
                    onClick={() => setSelectedTeacherId(access.teacherId)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border-2 border-primary/20">
                          <AvatarImage src="" alt={access.teacherName} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-lg">
                            {access.teacherName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">{access.teacherName}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{access.subject}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {access.formule}
                            </Badge>
                            {access.status === "active" && (
                              <Badge className="bg-green-500 text-white">
                                <Star className="h-3 w-3 mr-1" />
                                Actif
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenu du professeur sélectionné */}
      {selectedAccess && (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src="" alt={selectedAccess.teacherName} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                        {selectedAccess.teacherName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    Contenu de {selectedAccess.teacherName}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-4">
                    <Badge variant="outline">{selectedAccess.subject}</Badge>
                    <Badge variant="secondary">{selectedAccess.formule}</Badge>
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/encadrement?teacherId=${selectedAccess.teacherId}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {contentLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Chargement du contenu...</p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="cours">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="cours" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Cours
                      <Badge variant="secondary" className="ml-1">
                        {courses.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="exercices" className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Exercices
                      <Badge variant="secondary" className="ml-1">
                        {exercises.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      Quiz
                      <Badge variant="secondary" className="ml-1">
                        {quizzes.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      Vidéos
                      <Badge variant="secondary" className="ml-1">
                        {videos.length}
                      </Badge>
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
                          <p className="text-lg font-medium mb-2">Aucun cours disponible</p>
                          <p className="text-muted-foreground">Ce professeur n'a pas encore publié de cours</p>
                        </div>
                      ) : (
                        courses.map((course) => (
                          <motion.div key={course.id} variants={fadeIn}>
                            <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-all">
                              <div className="relative h-48 overflow-hidden">
                                <Image
                                  src={getCourseImage(course.subject, course.level)}
                                  alt={course.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="font-bold text-lg mb-2 drop-shadow-lg">{course.title}</h3>
                                  <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary" className="backdrop-blur-sm bg-primary/90 text-primary-foreground">{course.level}</Badge>
                                    <Badge variant="outline" className="backdrop-blur-sm bg-background/80">{course.subject}</Badge>
                                  </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                  <Award className="h-6 w-6 text-primary drop-shadow-lg" />
                                </div>
                              </div>
                              <CardContent className="pt-4 flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                  {course.description}
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button className="w-full group-hover:bg-primary/90" asChild>
                                  <Link href={`/cours/${course.id}`}>
                                    Commencer <ArrowRight className="h-4 w-4 ml-2" />
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
                          <p className="text-lg font-medium mb-2">Aucun exercice disponible</p>
                          <p className="text-muted-foreground">Ce professeur n'a pas encore publié d'exercices</p>
                        </div>
                      ) : (
                        exercises.map((exercise) => (
                          <motion.div key={exercise.id} variants={fadeIn}>
                            <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-all">
                              <div className="relative h-48 overflow-hidden">
                                <Image
                                  src={getExerciseImage(exercise.difficulty, exercise.subject)}
                                  alt={exercise.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="font-bold text-lg mb-2 drop-shadow-lg">{exercise.title}</h3>
                                  <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary" className="backdrop-blur-sm bg-blue-500/90 text-white">{exercise.level}</Badge>
                                    <Badge
                                      variant={
                                        exercise.difficulty === "easy"
                                          ? "default"
                                          : exercise.difficulty === "medium"
                                          ? "secondary"
                                          : "destructive"
                                      }
                                      className="backdrop-blur-sm"
                                    >
                                      {exercise.difficulty === "easy"
                                        ? "Facile"
                                        : exercise.difficulty === "medium"
                                        ? "Moyen"
                                        : "Difficile"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <CardContent className="pt-4 flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                  {exercise.description}
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button className="w-full group-hover:bg-blue-600" asChild>
                                  <Link href={`/exercices/${exercise.id}`}>
                                    Commencer <ArrowRight className="h-4 w-4 ml-2" />
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
                          <p className="text-lg font-medium mb-2">Aucun quiz disponible</p>
                          <p className="text-muted-foreground">Ce professeur n'a pas encore publié de quiz</p>
                        </div>
                      ) : (
                        quizzes.map((quiz) => (
                          <motion.div key={quiz.id} variants={fadeIn}>
                            <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-all">
                              <div className="relative h-48 overflow-hidden">
                                <Image
                                  src={getQuizImage(quiz.level)}
                                  alt={quiz.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="font-bold text-lg mb-2 drop-shadow-lg">{quiz.title}</h3>
                                  <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary" className="backdrop-blur-sm bg-purple-500/90 text-white">{quiz.level}</Badge>
                                    <Badge variant="outline" className="backdrop-blur-sm bg-background/80">{quiz.questions.length} questions</Badge>
                                  </div>
                                </div>
                              </div>
                              <CardContent className="pt-4 flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                  {quiz.description}
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button className="w-full group-hover:bg-purple-600" asChild>
                                  <Link href={`/quiz/${quiz.id}`}>
                                    Commencer <ArrowRight className="h-4 w-4 ml-2" />
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
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {videos.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                          <Youtube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Aucune vidéo disponible</p>
                          <p className="text-muted-foreground">Ce professeur n'a pas encore publié de vidéos</p>
                        </div>
                      ) : (
                        videos.map((video) => (
                          <motion.div key={video.id} variants={fadeIn}>
                            <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-all">
                              <div className="relative h-48 overflow-hidden">
                                <Image
                                  src={video.thumbnailUrl || "https://images.unsplash.com/photo-1509228468512-041e0a46034b?w=800&h=600&fit=crop"}
                                  alt={video.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="font-bold text-lg mb-2 drop-shadow-lg">{video.title}</h3>
                                  <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary" className="backdrop-blur-sm bg-red-500/90 text-white">{video.level}</Badge>
                                    <Badge variant="outline" className="backdrop-blur-sm bg-background/80">{video.duration} min</Badge>
                                  </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                  <Youtube className="h-8 w-8 text-red-500 drop-shadow-lg" />
                                </div>
                              </div>
                              <CardContent className="pt-4 flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                  {video.description}
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button className="w-full group-hover:bg-red-600" asChild>
                                  <Link href={`/videos/${video.id}`}>
                                    Regarder <ArrowRight className="h-4 w-4 ml-2" />
                                  </Link>
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
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
