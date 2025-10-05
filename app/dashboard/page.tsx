"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  PenTool,
  BrainCircuit,
  BookText,
  Youtube,
  ArrowRight,
  Clock,
  CheckCircle,
  Trophy,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function DashboardPage() {
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
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container py-10">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace personnel, Marie Dupont</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/mon-profil">Mon profil</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/encadrement">Encadrement personnalisé</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Progression globale</CardTitle>
              <CardDescription>Votre avancement dans tous les cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cours suivis</span>
                    <span className="text-sm text-muted-foreground">12/35</span>
                  </div>
                  <Progress value={34} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Exercices complétés</span>
                    <span className="text-sm text-muted-foreground">45/120</span>
                  </div>
                  <Progress value={37} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quiz réussis</span>
                    <span className="text-sm text-muted-foreground">8/15</span>
                  </div>
                  <Progress value={53} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Statistiques</CardTitle>
              <CardDescription>Vos performances récentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">24h</span>
                  <span className="text-xs text-muted-foreground text-center">Temps d'étude total</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-2xl font-bold">85%</span>
                  <span className="text-xs text-muted-foreground text-center">Taux de réussite</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                  <span className="text-2xl font-bold">12</span>
                  <span className="text-xs text-muted-foreground text-center">Badges obtenus</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold">5</span>
                  <span className="text-xs text-muted-foreground text-center">Cours en cours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Prochains objectifs</CardTitle>
              <CardDescription>À compléter cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Terminer le cours sur les intégrales</p>
                    <p className="text-xs text-muted-foreground">Échéance: 3 jours</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <PenTool className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Compléter les exercices sur les suites</p>
                    <p className="text-xs text-muted-foreground">Échéance: 5 jours</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Réussir le quiz sur les probabilités</p>
                    <p className="text-xs text-muted-foreground">Échéance: 7 jours</p>
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Voir tous les objectifs
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="cours" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="cours">Mes cours</TabsTrigger>
          <TabsTrigger value="exercices">Mes exercices</TabsTrigger>
          <TabsTrigger value="quiz">Mes quiz</TabsTrigger>
          <TabsTrigger value="favoris">Mes favoris</TabsTrigger>
        </TabsList>

        <TabsContent value="cours" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                id: 1,
                title: "Nombres complexes",
                description: "Opérations et applications géométriques",
                image: "/placeholder.svg?height=200&width=400",
                progress: 75,
                level: "Terminale",
              },
              {
                id: 2,
                title: "Intégrales",
                description: "Calcul d'intégrales et applications",
                image: "/placeholder.svg?height=200&width=400",
                progress: 30,
                level: "Terminale",
              },
              {
                id: 3,
                title: "Suites numériques",
                description: "Suites arithmétiques et géométriques",
                image: "/placeholder.svg?height=200&width=400",
                progress: 60,
                level: "1ère",
              },
            ].map((course) => (
              <motion.div key={course.id} variants={fadeIn}>
                <Card className="overflow-hidden group h-full flex flex-col">
                  <div className="relative h-40">
                    <Image
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-bold text-foreground text-lg">{course.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
                      {course.level}
                    </div>
                  </div>
                  <CardContent className="pt-4 flex-grow">
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progression</span>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Continuer <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="exercices" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                id: 1,
                title: "Dérivation",
                description: "Exercices sur le calcul de dérivées",
                image: "/placeholder.svg?height=200&width=400",
                completed: 8,
                total: 15,
                level: "1ère",
              },
              {
                id: 2,
                title: "Probabilités",
                description: "Exercices sur les variables aléatoires",
                image: "/placeholder.svg?height=200&width=400",
                completed: 5,
                total: 12,
                level: "Terminale",
              },
              {
                id: 3,
                title: "Géométrie dans l'espace",
                description: "Exercices sur les vecteurs et plans",
                image: "/placeholder.svg?height=200&width=400",
                completed: 10,
                total: 18,
                level: "Terminale",
              },
            ].map((exercise) => (
              <motion.div key={exercise.id} variants={fadeIn}>
                <Card className="overflow-hidden group h-full flex flex-col">
                  <div className="relative h-40">
                    <Image
                      src={exercise.image || "/placeholder.svg"}
                      alt={exercise.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-bold text-foreground text-lg">{exercise.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
                      {exercise.level}
                    </div>
                  </div>
                  <CardContent className="pt-4 flex-grow">
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progression</span>
                        <span className="text-sm font-medium">
                          {exercise.completed}/{exercise.total} exercices
                        </span>
                      </div>
                      <Progress value={(exercise.completed / exercise.total) * 100} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Continuer <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                id: 1,
                title: "Fonctions et dérivées",
                description: "Quiz sur le calcul différentiel",
                image: "/placeholder.svg?height=200&width=400",
                score: 85,
                questions: 15,
                level: "1ère",
              },
              {
                id: 2,
                title: "Suites numériques",
                description: "Quiz sur les suites arithmétiques et géométriques",
                image: "/placeholder.svg?height=200&width=400",
                score: 70,
                questions: 10,
                level: "1ère",
              },
              {
                id: 3,
                title: "Préparation Bac",
                description: "Quiz complet pour préparer le Baccalauréat",
                image: "/placeholder.svg?height=200&width=400",
                score: 65,
                questions: 30,
                level: "Terminale",
              },
            ].map((quiz) => (
              <motion.div key={quiz.id} variants={fadeIn}>
                <Card className="overflow-hidden group h-full flex flex-col">
                  <div className="relative h-40">
                    <Image
                      src={quiz.image || "/placeholder.svg"}
                      alt={quiz.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-bold text-foreground text-lg">{quiz.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
                      {quiz.level}
                    </div>
                  </div>
                  <CardContent className="pt-4 flex-grow">
                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Score</span>
                        <span className="text-sm font-medium">{quiz.score}%</span>
                      </div>
                      <Progress
                        value={quiz.score}
                        className={`${quiz.score >= 80 ? "bg-green-500" : quiz.score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      />
                      <p className="text-xs text-muted-foreground">{quiz.questions} questions</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Refaire le quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="favoris" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                id: 1,
                title: "Les nombres complexes",
                description: "Vidéo explicative sur les nombres complexes",
                image: "/placeholder.svg?height=200&width=400",
                type: "video",
                icon: Youtube,
                date: "15 mars 2023",
              },
              {
                id: 2,
                title: "Préparation au Bac",
                description: "Article avec conseils pour réussir l'épreuve",
                image: "/placeholder.svg?height=200&width=400",
                type: "article",
                icon: BookText,
                date: "22 avril 2023",
              },
              {
                id: 3,
                title: "Intégration",
                description: "Cours complet sur le calcul intégral",
                image: "/placeholder.svg?height=200&width=400",
                type: "cours",
                icon: BookOpen,
                date: "10 mai 2023",
              },
            ].map((favorite) => {
              const Icon = favorite.icon
              return (
                <motion.div key={favorite.id} variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-40">
                      <Image
                        src={favorite.image || "/placeholder.svg"}
                        alt={favorite.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-bold text-foreground text-lg">{favorite.title}</h3>
                      </div>
                      <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 rounded text-xs flex items-center">
                        <Icon className="h-3 w-3 mr-1" />
                        {favorite.type}
                      </div>
                    </div>
                    <CardContent className="pt-4 flex-grow">
                      <p className="text-sm text-muted-foreground">{favorite.description}</p>
                      <p className="mt-4 text-xs text-muted-foreground">Ajouté le {favorite.date}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        Consulter <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
