"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  ArrowLeft,
  CheckCircle,
  Target,
  User,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getCourseById, type Course } from "@/lib/services/content-service"
import { hasAccessToTeacher } from "@/lib/services/student-access-service"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id as string)
    }
  }, [params.id])

  const fetchCourse = async (courseId: string) => {
    try {
      setLoading(true)
      const courseData = await getCourseById(courseId)
      
      if (!courseData) {
        toast.error("Cours introuvable")
        router.push("/cours")
        return
      }

      setCourse(courseData)

      // Vérifier l'accès si c'est un étudiant
      if (user && courseData.teacherId) {
        const access = await hasAccessToTeacher(user.uid, courseData.teacherId)
        setHasAccess(access)
      }
    } catch (error) {
      console.error("Error fetching course:", error)
      toast.error("Erreur lors du chargement du cours")
    } finally {
      setLoading(false)
    }
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

  if (!course) {
    return null
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="container py-10">
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge variant={course.status === "published" ? "default" : "secondary"}>
                    {course.status === "published" ? "Publié" : course.status === "draft" ? "Brouillon" : "Archivé"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Contenu</TabsTrigger>
                    <TabsTrigger value="objectives">Objectifs</TabsTrigger>
                    <TabsTrigger value="prerequisites">Prérequis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-6">
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.content }}
                    />
                  </TabsContent>

                  <TabsContent value="objectives" className="mt-6">
                    <div className="space-y-3">
                      {course.objectives.length > 0 ? (
                        course.objectives.map((objective, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <p>{objective}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Aucun objectif défini</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="prerequisites" className="mt-6">
                    <div className="space-y-3">
                      {course.prerequisites.length > 0 ? (
                        course.prerequisites.map((prerequisite, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                            <p>{prerequisite}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Aucun prérequis</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Professeur</p>
                    <p className="text-sm text-muted-foreground">{course.teacherName}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Durée</p>
                    <p className="text-sm text-muted-foreground">{course.duration} minutes</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Niveau</p>
                    <p className="text-sm text-muted-foreground">{course.level}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Matière</p>
                  <Badge variant="secondary">{course.subject}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Étudiants inscrits</span>
                  <span className="font-medium">{course.studentsEnrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Note moyenne</span>
                  <span className="font-medium">
                    {course.rating > 0 ? `${course.rating.toFixed(1)}/5` : "Non noté"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Évaluations</span>
                  <span className="font-medium">{course.totalRatings}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
