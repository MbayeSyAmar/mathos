"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BrainCircuit,
  ArrowRight,
  Clock,
  Star,
  Search,
  Target,
  Zap,
  Award,
  TrendingUp,
  GraduationCap,
  Trophy,
  CheckCircle,
} from "lucide-react"
import { getQuizImage, getCourseImage } from "@/lib/utils/course-images"
import { getAllStaticQuiz, type StaticQuiz } from "@/lib/services/static-quiz.service"
import { motion } from "framer-motion"

const levels = [
  { id: "college", name: "Collège", classes: ["Collège"], icon: "📚", color: "from-blue-500 to-cyan-500" },
  { id: "lycee", name: "Lycée", classes: ["Lycée"], icon: "🎓", color: "from-purple-500 to-pink-500" },
  { id: "concours", name: "Concours", classes: ["Concours"], icon: "🏆", color: "from-orange-500 to-red-500" },
]

type ClasseKey = "Collège" | "Lycée" | "Concours"

const rawQuizzes = getAllStaticQuiz()
const quizData: Record<ClasseKey, StaticQuiz[]> = {
  Collège: rawQuizzes.filter((quiz) => quiz.category === "college"),
  Lycée: rawQuizzes.filter((quiz) => quiz.category === "lycee"),
  Concours: rawQuizzes.filter((quiz) => quiz.category === "concours"),
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Facile":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "Moyen":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "Difficile":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "Très difficile":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }
}

export default function QuizPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("college")

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
        staggerChildren: 0.08,
      },
    },
  }

  const getTotalQuizzes = () => {
    return Object.values(quizData).reduce((total, quizzes) => total + quizzes.length, 0)
  }

  const getTotalQuestions = () => {
    return Object.values(quizData).reduce(
      (total, quizzes) => total + quizzes.reduce((sum, quiz) => sum + quiz.questions, 0),
      0
    )
  }

  const filteredQuizzes = (classe: ClasseKey) => {
    const quizzes = quizData[classe] || []
    if (!searchQuery) return quizzes
    return quizzes.filter((quiz) => {
      const haystack = `${quiz.title} ${quiz.description} ${quiz.difficulty} ${quiz.level}`.toLowerCase()
      return haystack.includes(searchQuery.toLowerCase())
    })
  }

  const currentLevel = levels.find((l) => l.id === selectedLevel) || levels[0]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10">
          <motion.div
            className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-purple-600 p-4 rounded-2xl">
                <BrainCircuit className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Quiz de Mathématiques
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Testez vos connaissances avec nos quiz interactifs et mesurez votre progression.
                Plus de {getTotalQuizzes()} quiz et {getTotalQuestions()}+ questions pour tous les niveaux.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalQuizzes()}+ quiz</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{getTotalQuestions()}+ questions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Award className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Tous niveaux</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barre de recherche */}
      <div className="container -mt-8 relative z-20 mb-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un quiz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="container pb-10 space-y-8">
        {/* Tabs pour les niveaux */}
        <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-2 bg-muted/50">
            {levels.map((level) => (
              <TabsTrigger
                key={level.id}
                value={level.id}
                className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <span className="text-2xl">{level.icon}</span>
                <span className="font-semibold">{level.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {level.classes.length} classes
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {levels.map((level) => (
            <TabsContent key={level.id} value={level.id} className="mt-6 space-y-8">
              {/* Navigation rapide des classes */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {level.classes.map((classe) => (
                  <motion.a
                    key={classe}
                    href={`#${classe}`}
                    variants={fadeIn}
                    className="group relative"
                  >
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-6 rounded-full border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm hover:shadow-md"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span className="font-semibold">{classe}</span>
                      <Badge variant="secondary" className="ml-2">
                        {quizData[classe as ClasseKey]?.length || 0}
                      </Badge>
                    </Button>
                  </motion.a>
                ))}
              </motion.div>

              {/* Liste des quiz par classe */}
              {level.classes.map((classe) => {
                const quizzes = filteredQuizzes(classe as ClasseKey)
                if (quizzes.length === 0 && searchQuery) return null

                return (
                  <motion.div
                    key={classe}
                    id={classe}
                    className="space-y-6 scroll-mt-20"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${level.color} shadow-lg`}>
                          <BrainCircuit className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Quiz {classe}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {quizzes.length} quiz{quizzes.length > 1 ? " disponibles" : " disponible"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {quizzes.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Aucun quiz trouvé</p>
                          <p className="text-muted-foreground">
                            Aucun quiz ne correspond à votre recherche "{searchQuery}"
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {quizzes.map((quiz) => {
                          const quizImage =
                            quiz.image && !quiz.image.includes("placeholder")
                              ? quiz.image
                              : getQuizImage(quiz.level)

                          return (
                            <motion.div key={quiz.id} variants={fadeIn}>
                              <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                                <div className="relative h-64 overflow-hidden">
                                  <Image
                                    src={quizImage}
                                    alt={quiz.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  {/* Badge de difficulté */}
                                  <div className="absolute top-4 right-4">
                                    <Badge
                                      className={`${getDifficultyColor(quiz.difficulty)} backdrop-blur-md shadow-lg border-2`}
                                    >
                                      {quiz.difficulty}
                                    </Badge>
                                  </div>

                                  {/* Badge de classe */}
                                  <div className="absolute top-4 left-4">
                                    <Badge className="bg-background/95 backdrop-blur-md text-foreground shadow-lg border-2 border-primary/20">
                                      {quiz.level}
                                    </Badge>
                                  </div>

                                  {/* Contenu overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="font-bold text-foreground text-xl md:text-2xl mb-3 drop-shadow-2xl line-clamp-2">
                                      {quiz.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{quiz.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <BrainCircuit className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{quiz.questions} Q</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                                        <Star className="h-4 w-4 fill-white" />
                                        <span className="font-semibold text-sm">{quiz.popularity}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Effet de brillance au survol */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <CardContent className="pt-6 flex-grow">
                                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                    {quiz.description}
                                  </p>
                                </CardContent>

                                <CardFooter className="pt-4 pb-6">
                                  <Button
                                    className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg"
                                    variant="outline"
                                    asChild
                                  >
                                    <Link href={`/quiz/${quiz.id}`}>
                                      <span>Commencer le quiz</span>
                                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
