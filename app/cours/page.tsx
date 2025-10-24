import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ArrowRight } from "lucide-react"

const levels = [
  { id: "college", name: "Collège", classes: ["6ème", "5ème", "4ème", "3ème"] },
  { id: "lycee", name: "Lycée", classes: ["2nde", "1ère", "Terminale"] },
  { id: "superieur", name: "Supérieur", classes: ["Licence", "Master", "Prépa"] },
]

interface Course {
  id: number
  title: string
  description: string
  image: string
  duration: string
}

type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale" | "Licence" | "Master" | "Prépa"

const coursesData: Record<ClasseKey, Course[]> = {
  "6ème": [
    {
      id: 1,
      title: "Nombres décimaux",
      description: "Opérations et propriétés des nombres décimaux",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 2,
      title: "Fractions",
      description: "Introduction aux fractions et opérations de base",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 3,
      title: "Géométrie plane",
      description: "Figures géométriques et leurs propriétés",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
  ],
  "5ème": [
    {
      id: 4,
      title: "Nombres relatifs",
      description: "Opérations sur les nombres positifs et négatifs",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
    {
      id: 5,
      title: "Calcul littéral",
      description: "Introduction aux expressions algébriques",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 6,
      title: "Triangles",
      description: "Propriétés des triangles et constructions",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
  ],
  "4ème": [
    {
      id: 7,
      title: "Puissances",
      description: "Calculs avec les puissances de 10",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h15",
    },
    {
      id: 8,
      title: "Théorème de Pythagore",
      description: "Applications et démonstrations",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h20",
    },
    {
      id: 9,
      title: "Proportionnalité",
      description: "Tableaux de proportionnalité et applications",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h50",
    },
  ],
  "3ème": [
    {
      id: 10,
      title: "Équations",
      description: "Résolution d'équations du premier degré",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h10",
    },
    {
      id: 11,
      title: "Fonctions linéaires",
      description: "Représentation graphique et propriétés",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h40",
    },
    {
      id: 12,
      title: "Trigonométrie",
      description: "Introduction au sinus, cosinus et tangente",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h15",
    },
  ],
  "2nde": [
    {
      id: 13,
      title: "Fonctions de référence",
      description: "Étude des fonctions carré, inverse et racine carrée",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h45",
    },
    {
      id: 14,
      title: "Vecteurs",
      description: "Opérations vectorielles dans le plan",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
    {
      id: 15,
      title: "Statistiques",
      description: "Indicateurs de position et de dispersion",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
  ],
  "1ère": [
    {
      id: 16,
      title: "Dérivation",
      description: "Calcul de dérivées et applications",
      image: "/placeholder.svg?height=200&width=400",
      duration: "5h",
    },
    {
      id: 17,
      title: "Suites numériques",
      description: "Suites arithmétiques et géométriques",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h30",
    },
    {
      id: 18,
      title: "Probabilités",
      description: "Variables aléatoires et lois de probabilité",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h15",
    },
  ],
  Terminale: [
    {
      id: 19,
      title: "Intégration",
      description: "Calcul d'intégrales et applications",
      image: "/placeholder.svg?height=200&width=400",
      duration: "5h30",
    },
    {
      id: 20,
      title: "Nombres complexes",
      description: "Opérations et applications géométriques",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h45",
    },
    {
      id: 21,
      title: "Logarithmes",
      description: "Fonctions logarithmiques et exponentielles",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h50",
    },
  ],
  Licence: [
    {
      id: 22,
      title: "Analyse réelle",
      description: "Suites et séries de fonctions",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h",
    },
    {
      id: 23,
      title: "Algèbre linéaire",
      description: "Espaces vectoriels et applications linéaires",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h",
    },
    {
      id: 24,
      title: "Probabilités",
      description: "Lois continues et théorèmes limites",
      image: "/placeholder.svg?height=200&width=400",
      duration: "5h15",
    },
  ],
  Master: [
    {
      id: 25,
      title: "Analyse fonctionnelle",
      description: "Espaces de Hilbert et opérateurs",
      image: "/placeholder.svg?height=200&width=400",
      duration: "8h",
    },
    {
      id: 26,
      title: "Géométrie différentielle",
      description: "Variétés différentielles et formes différentielles",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h30",
    },
    {
      id: 27,
      title: "Équations aux dérivées partielles",
      description: "Méthodes de résolution et applications",
      image: "/placeholder.svg?height=200&width=400",
      duration: "9h",
    },
  ],
  Prépa: [
    {
      id: 28,
      title: "Topologie",
      description: "Espaces métriques et topologiques",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h45",
    },
    {
      id: 29,
      title: "Réduction des endomorphismes",
      description: "Diagonalisation et trigonalisation",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h15",
    },
    {
      id: 30,
      title: "Intégrales multiples",
      description: "Calcul d'intégrales doubles et triples",
      image: "/placeholder.svg?height=200&width=400",
      duration: "5h45",
    },
  ],
}

export default function CoursPage() {
  return (
    <div className="container py-10">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nos Cours de Mathématiques</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Des cours structurés par niveau pour un apprentissage progressif et adapté à vos besoins.
        </p>
      </div>

      <Tabs defaultValue="college" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
                    <BookOpen className="h-4 w-4" />
                    <span>{classe}</span>
                  </Link>
                </Button>
              ))}
            </div>

            {level.classes.map((classe) => (
              <div key={classe} id={classe} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Classe de {classe}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesData[classe as ClasseKey]?.map((course) => (
                    <Card key={course.id} className="overflow-hidden group">
                      <div className="relative h-48">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h3 className="font-bold text-foreground text-xl">{course.title}</h3>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <p className="text-muted-foreground">{course.description}</p>
                        <div className="mt-2 text-sm text-muted-foreground">Durée: {course.duration}</div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/cours/${course.id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                          >
                            Voir le cours <ArrowRight className="ml-2 h-4 w-4" />
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
