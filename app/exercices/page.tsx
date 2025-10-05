import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenTool, ArrowRight, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const levels = [
  { id: "college", name: "Collège", classes: ["6ème", "5ème", "4ème", "3ème"] },
  { id: "lycee", name: "Lycée", classes: ["2nde", "1ère", "Terminale"] },
]

const exercisesData = {
  "6ème": [
    {
      id: 1,
      title: "Opérations sur les décimaux",
      description: "Exercices d'addition, soustraction, multiplication et division",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "30 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 2,
      title: "Fractions simples",
      description: "Comparaison et opérations sur les fractions",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 3,
      title: "Périmètres et aires",
      description: "Calcul de périmètres et d'aires de figures simples",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "40 min",
      exercises: 10,
      hasCorrection: true,
    },
  ],
  "5ème": [
    {
      id: 4,
      title: "Nombres relatifs",
      description: "Addition et soustraction de nombres relatifs",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "35 min",
      exercises: 14,
      hasCorrection: true,
    },
    {
      id: 5,
      title: "Expressions littérales",
      description: "Calcul et simplification d'expressions",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "50 min",
      exercises: 8,
      hasCorrection: true,
    },
    {
      id: 6,
      title: "Symétries",
      description: "Constructions de figures symétriques",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "40 min",
      exercises: 12,
      hasCorrection: false,
    },
  ],
  "4ème": [
    {
      id: 7,
      title: "Calcul littéral",
      description: "Développement et factorisation d'expressions",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 8,
      title: "Théorème de Pythagore",
      description: "Applications du théorème de Pythagore",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "55 min",
      exercises: 8,
      hasCorrection: true,
    },
    {
      id: 9,
      title: "Proportionnalité",
      description: "Problèmes de proportionnalité et pourcentages",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "40 min",
      exercises: 12,
      hasCorrection: true,
    },
  ],
  "3ème": [
    {
      id: 10,
      title: "Équations",
      description: "Résolution d'équations du premier degré",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 11,
      title: "Fonctions linéaires",
      description: "Représentation graphique et calculs",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "60 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 12,
      title: "Trigonométrie",
      description: "Calculs trigonométriques dans le triangle rectangle",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "55 min",
      exercises: 12,
      hasCorrection: true,
    },
  ],
  "2nde": [
    {
      id: 13,
      title: "Fonctions de référence",
      description: "Étude des fonctions carré, inverse et racine carrée",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 14,
      title: "Vecteurs",
      description: "Opérations vectorielles dans le plan",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "60 min",
      exercises: 8,
      hasCorrection: true,
    },
    {
      id: 15,
      title: "Statistiques",
      description: "Indicateurs de position et de dispersion",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 12,
      hasCorrection: false,
    },
  ],
  "1ère": [
    {
      id: 16,
      title: "Dérivation",
      description: "Calcul de dérivées et applications",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 17,
      title: "Suites numériques",
      description: "Suites arithmétiques et géométriques",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "55 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 18,
      title: "Probabilités",
      description: "Variables aléatoires et lois de probabilité",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 10,
      hasCorrection: true,
    },
  ],
  Terminale: [
    {
      id: 19,
      title: "Intégration",
      description: "Calcul d'intégrales et applications",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "75 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 20,
      title: "Nombres complexes",
      description: "Opérations et applications géométriques",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 21,
      title: "Logarithmes",
      description: "Fonctions logarithmiques et exponentielles",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "60 min",
      exercises: 15,
      hasCorrection: true,
    },
  ],
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Facile":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "Moyen":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
    case "Difficile":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    default:
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
  }
}

export default function ExercicesPage() {
  return (
    <div className="container py-10">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Exercices de Mathématiques</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Pratiquez avec nos exercices interactifs et téléchargeables pour renforcer vos connaissances.
        </p>
      </div>

      <Tabs defaultValue="college" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {levels.map((level) => (
            <TabsTrigger key={level.id} value={level.id}>
              {level.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {levels.map((level) => (
          <TabsContent key={level.id} value={level.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {level.classes.map((classe) => (
                <Button key={classe} variant="outline" className="h-auto py-4 justify-start gap-2" asChild>
                  <Link href={`#${classe}`}>
                    <PenTool className="h-4 w-4" />
                    <span>{classe}</span>
                  </Link>
                </Button>
              ))}
            </div>

            {level.classes.map((classe) => (
              <div key={classe} id={classe} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <PenTool className="h-6 w-6 text-primary" />
                  Exercices de {classe}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercisesData[classe]?.map((exercise) => (
                    <Card key={exercise.id} className="overflow-hidden group">
                      <div className="relative h-48">
                        <Image
                          src={exercise.image || "/placeholder.svg"}
                          alt={exercise.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h3 className="font-bold text-foreground text-xl">{exercise.title}</h3>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getDifficultyColor(exercise.difficulty)}`}>{exercise.difficulty}</Badge>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <p className="text-muted-foreground">{exercise.description}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {exercise.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <PenTool className="mr-1 h-4 w-4" />
                            {exercise.exercises} exercices
                          </div>
                          {exercise.hasCorrection && (
                            <div className="flex items-center text-sm text-green-500">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Avec correction
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/exercices/${exercise.id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                          >
                            Commencer <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
