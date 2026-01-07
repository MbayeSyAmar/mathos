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
import { getStaticCourseById, type StaticCourse } from "@/lib/services/static-courses.service"
import { hasAccessToTeacher } from "@/lib/services/student-access-service"
import { getCourseContent } from "@/lib/services/content-enrichment.service"
import { getCourseById as getCourseFromPage, getCourseSummary, coursesData } from "@/app/cours/page"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | StaticCourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [enrichedContent, setEnrichedContent] = useState<string>("")
  const [hasPDF, setHasPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [isStaticCourse, setIsStaticCourse] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id as string)
    }
  }, [params.id])

  const fetchCourse = async (courseId: string) => {
    try {
      setLoading(true)
      
      // D'abord essayer de récupérer un cours Firestore
      const courseData = await getCourseById(courseId)
      
      if (courseData) {
        // Cours Firestore trouvé
        // Récupérer le résumé depuis les données de la page cours si disponible
        const numericId = parseInt(courseId)
        const summary = !isNaN(numericId) ? getCourseSummary(numericId) : undefined
        
        const courseWithSummary = {
          ...courseData,
          summary: summary || ('summary' in courseData ? courseData.summary : undefined),
        }
        
        setCourse(courseWithSummary)
        setIsStaticCourse(false)

        // Charger le contenu enrichi ou PDF
        if (!isNaN(numericId)) {
          // Déterminer le niveau (college/lycee) à partir de la classe
          const isLycee = ['2nde', '1ère', '1ere', 'Terminale', 'Term'].some(l => courseData.level.includes(l))
          const levelType = isLycee ? 'Lycée' : 'Collège'
          
          console.log('[CoursePage] Loading content with params:', {
            numericId,
            levelType,
            classe: courseData.level,
            isLycee
          })
          
          const content = await getCourseContent(numericId, levelType, courseData.level)
          
          console.log('[CoursePage] Content result:', content)
          
          setHasPDF(content.hasPDF)
          if (content.hasPDF && content.pdfUrl) {
            setPdfUrl(content.pdfUrl)
          } else if (content.content) {
            setEnrichedContent(content.content)
          }
        }

        // Vérifier l'accès si c'est un étudiant
        if (user && courseData.teacherId) {
          const access = await hasAccessToTeacher(user.uid, courseData.teacherId)
          setHasAccess(access)
        }
      } else {
        // Essayer de récupérer un cours depuis coursesData (source de vérité pour la page liste)
        const numericId = parseInt(courseId)
        if (!isNaN(numericId)) {
          const courseFromPage = getCourseFromPage(numericId)
          if (courseFromPage) {
            // Déterminer la classe depuis coursesData
            let classe: string = "6ème"
            for (const [key, courses] of Object.entries(coursesData)) {
              if (courses.some(c => c.id === numericId)) {
                classe = key
                break
              }
            }

            // Adapter le cours depuis coursesData au format Course (prioritaire pour cohérence titre/contenu)
            const isLycee = ['2nde', '1ère', '1ere', 'Terminale', 'Term'].some(l => 
              classe.includes(l)
            )
            const levelType = isLycee ? 'Lycée' : 'Collège'

            const adaptedCourse: any = {
              id: courseId,
              title: courseFromPage.title,
              description: courseFromPage.description,
              level: levelType,
              classe: classe,
              subject: "Mathématiques",
              duration: courseFromPage.duration,
              image: courseFromPage.image,
              teacherId: "",
              teacherName: "Équipe Mathosphère",
              content: courseFromPage.content || "",
              status: "published",
              studentsEnrolled: 0,
              rating: 0,
              totalRatings: 0,
              summary: courseFromPage.summary,
              objectives: courseFromPage.objectives || [],
              prerequisites: courseFromPage.prerequisites || [],
            }
            setCourse(adaptedCourse)
            setIsStaticCourse(true)

            // Charger le contenu enrichi ou PDF
            const content = await getCourseContent(numericId, levelType, classe)
            setHasPDF(content.hasPDF)
            if (content.hasPDF && content.pdfUrl) {
              setPdfUrl(content.pdfUrl)
            } else if (content.content) {
              setEnrichedContent(content.content)
            } else if (courseFromPage.content) {
              setEnrichedContent(courseFromPage.content)
            }
            return
          }

          // Sinon, fallback sur le service des cours statiques
          let staticCourse = getStaticCourseById(numericId)
          if (staticCourse) {
            // Récupérer le résumé depuis les données de la page cours
            const summary = getCourseSummary(numericId)
            
            // Cours statique trouvé - adapter au format Course
            const adaptedCourse: any = {
              ...staticCourse,
              id: courseId,
              teacherId: "",
              teacherName: "Équipe Mathosphère",
              content: "",
              status: "published",
              studentsEnrolled: 0,
              rating: 0,
              totalRatings: 0,
              summary: summary,
            }
            setCourse(adaptedCourse)
            setIsStaticCourse(true)
            
            // Charger le contenu enrichi ou PDF avec level et classe du cours statique
            // Déterminer le niveau (college/lycee) à partir de la classe
            const isLycee = ['2nde', '1ère', '1ere', 'Terminale', 'Term'].some(l => staticCourse.level.includes(l))
            const levelType = isLycee ? 'Lycée' : 'Collège'
            
            console.log('[CoursePage - Static] Loading content with params:', {
              numericId,
              levelType,
              classe: staticCourse.level,
              isLycee
            })
            
            const content = await getCourseContent(numericId, levelType, staticCourse.level)
            
            console.log('[CoursePage - Static] Content result:', content)
            
            setHasPDF(content.hasPDF)
            if (content.hasPDF && content.pdfUrl) {
              setPdfUrl(content.pdfUrl)
            } else if (content.content) {
              setEnrichedContent(content.content)
            }
          } else {
            // Aucun cours trouvé
            toast.error("Cours introuvable")
            router.push("/cours")
            return
          }
        } else {
          toast.error("Cours introuvable")
          router.push("/cours")
          return
        }
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
                  {!isStaticCourse && 'status' in course && (
                    <Badge variant={course.status === "published" ? "default" : "secondary"}>
                      {course.status === "published" ? "Publié" : course.status === "draft" ? "Brouillon" : "Archivé"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="summary">Résumé</TabsTrigger>
                    <TabsTrigger value="content">Contenu</TabsTrigger>
                    <TabsTrigger value="objectives">Objectifs</TabsTrigger>
                    <TabsTrigger value="prerequisites">Prérequis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-6">
                    {('summary' in course && course.summary) ? (
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
                          <h3 className="text-lg font-semibold mb-2 text-primary">Concepts fondamentaux</h3>
                          <p className="text-muted-foreground leading-relaxed">{course.summary}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 border-l-4 border-muted-foreground p-4 rounded-r-lg">
                        <p className="text-muted-foreground italic">Résumé en cours de préparation...</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="content" className="mt-6">
                    {hasPDF ? (
                      // Afficher le PDF dans un iframe
                      <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                        <iframe
                          src={pdfUrl}
                          className="w-full h-full"
                          title="Contenu du cours PDF"
                        />
                      </div>
                    ) : enrichedContent ? (
                      // Afficher le contenu enrichi HTML
                      <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: enrichedContent }}
                      />
                    ) : 'content' in course && course.content ? (
                      // Afficher le contenu original du cours
                      <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: course.content }}
                      />
                    ) : (
                      <div className="bg-muted/50 border-l-4 border-muted-foreground p-4 rounded-r-lg">
                        <p className="text-muted-foreground italic">Contenu en cours de préparation...</p>
                      </div>
                    )}
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
                    <p className="text-sm text-muted-foreground">
                      {'teacherName' in course ? course.teacherName : 'Équipe Mathosphère'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Durée</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof course.duration === 'string' ? course.duration : `${course.duration} minutes`}
                    </p>
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

            {!isStaticCourse && 'studentsEnrolled' in course && (
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
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
