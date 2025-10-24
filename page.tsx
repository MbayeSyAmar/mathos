"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  BrainCircuit,
  Clock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  XCircle,
  Trophy,
  FileText,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { getQuizContent, type QuizQuestion } from "@/lib/services/quiz-enrichment.service"
import { getStaticQuizById, type StaticQuiz } from "@/lib/services/static-quiz.service"

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState<StaticQuiz | null>(null)
  const [hasPDF, setHasPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [enrichedQuestions, setEnrichedQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchQuiz(params.id as string)
    }
  }, [params.id])

  const handleSubmit = () => {
    if (!enrichedQuestions || enrichedQuestions.length === 0) return

    let correctCount = 0
    enrichedQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++
      }
    })

    const finalScore = (correctCount / enrichedQuestions.length) * 100
    setScore(finalScore)
    setShowResults(true)
    
    if (finalScore >= 60) {
      toast.success(`Félicitations ! Vous avez réussi avec $\{finalScore.toFixed(1)\}%`)
    } else {
      toast.error(`Score: $\{finalScore.toFixed(1)\}% - Continuez vos efforts !`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `$\{mins\}:$\{secs.toString().padStart(2, "0")\}`
  }

  useEffect(() => {
    if (started && timeRemaining > 0 && !hasPDF && enrichedQuestions.length > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [started, timeRemaining, hasPDF, enrichedQuestions])
