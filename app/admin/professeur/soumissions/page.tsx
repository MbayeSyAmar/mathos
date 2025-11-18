"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { collection, query, where, getDocs, doc as firestoreDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { BackButton } from "@/components/back-button"
import { setExerciseReviewProgress } from "@/lib/services/student-progress-service"

interface Submission {
  id: string
  exerciseId: string
  exerciseTitle: string
  userId: string
  userName: string
  answer: string
  submittedAt: any
  status: "pending" | "reviewed"
  feedback: string | null
  score: number | null
}

export default function SoumissionsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchSubmissions()
    }
  }, [user])

  const fetchSubmissions = async () => {
    if (!user) return

    try {
      setLoading(true)
      const submissionsRef = collection(db, "exercise_submissions")
      const q = query(submissionsRef, where("teacherId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const submissionsData: Submission[] = []
      querySnapshot.forEach((doc) => {
        submissionsData.push({
          id: doc.id,
          ...doc.data(),
        } as Submission)
      })

      submissionsData.sort((a, b) => {
        const getTime = (value: any) => {
          if (!value) return 0
          if (typeof value.toMillis === "function") return value.toMillis()
          if (value.seconds) return value.seconds * 1000
          const date = new Date(value)
          return isNaN(date.getTime()) ? 0 : date.getTime()
        }
        return getTime(b.submittedAt) - getTime(a.submittedAt)
      })

      setSubmissions(submissionsData)
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast.error("Erreur lors du chargement des soumissions")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenReview = (submission: Submission) => {
    setSelectedSubmission(submission)
    setFeedback(submission.feedback || "")
    setScore(submission.score?.toString() || "")
    setReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedSubmission) return

    if (!feedback.trim()) {
      toast.error("Veuillez écrire un commentaire")
      return
    }

    const scoreValue = score ? parseFloat(score) : null
    if (scoreValue !== null && (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 20)) {
      toast.error("La note doit être entre 0 et 20")
      return
    }

    try {
      setSubmitting(true)

      const submissionRef = firestoreDoc(db, "exercise_submissions", selectedSubmission.id)
      await updateDoc(submissionRef, {
        feedback: feedback,
        score: scoreValue,
        status: "reviewed",
        reviewedAt: new Date(),
      })

      const normalizedScore = scoreValue !== null ? Math.round((scoreValue / 20) * 100) : null
      await setExerciseReviewProgress(
        selectedSubmission.userId,
        selectedSubmission.exerciseId,
        selectedSubmission.exerciseTitle,
        normalizedScore
      )

      toast.success("Correction enregistrée avec succès")
      setReviewDialogOpen(false)
      fetchSubmissions()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Erreur lors de l'enregistrement de la correction")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Date inconnue"
    
    try {
      let date: Date
      
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate()
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000)
      } else {
        date = new Date(timestamp)
      }
      
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date invalide"
    }
  }

  const pendingSubmissions = submissions.filter((s) => s.status === "pending")
  const reviewedSubmissions = submissions.filter((s) => s.status === "reviewed")

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

  return (
    <div className="container py-10">
      <div className="mb-6">
        <BackButton href="/admin/professeur/dashboard" label="Retour au dashboard" />
      </div>

      <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Soumissions d'exercices</h1>
        <p className="text-muted-foreground">Consultez et corrigez les réponses de vos élèves</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              En attente ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Corrigées ({reviewedSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingSubmissions.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune soumission en attente</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {submission.exerciseTitle}
                          </CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {submission.userName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(submission.submittedAt)}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">En attente</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Réponse de l'élève :</h4>
                        <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                          {submission.answer}
                        </div>
                      </div>
                      <Button onClick={() => handleOpenReview(submission)}>
                        Corriger cette réponse
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="mt-6">
            {reviewedSubmissions.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune soumission corrigée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviewedSubmissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {submission.exerciseTitle}
                          </CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {submission.userName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(submission.submittedAt)}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Corrigée</Badge>
                          {submission.score !== null && (
                            <Badge variant="outline" className="font-bold">
                              {submission.score}/20
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Réponse de l'élève :</h4>
                        <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                          {submission.answer}
                        </div>
                      </div>
                      {submission.feedback && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Votre correction :</h4>
                          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg whitespace-pre-wrap">
                            {submission.feedback}
                          </div>
                        </div>
                      )}
                      <Button variant="outline" onClick={() => handleOpenReview(submission)}>
                        Modifier la correction
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog de correction */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Corriger la réponse</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.exerciseTitle} - {selectedSubmission?.userName}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Réponse de l'élève :</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedSubmission.answer}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Note (sur 20) - Optionnel</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  placeholder="Ex: 15"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Commentaire et correction *</Label>
                <Textarea
                  id="feedback"
                  placeholder="Écrivez votre correction et vos commentaires ici..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={8}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitReview} disabled={submitting || !feedback.trim()}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer la correction"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
