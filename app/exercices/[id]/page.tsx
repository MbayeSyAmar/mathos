"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  PenTool,
  Clock,
  ArrowLeft,
  User,
  Loader2,
  Lightbulb,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getExerciseById, type Exercise } from "@/lib/services/content-service"
import { hasAccessToTeacher } from "@/lib/services/student-access-service"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc as firestoreDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BackButton } from "@/components/back-button"

export default function ExerciseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [hasAccess, setHasAccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    feedback: string | null
    score: number | null
    status: string
  } | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchExercise(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (user && params.id) {
      checkExistingSubmission(user.uid, params.id as string)
    }
  }, [user, params.id])

  const fetchExercise = async (exerciseId: string) => {
    try {
      setLoading(true)
      const exerciseData = await getExerciseById(exerciseId)
      
      if (!exerciseData) {
        toast.error("Exercice introuvable")
        router.push("/exercices")
        return
      }

      setExercise(exerciseData)

      // Vérifier l'accès si c'est un étudiant
      if (user && exerciseData.teacherId) {
        const access = await hasAccessToTeacher(user.uid, exerciseData.teacherId)
        setHasAccess(access)
      }
    } catch (error) {
      console.error("Error fetching exercise:", error)
      toast.error("Erreur lors du chargement de l'exercice")
    } finally {
      setLoading(false)
    }
  }

  const checkExistingSubmission = async (userId: string, exerciseId: string) => {
    try {
      const submissionsRef = collection(db, "exercise_submissions")
      const q = query(
        submissionsRef,
        where("userId", "==", userId),
        where("exerciseId", "==", exerciseId)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const submissionData = querySnapshot.docs[0].data()
        setUserAnswer(submissionData.answer || "")
        setHasSubmitted(true)
        
        // Charger le feedback si disponible
        if (submissionData.status === "reviewed") {
          setSubmissionFeedback({
            feedback: submissionData.feedback,
            score: submissionData.score,
            status: submissionData.status,
          })
        }
      }
    } catch (error) {
      console.error("Error checking submission:", error)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour soumettre une réponse")
      return
    }

    if (!userAnswer.trim()) {
      toast.error("Veuillez écrire une réponse avant de soumettre")
      return
    }

    if (!exercise) {
      toast.error("Erreur: exercice introuvable")
      return
    }

    try {
      setSubmitting(true)

      // Récupérer les infos de l'utilisateur
      const userDoc = await getDoc(firestoreDoc(db, "users", user.uid))
      const userData = userDoc.exists() ? userDoc.data() : {}

      // Créer la soumission
      const submissionData = {
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        userId: user.uid,
        userName: userData.nom && userData.prenom 
          ? `${userData.prenom} ${userData.nom}` 
          : user.email,
        teacherId: exercise.teacherId,
        teacherName: exercise.teacherName,
        answer: userAnswer,
        submittedAt: serverTimestamp(),
        status: "pending", // pending, reviewed
        feedback: null,
        score: null,
      }

      await addDoc(collection(db, "exercise_submissions"), submissionData)

      setHasSubmitted(true)
      toast.success("Réponse soumise avec succès !")
      toast.info("Votre professeur recevra une notification")
    } catch (error) {
      console.error("Error submitting answer:", error)
      toast.error("Erreur lors de la soumission de votre réponse")
    } finally {
      setSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Facile"
      case "medium":
        return "Moyen"
      case "hard":
        return "Difficile"
      default:
        return difficulty
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

  if (!exercise) {
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
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{exercise.title}</CardTitle>
                    <CardDescription className="text-base">
                      {exercise.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {getDifficultyLabel(exercise.difficulty)}
                    </Badge>
                    <Badge variant="outline">{exercise.points} pts</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Énoncé</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: exercise.statement }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Votre réponse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Écrivez votre réponse ici..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={10}
                  disabled={submitting || (hasSubmitted && submissionFeedback?.status === "reviewed")}
                />
                {hasSubmitted && !submissionFeedback && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <Clock className="h-4 w-4" />
                    <span>Réponse soumise - En attente de correction par votre professeur</span>
                  </div>
                )}
                {submissionFeedback && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span>Corrigé par votre professeur</span>
                      {submissionFeedback.score !== null && (
                        <span className="ml-auto font-bold">
                          Note : {submissionFeedback.score}/20
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-semibold mb-2">Correction du professeur :</h4>
                      <p className="text-sm whitespace-pre-wrap">{submissionFeedback.feedback}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={submitting || !userAnswer.trim() || (hasSubmitted && submissionFeedback?.status === "reviewed")}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : hasSubmitted ? (
                      "Modifier ma réponse"
                    ) : (
                      "Soumettre"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowHints(!showHints)}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {showHints ? "Masquer les indices" : "Voir les indices"}
                  </Button>
                  {exercise.solution && (
                    <Button
                      variant="secondary"
                      onClick={() => setShowSolution(!showSolution)}
                    >
                      {showSolution ? "Masquer la solution" : "Voir la solution"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {showHints && exercise.hints.length > 0 && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Indices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exercise.hints.map((hint, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p>{hint}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {showSolution && exercise.solution && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: exercise.solution }}
                  />
                </CardContent>
              </Card>
            )}
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
                    <p className="text-sm text-muted-foreground">{exercise.teacherName}</p>
                  </div>
                </div>

                <Separator />

                {exercise.timeLimit && (
                  <>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Temps limite</p>
                        <p className="text-sm text-muted-foreground">{exercise.timeLimit} minutes</p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="flex items-center gap-3">
                  <PenTool className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Niveau</p>
                    <p className="text-sm text-muted-foreground">{exercise.level}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Matière</p>
                  <Badge variant="secondary">{exercise.subject}</Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Type</p>
                  <Badge variant="outline">
                    {exercise.type === "practice"
                      ? "Pratique"
                      : exercise.type === "application"
                      ? "Application"
                      : "Défi"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Étudiants complétés</span>
                  <span className="font-medium">{exercise.studentsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taux de réussite</span>
                  <span className="font-medium">
                    {exercise.successRate > 0 ? `${exercise.successRate.toFixed(1)}%` : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
