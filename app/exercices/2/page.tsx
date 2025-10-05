"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, ArrowRight, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// Données des exercices
const exercisesData = [
  {
    id: 1,
    question: "Résoudre l'équation : 3x + 5 = 20",
    type: "equation",
  },
  {
    id: 2,
    question: "Factoriser l'expression : x² - 9",
    type: "factorisation",
  },
  {
    id: 3,
    question: "Calculer la dérivée de la fonction f(x) = 2x³ - 5x² + 3x - 1",
    type: "derivee",
  },
  {
    id: 4,
    question: "Résoudre l'inéquation : 2x - 3 > 7",
    type: "inequation",
  },
  {
    id: 5,
    question: "Calculer la limite de la fonction f(x) = (x² - 1) / (x - 1) quand x tend vers 1",
    type: "limite",
  },
  {
    id: 6,
    question: "Déterminer l'ensemble de définition de la fonction f(x) = √(x - 2) / (x + 3)",
    type: "domaine",
  },
  {
    id: 7,
    question: "Calculer l'intégrale de la fonction f(x) = 2x + 3 sur l'intervalle [0, 2]",
    type: "integrale",
  },
  {
    id: 8,
    question: "Résoudre le système d'équations suivant :\n{ 2x + y = 5\n{ 3x - 2y = 4",
    type: "systeme",
  },
]

export default function ExercisePage() {
  const router = useRouter()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [showHint, setShowHint] = useState<Record<number, boolean>>({})

  // Démarrer le chronomètre au chargement de la page
  useState(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)
    setTimer(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  const handleAnswerChange = (exerciseId: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseId]: answer,
    }))
  }

  const handleToggleHint = (exerciseId: number) => {
    setShowHint((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }))
  }

  const handleNextExercise = () => {
    if (currentExercise < exercisesData.length - 1) {
      setCurrentExercise(currentExercise + 1)
    } else {
      // Tous les exercices sont terminés
      if (timer) clearInterval(timer)
      setIsExerciseCompleted(true)
    }
  }

  const handlePrevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
    }
  }

  const handleSubmitExercises = () => {
    if (timer) clearInterval(timer)
    setIsExerciseCompleted(true)
  }

  // Formater le temps
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // Obtenir des indices pour chaque type d'exercice
  const getHint = (type: string) => {
    switch (type) {
      case "equation":
        return "Pour résoudre une équation de la forme ax + b = c, isolez x en soustrayant b des deux côtés, puis en divisant par a."
      case "factorisation":
        return "Cherchez à identifier une identité remarquable comme (a+b)² ou (a-b)(a+b)."
      case "derivee":
        return "Appliquez les règles de dérivation terme par terme. Pour x^n, la dérivée est n·x^(n-1)."
      case "inequation":
        return "Procédez comme pour une équation, mais attention au sens de l'inégalité si vous multipliez ou divisez par un nombre négatif."
      case "limite":
        return "Essayez de factoriser le numérateur et le dénominateur pour simplifier la fraction avant de calculer la limite."
      case "domaine":
        return "Identifiez les valeurs qui rendraient le dénominateur nul ou l'expression sous la racine négative."
      case "integrale":
        return "Utilisez les règles d'intégration. Pour ∫x^n dx, le résultat est x^(n+1)/(n+1) + C."
      case "systeme":
        return "Vous pouvez utiliser la méthode de substitution ou d'élimination pour résoudre le système."
      default:
        return "Réfléchissez étape par étape et appliquez les règles appropriées."
    }
  }

  const exercise = exercisesData[currentExercise]
  const userAnswer = userAnswers[exercise.id] || ""

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
      <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Button variant="ghost" size="icon" onClick={() => router.push("/exercices")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">Algèbre et Analyse</h1>
          <p className="text-muted-foreground">
            Exercices sur les équations, dérivées, limites et autres concepts mathématiques
          </p>
        </div>
      </motion.div>

      {!isExerciseCompleted ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="md:col-span-3">
            <Card className="border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">
                  Exercice {currentExercise + 1} sur {exercisesData.length}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(timeSpent)}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium whitespace-pre-line">{exercise.question}</div>

                <div className="space-y-2">
                  <Label htmlFor="answer">Votre réponse</Label>
                  <Textarea
                    id="answer"
                    placeholder="Écrivez votre solution ici..."
                    rows={5}
                    value={userAnswers[exercise.id] || ""}
                    onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                  />
                </div>

                {showHint[exercise.id] && (
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <div className="font-medium mb-2 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <span>Indice</span>
                    </div>
                    <div className="text-sm">{getHint(exercise.type)}</div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevExercise} disabled={currentExercise === 0}>
                  Exercice précédent
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleToggleHint(exercise.id)}>
                    {showHint[exercise.id] ? "Masquer l'indice" : "Voir un indice"}
                  </Button>

                  {currentExercise < exercisesData.length - 1 ? (
                    <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleNextExercise}>
                      Exercice suivant <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleSubmitExercises}>
                      Terminer les exercices
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Progression</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exercices complétés</span>
                      <span>
                        {Object.keys(userAnswers).filter((id) => userAnswers[Number(id)]?.trim()).length} /{" "}
                        {exercisesData.length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (Object.keys(userAnswers).filter((id) => userAnswers[Number(id)]?.trim()).length /
                          exercisesData.length) *
                        100
                      }
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {exercisesData.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentExercise === index ? "default" : "outline"}
                        size="sm"
                        className={`h-10 w-10 p-0 ${
                          userAnswers[index + 1]?.trim() ? "bg-primary/10 border-primary" : ""
                        }`}
                        onClick={() => setCurrentExercise(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Informations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulté</span>
                    <Badge className="bg-red-500/10 text-red-500">Difficile</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temps écoulé</span>
                    <span>{formatTime(timeSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Niveau</span>
                    <span>Terminale</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Besoin d'aide ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces exercices n'ont pas de correction automatique. Soumettez vos réponses pour les envoyer à un
                  professeur qui les corrigera.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/encadrement">Demander de l'aide</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">Exercices terminés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">Merci d'avoir complété les exercices</h3>
                <p className="text-muted-foreground mb-4">
                  Vos réponses ont été enregistrées. Un professeur les examinera et vous fournira des commentaires.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Temps total: {formatTime(timeSpent)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <h3 className="text-lg font-bold">Résumé de vos réponses</h3>

                {exercisesData.map((exercise, index) => {
                  const userAns = userAnswers[exercise.id] || "Aucune réponse fournie"

                  return (
                    <div key={exercise.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        {userAnswers[exercise.id]?.trim() ? (
                          <Badge className="bg-primary">Répondu</Badge>
                        ) : (
                          <Badge variant="outline">Non répondu</Badge>
                        )}
                      </div>

                      <p className="mb-3 whitespace-pre-line">{exercise.question}</p>

                      <div className="p-2 rounded-md mb-2 bg-muted">
                        <div className="font-medium">Votre réponse :</div>
                        <p className="whitespace-pre-line">{userAns}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/exercices">Voir d'autres exercices</Link>
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800" asChild>
                <Link href="/dashboard">Retour au tableau de bord</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
