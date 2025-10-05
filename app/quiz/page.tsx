"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrainCircuit, ArrowRight, Clock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const categories = [
  { id: "tous", name: "Tous les quiz" },
  { id: "college", name: "Collège" },
  { id: "lycee", name: "Lycée" },
  { id: "concours", name: "Préparation concours" },
]

const quizData = [
  {
    id: 1,
    title: "Nombres et calculs",
    description: "Testez vos connaissances sur les opérations de base",
    image: "/placeholder.svg?height=200&width=400",
    level: "Collège",
    difficulty: "Facile",
    time: "15 min",
    questions: 10,
    popularity: 4.8,
    category: "college",
  },
  {
    id: 2,
    title: "Géométrie plane",
    description: "Quiz sur les figures géométriques et leurs propriétés",
    image: "/placeholder.svg?height=200&width=400",
    level: "Collège",
    difficulty: "Moyen",
    time: "20 min",
    questions: 15,
    popularity: 4.5,
    category: "college",
  },
  {
    id: 3,
    title: "Fonctions et dérivées",
    description: "Évaluez votre maîtrise du calcul différentiel",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Difficile",
    time: "25 min",
    questions: 12,
    popularity: 4.7,
    category: "lycee",
  },
  {
    id: 4,
    title: "Suites numériques",
    description: "Quiz sur les suites arithmétiques et géométriques",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Moyen",
    time: "20 min",
    questions: 15,
    popularity: 4.3,
    category: "lycee",
  },
  {
    id: 5,
    title: "Probabilités",
    description: "Testez vos connaissances en probabilités",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Difficile",
    time: "30 min",
    questions: 15,
    popularity: 4.6,
    category: "lycee",
  },
  {
    id: 6,
    title: "Préparation Brevet",
    description: "Quiz complet pour préparer l'épreuve de mathématiques du Brevet",
    image: "/placeholder.svg?height=200&width=400",
    level: "Collège",
    difficulty: "Moyen",
    time: "45 min",
    questions: 25,
    popularity: 4.9,
    category: "concours",
  },
  {
    id: 7,
    title: "Préparation Bac",
    description: "Entraînement complet pour le Baccalauréat",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Difficile",
    time: "60 min",
    questions: 30,
    popularity: 4.8,
    category: "concours",
  },
  {
    id: 8,
    title: "Prépa Grandes Écoles",
    description: "Quiz de niveau prépa pour les concours d'ingénieurs",
    image: "/placeholder.svg?height=200&width=400",
    level: "Supérieur",
    difficulty: "Très difficile",
    time: "90 min",
    questions: 20,
    popularity: 4.7,
    category: "concours",
  },
  {
    id: 9,
    title: "Algèbre linéaire",
    description: "Quiz sur les espaces vectoriels et applications linéaires",
    image: "/placeholder.svg?height=200&width=400",
    level: "Supérieur",
    difficulty: "Difficile",
    time: "40 min",
    questions: 15,
    popularity: 4.4,
    category: "concours",
  },
]

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Facile":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "Moyen":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
    case "Difficile":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    case "Très difficile":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
    default:
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
  }
}

const getLevelColor = (level) => {
  switch (level) {
    case "Collège":
      return "bg-blue-500/10 text-blue-500"
    case "Lycée":
      return "bg-green-500/10 text-green-500"
    case "Supérieur":
      return "bg-purple-500/10 text-purple-500"
    default:
      return "bg-gray-500/10 text-gray-500"
  }
}

export default function QuizPage() {
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
      <motion.div className="space-y-4 text-center mb-10" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Quiz de Mathématiques</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Testez vos connaissances avec nos quiz interactifs et mesurez votre progression.
        </p>
      </motion.div>

      <Tabs defaultValue="tous" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizData
                .filter((quiz) => category.id === "tous" || quiz.category === category.id)
                .map((quiz) => (
                  <motion.div key={quiz.id} initial="hidden" animate="visible" variants={fadeIn}>
                    <Card className="overflow-hidden group h-full flex flex-col">
                      <div className="relative h-48">
                        <Image
                          src={quiz.image || "/placeholder.svg"}
                          alt={quiz.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h3 className="font-bold text-foreground text-xl">{quiz.title}</h3>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Badge className={`${getDifficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</Badge>
                          <Badge className={`${getLevelColor(quiz.level)}`}>{quiz.level}</Badge>
                        </div>
                      </div>
                      <CardContent className="pt-4 flex-grow">
                        <p className="text-muted-foreground">{quiz.description}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {quiz.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BrainCircuit className="mr-1 h-4 w-4" />
                            {quiz.questions} questions
                          </div>
                          <div className="flex items-center text-sm text-yellow-500">
                            <Star className="mr-1 h-4 w-4 fill-yellow-500" />
                            {quiz.popularity}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/quiz/${quiz.id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                          >
                            Commencer le quiz <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
