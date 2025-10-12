// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
// import {
//   BrainCircuit,
//   Clock,
//   ArrowLeft,
//   ArrowRight,
//   User,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   Trophy,
// } from "lucide-react"
// import { useAuth } from "@/lib/auth-context"
// import { getQuizById, type Quiz } from "@/lib/services/content-service"
// import { hasAccessToTeacher } from "@/lib/services/student-access-service"
// import { motion, AnimatePresence } from "framer-motion"
// import { toast } from "sonner"

// export default function QuizDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { user } = useAuth()
//   const [quiz, setQuiz] = useState<Quiz | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [started, setStarted] = useState(false)
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [answers, setAnswers] = useState<{ [key: number]: string }>({})
//   const [showResults, setShowResults] = useState(false)
//   const [score, setScore] = useState(0)
//   const [timeRemaining, setTimeRemaining] = useState(0)

//   useEffect(() => {
//     if (params.id) {
//       fetchQuiz(params.id as string)
//     }
//   }, [params.id])

//   useEffect(() => {
//     if (started && timeRemaining > 0) {
//       const timer = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 1) {
//             handleSubmit()
//             return 0
//           }
//           return prev - 1
//         })
//       }, 1000)
//       return () => clearInterval(timer)
//     }
//   }, [started, timeRemaining])

//   const fetchQuiz = async (quizId: string) => {
//     try {
//       setLoading(true)
//       const quizData = await getQuizById(quizId)
      
//       if (!quizData) {
//         toast.error("Quiz introuvable")
//         router.push("/quiz")
//         return
//       }

//       setQuiz(quizData)
//       setTimeRemaining(quizData.timeLimit * 60)
//     } catch (error) {
//       console.error("Error fetching quiz:", error)
//       toast.error("Erreur lors du chargement du quiz")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStart = () => {
//     setStarted(true)
//   }

//   const handleAnswer = (questionIndex: number, answer: string) => {
//     setAnswers({ ...answers, [questionIndex]: answer })
//   }

//   const handleNext = () => {
//     if (quiz && currentQuestion < quiz.questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1)
//     }
//   }

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1)
//     }
//   }

//   const handleSubmit = () => {
//     if (!quiz) return

//     let correctCount = 0
//     quiz.questions.forEach((question, index) => {
//       if (answers[index] === String(question.correctAnswer)) {
//         correctCount++
//       }
//     })

//     const finalScore = (correctCount / quiz.questions.length) * 100
//     setScore(finalScore)
//     setShowResults(true)
    
//     if (finalScore >= quiz.passingScore) {
//       toast.success(`Félicitations ! Vous avez réussi avec ${finalScore.toFixed(1)}%`)
//     } else {
//       toast.error(`Score: ${finalScore.toFixed(1)}% - Minimum requis: ${quiz.passingScore}%`)
//     }
//   }

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins}:${secs.toString().padStart(2, "0")}`
//   }

//   if (loading) {
//     return (
//       <div className="container py-10">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       </div>
//     )
//   }

//   if (!quiz) {
//     return null
//   }

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5 },
//     },
//   }

//   if (!started) {
//     return (
//       <div className="container py-10">
//         <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//           <Button variant="ghost" onClick={() => router.back()} className="mb-6">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour
//           </Button>

//           <div className="max-w-2xl mx-auto">
//             <Card>
//               <CardHeader className="text-center">
//                 <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
//                   <BrainCircuit className="h-8 w-8 text-purple-500" />
//                 </div>
//                 <CardTitle className="text-3xl">{quiz.title}</CardTitle>
//                 <CardDescription className="text-base">{quiz.description}</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center p-4 bg-muted rounded-lg">
//                     <p className="text-2xl font-bold">{quiz.questions.length}</p>
//                     <p className="text-sm text-muted-foreground">Questions</p>
//                   </div>
//                   <div className="text-center p-4 bg-muted rounded-lg">
//                     <p className="text-2xl font-bold">{quiz.timeLimit}</p>
//                     <p className="text-sm text-muted-foreground">Minutes</p>
//                   </div>
//                   <div className="text-center p-4 bg-muted rounded-lg">
//                     <p className="text-2xl font-bold">{quiz.passingScore}%</p>
//                     <p className="text-sm text-muted-foreground">Score requis</p>
//                   </div>
//                   <div className="text-center p-4 bg-muted rounded-lg">
//                     <p className="text-2xl font-bold">{quiz.level}</p>
//                     <p className="text-sm text-muted-foreground">Niveau</p>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div>
//                   <p className="font-medium mb-2">Professeur</p>
//                   <p className="text-muted-foreground">{quiz.teacherName}</p>
//                 </div>

//                 <div>
//                   <p className="font-medium mb-2">Matière</p>
//                   <Badge variant="secondary">{quiz.subject}</Badge>
//                 </div>

//                 <Button className="w-full" size="lg" onClick={handleStart}>
//                   Commencer le quiz
//                   <ArrowRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </motion.div>
//       </div>
//     )
//   }

//   if (showResults) {
//     return (
//       <div className="container py-10">
//         <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//           <div className="max-w-2xl mx-auto">
//             <Card>
//               <CardHeader className="text-center">
//                 <div
//                   className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
//                     score >= quiz.passingScore ? "bg-green-500/10" : "bg-red-500/10"
//                   }`}
//                 >
//                   {score >= quiz.passingScore ? (
//                     <Trophy className="h-10 w-10 text-green-500" />
//                   ) : (
//                     <XCircle className="h-10 w-10 text-red-500" />
//                   )}
//                 </div>
//                 <CardTitle className="text-3xl">
//                   {score >= quiz.passingScore ? "Félicitations !" : "Continuez vos efforts"}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   {score >= quiz.passingScore
//                     ? "Vous avez réussi le quiz"
//                     : "Vous n'avez pas atteint le score requis"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="text-center">
//                   <p className="text-5xl font-bold mb-2">{score.toFixed(1)}%</p>
//                   <p className="text-muted-foreground">Votre score</p>
//                 </div>

//                 <Separator />

//                 <div className="space-y-4">
//                   {quiz.questions.map((question, index) => {
//                     const isCorrect = answers[index] === String(question.correctAnswer)
//                     return (
//                       <Card
//                         key={question.id}
//                         className={
//                           isCorrect
//                             ? "border-green-500 bg-green-50 dark:bg-green-950"
//                             : "border-red-500 bg-red-50 dark:bg-red-950"
//                         }
//                       >
//                         <CardHeader>
//                           <div className="flex items-start gap-3">
//                             {isCorrect ? (
//                               <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
//                             ) : (
//                               <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
//                             )}
//                             <div className="flex-1">
//                               <p className="font-medium">
//                                 Question {index + 1}: {question.question}
//                               </p>
//                               <p className="text-sm text-muted-foreground mt-1">
//                                 Votre réponse: {answers[index] || "Pas de réponse"} •
//                                 Réponse correcte: {question.correctAnswer}
//                               </p>
//                               {question.explanation && (
//                                 <p className="text-sm mt-2">{question.explanation}</p>
//                               )}
//                             </div>
//                           </div>
//                         </CardHeader>
//                       </Card>
//                     )
//                   })}
//                 </div>

//                 <div className="flex gap-2">
//                   <Button className="flex-1" onClick={() => router.back()}>
//                     Retour
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => {
//                       setStarted(false)
//                       setShowResults(false)
//                       setCurrentQuestion(0)
//                       setAnswers({})
//                       setScore(0)
//                       setTimeRemaining(quiz.timeLimit * 60)
//                     }}
//                   >
//                     Recommencer
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </motion.div>
//       </div>
//     )
//   }

//   const currentQuestionData = quiz.questions[currentQuestion]
//   const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

//   return (
//     <div className="container py-10">
//       <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//         <div className="max-w-3xl mx-auto">
//           <Card className="mb-6">
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-5 w-5" />
//                   <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
//                 </div>
//                 <span className="text-sm text-muted-foreground">
//                   Question {currentQuestion + 1} / {quiz.questions.length}
//                 </span>
//               </div>
//               <Progress value={progress} />
//             </CardContent>
//           </Card>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentQuestion}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-xl">{currentQuestionData.question}</CardTitle>
//                   <CardDescription>{currentQuestionData.points} points</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {currentQuestionData.type === "multiple_choice" && currentQuestionData.options && (
//                     <RadioGroup
//                       value={answers[currentQuestion] || ""}
//                       onValueChange={(value) => handleAnswer(currentQuestion, value)}
//                     >
//                       {currentQuestionData.options.map((option, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent transition-colors"
//                         >
//                           <RadioGroupItem value={option} id={`option-${index}`} />
//                           <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
//                             {option}
//                           </Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   )}

//                   {currentQuestionData.type === "true_false" && (
//                     <RadioGroup
//                       value={answers[currentQuestion] || ""}
//                       onValueChange={(value) => handleAnswer(currentQuestion, value)}
//                     >
//                       <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent transition-colors">
//                         <RadioGroupItem value="true" id="true" />
//                         <Label htmlFor="true" className="flex-1 cursor-pointer">
//                           Vrai
//                         </Label>
//                       </div>
//                       <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent transition-colors">
//                         <RadioGroupItem value="false" id="false" />
//                         <Label htmlFor="false" className="flex-1 cursor-pointer">
//                           Faux
//                         </Label>
//                       </div>
//                     </RadioGroup>
//                   )}

//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={handlePrevious}
//                       disabled={currentQuestion === 0}
//                     >
//                       <ArrowLeft className="h-4 w-4 mr-2" />
//                       Précédent
//                     </Button>
//                     {currentQuestion === quiz.questions.length - 1 ? (
//                       <Button className="flex-1" onClick={handleSubmit}>
//                         Terminer le quiz
//                       </Button>
//                     ) : (
//                       <Button className="flex-1" onClick={handleNext}>
//                         Suivant
//                         <ArrowRight className="h-4 w-4 ml-2" />
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </AnimatePresence>

//           <Card className="mt-6">
//             <CardHeader>
//               <CardTitle className="text-sm">Navigation</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-10 gap-2">
//                 {quiz.questions.map((_, index) => (
//                   <Button
//                     key={index}
//                     variant={currentQuestion === index ? "default" : answers[index] ? "secondary" : "outline"}
//                     size="sm"
//                     onClick={() => setCurrentQuestion(index)}
//                     className="h-10"
//                   >
//                     {index + 1}
//                   </Button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// // Ancien code supprimé
// const oldQuizData = {
//   id: 3,
//   title: "Fonctions et dérivées",
//   description: "Évaluez votre maîtrise du calcul différentiel",
//   level: "Lycée",
//   difficulty: "Difficile",
//   totalQuestions: 10,
//   timeLimit: 25, // minutes
//   questions: [
//     {
//       id: 1,
//       text: "Quelle est la dérivée de la fonction f(x) = x² + 3x - 5 ?",
//       options: [
//         { id: "a", text: "f'(x) = 2x + 3" },
//         { id: "b", text: "f'(x) = x² + 3" },
//         { id: "c", text: "f'(x) = 2x" },
//         { id: "d", text: "f'(x) = 3" },
//       ],
//       correctAnswer: "a",
//       explanation:
//         "La dérivée de x² est 2x et la dérivée de 3x est 3. La dérivée d'une constante est 0. Donc f'(x) = 2x + 3.",
//     },
//     {
//       id: 2,
//       text: "Quelle est la dérivée de la fonction g(x) = sin(x) ?",
//       options: [
//         { id: "a", text: "g'(x) = sin(x)" },
//         { id: "b", text: "g'(x) = cos(x)" },
//         { id: "c", text: "g'(x) = -sin(x)" },
//         { id: "d", text: "g'(x) = -cos(x)" },
//       ],
//       correctAnswer: "b",
//       explanation: "La dérivée de sin(x) est cos(x).",
//     },
//     {
//       id: 3,
//       text: "Si h(x) = f(x) × g(x), quelle est la formule de h'(x) ?",
//       options: [
//         { id: "a", text: "h'(x) = f'(x) × g'(x)" },
//         { id: "b", text: "h'(x) = f'(x) + g'(x)" },
//         { id: "c", text: "h'(x) = f'(x) × g(x) + f(x) × g'(x)" },
//         { id: "d", text: "h'(x) = f(x) × g(x)" },
//       ],
//       correctAnswer: "c",
//       explanation:
//         "La dérivée d'un produit de fonctions suit la règle du produit : h'(x) = f'(x) × g(x) + f(x) × g'(x).",
//     },
//     {
//       id: 4,
//       text: "Quelle est la dérivée de la fonction exponentielle e^x ?",
//       options: [
//         { id: "a", text: "e^x" },
//         { id: "b", text: "x × e^(x-1)" },
//         { id: "c", text: "e^x × ln(x)" },
//         { id: "d", text: "0" },
//       ],
//       correctAnswer: "a",
//       explanation: "La fonction exponentielle e^x est sa propre dérivée, c'est-à-dire que (e^x)' = e^x.",
//     },
//     {
//       id: 5,
//       text: "Si f(x) = ln(x), quelle est f'(x) ?",
//       options: [
//         { id: "a", text: "1/x" },
//         { id: "b", text: "ln(x)" },
//         { id: "c", text: "x" },
//         { id: "d", text: "1/ln(x)" },
//       ],
//       correctAnswer: "a",
//       explanation: "La dérivée de ln(x) est 1/x.",
//     },
//   ],
// }

// export default function QuizPage({ params }) {
//   const router = useRouter()
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [selectedAnswers, setSelectedAnswers] = useState({})
//   const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 60) // en secondes
//   const [quizState, setQuizState] = useState("in-progress") // in-progress, review, completed
//   const [showExplanation, setShowExplanation] = useState(false)

//   // Gérer le décompte du temps
//   useEffect(() => {
//     if (quizState === "in-progress") {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer)
//             setQuizState("review")
//             return 0
//           }
//           return prev - 1
//         })
//       }, 1000)

//       return () => clearInterval(timer)
//     }
//   }, [quizState])

//   // Formater le temps restant
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
//   }

//   // Calculer le score
//   const calculateScore = () => {
//     let correctCount = 0

//     quizData.questions.forEach((question) => {
//       if (selectedAnswers[question.id] === question.correctAnswer) {
//         correctCount++
//       }
//     })

//     return {
//       correct: correctCount,
//       total: quizData.questions.length,
//       percentage: Math.round((correctCount / quizData.questions.length) * 100),
//     }
//   }

//   const handleSelectAnswer = (questionId, answerId) => {
//     setSelectedAnswers({
//       ...selectedAnswers,
//       [questionId]: answerId,
//     })
//   }

//   const handleNextQuestion = () => {
//     if (currentQuestion < quizData.questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1)
//       setShowExplanation(false)
//     } else {
//       setQuizState("review")
//     }
//   }

//   const handlePrevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1)
//       setShowExplanation(false)
//     }
//   }

//   const handleFinishQuiz = () => {
//     setQuizState("completed")
//   }

//   const handleRestartQuiz = () => {
//     setCurrentQuestion(0)
//     setSelectedAnswers({})
//     setTimeLeft(quizData.timeLimit * 60)
//     setQuizState("in-progress")
//     setShowExplanation(false)
//   }

//   const question = quizData.questions[currentQuestion]
//   const score = calculateScore()

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5 },
//     },
//   }

//   return (
//     <div className="container py-10">
//       <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
//         <Button variant="ghost" size="icon" onClick={() => router.push("/quiz")}>
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold tracking-tighter">{quizData.title}</h1>
//           <p className="text-muted-foreground">{quizData.description}</p>
//         </div>
//       </motion.div>

//       {quizState === "in-progress" && (
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           className="grid grid-cols-1 md:grid-cols-4 gap-6"
//         >
//           <div className="md:col-span-3">
//             <Card className="border-gray-800">
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle className="text-xl">
//                   Question {currentQuestion + 1} sur {quizData.questions.length}
//                 </CardTitle>
//                 <div className="flex items-center gap-2 text-sm">
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                   <span className={timeLeft < 60 ? "text-red-500 font-bold" : ""}>{formatTime(timeLeft)}</span>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="text-lg font-medium">{question.text}</div>

//                 <RadioGroup
//                   value={selectedAnswers[question.id] || ""}
//                   onValueChange={(value) => handleSelectAnswer(question.id, value)}
//                   className="space-y-3"
//                 >
//                   {question.options.map((option) => (
//                     <div key={option.id} className="flex items-center space-x-2">
//                       <RadioGroupItem value={option.id} id={`option-${option.id}`} className="border-gray-500" />
//                       <Label
//                         htmlFor={`option-${option.id}`}
//                         className="flex-1 cursor-pointer rounded-md border border-transparent p-2 hover:bg-muted/50"
//                       >
//                         {option.text}
//                       </Label>
//                     </div>
//                   ))}
//                 </RadioGroup>

//                 {showExplanation && (
//                   <div className="bg-muted p-4 rounded-md mt-4">
//                     <div className="font-medium mb-2 flex items-center gap-2">
//                       <CheckCircle className="h-5 w-5 text-green-500" />
//                       Réponse correcte : {question.options.find((o) => o.id === question.correctAnswer).text}
//                     </div>
//                     <p>{question.explanation}</p>
//                   </div>
//                 )}
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
//                   Question précédente
//                 </Button>

//                 <div className="flex gap-2">
//                   <Button variant="outline" onClick={() => setShowExplanation(!showExplanation)}>
//                     {showExplanation ? "Masquer l'explication" : "Voir l'explication"}
//                   </Button>

//                   <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleNextQuestion}>
//                     {currentQuestion < quizData.questions.length - 1 ? (
//                       <>
//                         Question suivante <ArrowRight className="ml-2 h-4 w-4" />
//                       </>
//                     ) : (
//                       <>Terminer le quiz</>
//                     )}
//                   </Button>
//                 </div>
//               </CardFooter>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="font-bold mb-4">Informations sur le quiz</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <Badge className="bg-gray-800">{quizData.level}</Badge>
//                     <Badge className="bg-red-500/10 text-red-500">{quizData.difficulty}</Badge>
//                   </div>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Questions</span>
//                       <span>{quizData.totalQuestions}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Temps limite</span>
//                       <span>{quizData.timeLimit} minutes</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Temps restant</span>
//                       <span className={timeLeft < 60 ? "text-red-500 font-bold" : ""}>{formatTime(timeLeft)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="font-bold mb-4">Progression</h3>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>Questions répondues</span>
//                       <span>
//                         {Object.keys(selectedAnswers).length} / {quizData.questions.length}
//                       </span>
//                     </div>
//                     <Progress value={(Object.keys(selectedAnswers).length / quizData.questions.length) * 100} />
//                   </div>

//                   <div className="grid grid-cols-5 gap-2">
//                     {quizData.questions.map((q, index) => (
//                       <Button
//                         key={q.id}
//                         variant={currentQuestion === index ? "default" : "outline"}
//                         size="sm"
//                         className={`h-10 w-10 p-0 ${selectedAnswers[q.id] ? "bg-muted" : ""}`}
//                         onClick={() => setCurrentQuestion(index)}
//                       >
//                         {index + 1}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </motion.div>
//       )}

//       {quizState === "review" && (
//         <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//           <Card className="border-gray-800">
//             <CardHeader>
//               <CardTitle className="text-xl">Révision du quiz</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="bg-muted p-6 rounded-lg text-center">
//                 <h3 className="text-2xl font-bold mb-2">Votre score</h3>
//                 <div className="text-4xl font-bold mb-4">
//                   {score.correct} / {score.total}
//                 </div>
//                 <Progress value={score.percentage} className="h-3 w-full max-w-md mx-auto mb-2" />
//                 <p className="text-lg">{score.percentage}%</p>
//               </div>

//               <Separator />

//               <div className="space-y-6">
//                 <h3 className="text-lg font-bold">Révision des questions</h3>

//                 {quizData.questions.map((q, index) => {
//                   const isCorrect = selectedAnswers[q.id] === q.correctAnswer
//                   const selectedOption = q.options.find((o) => o.id === selectedAnswers[q.id])
//                   const correctOption = q.options.find((o) => o.id === q.correctAnswer)

//                   return (
//                     <div key={q.id} className="border rounded-lg p-4">
//                       <div className="flex justify-between items-start mb-2">
//                         <h4 className="font-medium">Question {index + 1}</h4>
//                         {isCorrect ? (
//                           <Badge className="bg-green-600">Correct</Badge>
//                         ) : (
//                           <Badge className="bg-red-600">Incorrect</Badge>
//                         )}
//                       </div>

//                       <p className="mb-3">{q.text}</p>

//                       {selectedOption && (
//                         <div
//                           className={`p-2 rounded-md mb-2 ${isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}
//                         >
//                           <div className="font-medium">Votre réponse :</div>
//                           <p>{selectedOption.text}</p>
//                         </div>
//                       )}

//                       {!isCorrect && (
//                         <div className="p-2 rounded-md mb-2 bg-green-500/10 border border-green-500/20">
//                           <div className="font-medium">Réponse correcte :</div>
//                           <p>{correctOption.text}</p>
//                         </div>
//                       )}

//                       <div className="bg-muted p-2 rounded-md mt-2 text-sm">
//                         <div className="font-medium">Explication :</div>
//                         <p>{q.explanation}</p>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={handleRestartQuiz}>
//                 Recommencer le quiz
//               </Button>
//               <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleFinishQuiz}>
//                 Terminer et voir les résultats
//               </Button>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       )}

//       {quizState === "completed" && (
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6"
//         >
//           <div className="md:col-span-2">
//             <Card className="border-gray-800">
//               <CardHeader className="text-center">
//                 <CardTitle className="text-2xl">Félicitations !</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6 text-center">
//                 <div className="flex justify-center">
//                   <div className="relative w-32 h-32 flex items-center justify-center">
//                     <svg className="w-full h-full" viewBox="0 0 100 100">
//                       <circle
//                         className="text-muted stroke-current"
//                         strokeWidth="10"
//                         fill="transparent"
//                         r="40"
//                         cx="50"
//                         cy="50"
//                       />
//                       <circle
//                         className="text-primary stroke-current"
//                         strokeWidth="10"
//                         strokeLinecap="round"
//                         fill="transparent"
//                         r="40"
//                         cx="50"
//                         cy="50"
//                         strokeDasharray={`${score.percentage * 2.51} 251`}
//                         strokeDashoffset="0"
//                         transform="rotate(-90 50 50)"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="text-3xl font-bold">{score.percentage}%</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-xl font-bold mb-2">Votre score</h3>
//                   <p className="text-lg">
//                     {score.correct} réponses correctes sur {score.total} questions
//                   </p>
//                 </div>

//                 <div className="bg-muted p-4 rounded-lg">
//                   {score.percentage >= 80 ? (
//                     <div className="flex flex-col items-center gap-2">
//                       <Trophy className="h-10 w-10 text-yellow-500" />
//                       <p className="font-medium">Excellent travail ! Vous maîtrisez bien ce sujet.</p>
//                     </div>
//                   ) : score.percentage >= 60 ? (
//                     <div className="flex flex-col items-center gap-2">
//                       <CheckCircle className="h-10 w-10 text-green-500" />
//                       <p className="font-medium">Bon travail ! Vous avez une bonne compréhension du sujet.</p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center gap-2">
//                       <AlertCircle className="h-10 w-10 text-orange-500" />
//                       <p className="font-medium">
//                         Continuez à pratiquer ! Certains concepts nécessitent plus de révision.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-center gap-4">
//                 <Button variant="outline" onClick={handleRestartQuiz}>
//                   Refaire ce quiz
//                 </Button>
//                 <Button className="bg-gray-900 hover:bg-gray-800" onClick={() => router.push("/quiz")}>
//                   Explorer d'autres quiz
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="font-bold mb-4">Statistiques</h3>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Temps utilisé</span>
//                     <span>{formatTime(quizData.timeLimit * 60 - timeLeft)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Précision</span>
//                     <span>{score.percentage}%</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Réponses correctes</span>
//                     <span>
//                       {score.correct} / {score.total}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="font-bold mb-4">Quiz recommandés</h3>
//                 <div className="space-y-3">
//                   <Link href="/quiz/1" className="block group">
//                     <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
//                       Nombres et calculs
//                     </h4>
//                     <p className="text-xs text-muted-foreground">Niveau : Collège • 10 questions</p>
//                   </Link>
//                   <Link href="/quiz/2" className="block group">
//                     <h4 className="text-sm font-medium group-hover:text-primary transition-colors">Géométrie plane</h4>
//                     <p className="text-xs text-muted-foreground">Niveau : Collège • 15 questions</p>
//                   </Link>
//                   <Link href="/quiz/4" className="block group">
//                     <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
//                       Suites numériques
//                     </h4>
//                     <p className="text-xs text-muted-foreground">Niveau : Lycée • 15 questions</p>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }
