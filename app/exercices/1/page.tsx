"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, Eye, EyeOff, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Données des exercices
const exercisesData = [
  {
    id: 1,
    question: "Calculez : 12,45 + 7,8",
    options: ["20,25", "20,15", "19,25", "21,25"],
    correctAnswer: "20,25",
    explanation:
      "Pour additionner des nombres décimaux, on aligne les virgules et on additionne chiffre par chiffre.\n12,45 + 7,80 = 20,25",
  },
  {
    id: 2,
    question: "Calculez : 23,7 - 8,45",
    options: ["15,25", "15,35", "15,15", "14,25"],
    correctAnswer: "15,25",
    explanation:
      "Pour soustraire des nombres décimaux, on aligne les virgules et on soustrait chiffre par chiffre.\n23,70 - 8,45 = 15,25",
  },
  {
    id: 3,
    question: "Calculez : 4,2 × 3,5",
    options: ["14,7", "14,70", "14,07", "147"],
    correctAnswer: "14,7",
    explanation:
      "Pour multiplier des nombres décimaux, on multiplie comme des entiers, puis on place la virgule en comptant le nombre total de décimales.\n4,2 × 3,5 = 14,7 (1 décimale + 1 décimale = 2 décimales)",
  },
  {
    id: 4,
    question: "Calculez : 18,6 ÷ 3",
    options: ["6,2", "6,02", "6,20", "62"],
    correctAnswer: "6,2",
    explanation:
      "Pour diviser un nombre décimal par un entier, on divise comme d'habitude en plaçant la virgule au même endroit dans le quotient.\n18,6 ÷ 3 = 6,2",
  },
  {
    id: 5,
    question: "Calculez : 5,6 × 0,4",
    options: ["2,24", "22,4", "0,224", "224"],
    correctAnswer: "2,24",
    explanation:
      "Pour multiplier des nombres décimaux, on multiplie comme des entiers, puis on place la virgule en comptant le nombre total de décimales.\n5,6 × 0,4 = 2,24 (1 décimale + 1 décimale = 2 décimales)",
  },
  {
    id: 6,
    question: "Calculez : 12,6 ÷ 0,6",
    options: ["21", "2,1", "210", "0,21"],
    correctAnswer: "21",
    explanation:
      "Pour diviser par un nombre décimal, on peut multiplier le dividende et le diviseur par une puissance de 10 pour que le diviseur devienne un entier.\n12,6 ÷ 0,6 = 126 ÷ 6 = 21",
  },
  {
    id: 7,
    question: "Calculez : 3,45 + 2,8 + 1,95",
    options: ["8,2", "8,02", "8,20", "7,2"],
    correctAnswer: "8,2",
    explanation:
      "Pour additionner plusieurs nombres décimaux, on aligne les virgules et on additionne chiffre par chiffre.\n3,45 + 2,80 + 1,95 = 8,20 = 8,2",
  },
  {
    id: 8,
    question: "Calculez : 15,4 - 6,75",
    options: ["8,65", "8,75", "9,65", "7,65"],
    correctAnswer: "8,65",
    explanation:
      "Pour soustraire des nombres décimaux, on aligne les virgules et on soustrait chiffre par chiffre.\n15,40 - 6,75 = 8,65",
  },
  {
    id: 9,
    question: "Calculez : 2,5 × 1,2",
    options: ["3", "30", "0,3", "3,0"],
    correctAnswer: "3",
    explanation:
      "Pour multiplier des nombres décimaux, on multiplie comme des entiers, puis on place la virgule en comptant le nombre total de décimales.\n2,5 × 1,2 = 3,0 = 3 (1 décimale + 1 décimale = 2 décimales)",
  },
  {
    id: 10,
    question: "Calculez : 8,4 ÷ 2,1",
    options: ["4", "0,4", "40", "0,04"],
    correctAnswer: "4",
    explanation:
      "Pour diviser par un nombre décimal, on peut multiplier le dividende et le diviseur par une puissance de 10 pour que le diviseur devienne un entier.\n8,4 ÷ 2,1 = 84 ÷ 21 = 4",
  },
]

export default function ExercisePage() {
  const router = useRouter()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showCorrection, setShowCorrection] = useState<Record<number, boolean>>({})
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

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

  const handleSelectAnswer = (exerciseId: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseId]: answer,
    }))
  }

  const handleToggleCorrection = (exerciseId: number) => {
    setShowCorrection((prev) => ({
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

  const handleFinishExercise = () => {
    if (timer) clearInterval(timer)
    setShowResults(true)
  }

  const handleRestartExercise = () => {
    setCurrentExercise(0)
    setUserAnswers({})
    setShowCorrection({})
    setIsExerciseCompleted(false)
    setShowResults(false)
    setTimeSpent(0)
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)
    setTimer(interval)
  }

  // Calculer le score
  const calculateScore = () => {
    let correctCount = 0
    exercisesData.forEach((exercise) => {
      if (userAnswers[exercise.id] === exercise.correctAnswer) {
        correctCount++
      }
    })
    return {
      correct: correctCount,
      total: exercisesData.length,
      percentage: Math.round((correctCount / exercisesData.length) * 100),
    }
  }

  const score = calculateScore()

  // Formater le temps
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const exercise = exercisesData[currentExercise]
  const userAnswer = userAnswers[exercise.id] || ""
  const isCorrect = userAnswer === exercise.correctAnswer

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
          <h1 className="text-2xl font-bold tracking-tighter">Opérations sur les décimaux</h1>
          <p className="text-muted-foreground">
            Exercices d'addition, soustraction, multiplication et division de nombres décimaux
          </p>
        </div>
      </motion.div>

      {!showResults ? (
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
                <div className="text-lg font-medium">{exercise.question}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exercise.options.map((option) => (
                    <Button
                      key={option}
                      variant={userAnswer === option ? "default" : "outline"}
                      className={`justify-start h-auto py-3 px-4 ${
                        showCorrection[exercise.id] && option === exercise.correctAnswer
                          ? "border-green-500 bg-green-500/10 hover:bg-green-500/20"
                          : showCorrection[exercise.id] &&
                              userAnswer === option &&
                              userAnswer !== exercise.correctAnswer
                            ? "border-red-500 bg-red-500/10 hover:bg-red-500/20"
                            : ""
                      }`}
                      onClick={() => handleSelectAnswer(exercise.id, option)}
                    >
                      {showCorrection[exercise.id] && option === exercise.correctAnswer ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      ) : showCorrection[exercise.id] &&
                        userAnswer === option &&
                        userAnswer !== exercise.correctAnswer ? (
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      ) : null}
                      {option}
                    </Button>
                  ))}
                </div>

                {showCorrection[exercise.id] && (
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <div className="font-medium mb-2 flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-500">Correct !</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="text-red-500">Incorrect</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm whitespace-pre-line">{exercise.explanation}</div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevExercise} disabled={currentExercise === 0}>
                  Exercice précédent
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleToggleCorrection(exercise.id)} disabled={!userAnswer}>
                    {showCorrection[exercise.id] ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" /> Masquer la correction
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" /> Voir la correction
                      </>
                    )}
                  </Button>

                  {currentExercise < exercisesData.length - 1 ? (
                    <Button
                      className="bg-gray-900 hover:bg-gray-800"
                      onClick={handleNextExercise}
                      disabled={!userAnswer}
                    >
                      Exercice suivant <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-gray-900 hover:bg-gray-800"
                      onClick={handleFinishExercise}
                      disabled={!userAnswer}
                    >
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
                        {Object.keys(userAnswers).length} / {exercisesData.length}
                      </span>
                    </div>
                    <Progress value={(Object.keys(userAnswers).length / exercisesData.length) * 100} />
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {exercisesData.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentExercise === index ? "default" : "outline"}
                        size="sm"
                        className={`h-10 w-10 p-0 ${
                          userAnswers[index + 1] === exercisesData[index].correctAnswer
                            ? "bg-green-500/10 border-green-500 hover:bg-green-500/20"
                            : userAnswers[index + 1]
                              ? "bg-red-500/10 border-red-500 hover:bg-red-500/20"
                              : ""
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
                    <Badge className="bg-green-500/10 text-green-500">Facile</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temps écoulé</span>
                    <span>{formatTime(timeSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Niveau</span>
                    <span>6ème</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Besoin d'aide ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Consultez le cours sur les opérations avec les nombres décimaux pour vous aider à résoudre ces
                  exercices.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cours/1">Voir le cours</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">Résultats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">Votre score</h3>
                <div className="text-4xl font-bold mb-4">
                  {score.correct} / {score.total}
                </div>
                <Progress value={score.percentage} className="h-3 w-full max-w-md mx-auto mb-2" />
                <p className="text-lg">{score.percentage}%</p>
              </div>

              <Separator />

              <div className="space-y-6">
                <h3 className="text-lg font-bold">Détail des réponses</h3>

                {exercisesData.map((exercise, index) => {
                  const userAns = userAnswers[exercise.id]
                  const isCorrect = userAns === exercise.correctAnswer

                  return (
                    <div key={exercise.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        {isCorrect ? (
                          <Badge className="bg-green-600">Correct</Badge>
                        ) : (
                          <Badge className="bg-red-600">Incorrect</Badge>
                        )}
                      </div>

                      <p className="mb-3">{exercise.question}</p>

                      {userAns && (
                        <div
                          className={`p-2 rounded-md mb-2 ${
                            isCorrect
                              ? "bg-green-500/10 border border-green-500/20"
                              : "bg-red-500/10 border border-red-500/20"
                          }`}
                        >
                          <div className="font-medium">Votre réponse :</div>
                          <p>{userAns}</p>
                        </div>
                      )}

                      {!isCorrect && (
                        <div className="p-2 rounded-md mb-2 bg-green-500/10 border border-green-500/20">
                          <div className="font-medium">Réponse correcte :</div>
                          <p>{exercise.correctAnswer}</p>
                        </div>
                      )}

                      <div className="bg-muted p-2 rounded-md mt-2 text-sm">
                        <div className="font-medium">Explication :</div>
                        <p className="whitespace-pre-line">{exercise.explanation}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleRestartExercise}>
                Recommencer les exercices
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800" asChild>
                <Link href="/exercices">Voir d'autres exercices</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
