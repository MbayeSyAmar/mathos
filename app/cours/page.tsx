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
      title: "Calcul dans ℝ",
      description: "Le calcul dans ℝ concerne les opérations et propriétés des nombres réels, incluant l’addition, la multiplication, les fractions, et les manipulations algébriques et analytiques.",
      image: "/images/exo.jpg",
      duration: "2h",
    },
    {
      id: 14,
      title: "Calcul Vectoriel",
      description: "Opérations vectorielles dans le plan",
      image: "/images/exo.jpg",
      duration: "2h",
    },
    {
      id: 15,
      title: "Les équations du second degré",
      description: "Les équations du second degré sont des équations polynomiales de degré 2, résolues généralement par factorisation, discriminant ou formule quadratique.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 16,
      title: "Le Barycentre",
      description: "Le barycentre est le point d’équilibre d’un système de points pondérés, représentant leur « centre de gravité » en géométrie.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 17,
      title: "Les systèmes d'équations",
      description: "Les systèmes d’équations sont des ensembles de plusieurs équations dont il faut trouver simultanément les valeurs des inconnues qui les satisfont toutes.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 18,
      title: "Angles orientés et Trigonométrie",
      description: "Les angles orientés sont des angles mesurés dans le sens trigonométrique, et la trigonométrie étudie les relations entre les angles et les côtés des triangles.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
     {
      id: 19,
      title: "Fonctions numériques",
      description: "Les fonctions numériques sont des relations entre un ensemble de nombres et un autre, souvent représentées par des graphiques.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    
  ],
  "1ère": [
    {
      id: 20,
      title: "Les Polynomes (1s1)",
      description: "Étude des polynômes, leurs propriétés et factorisation",
      image: "/images/exo.jpg",
      duration: "2h",
    },
    {
      id: 21,
      title: "Angles orientés et Trigonométrie (1s1)",
      description: "Étude des angles orientés et des fonctions trigonométriques.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 22,
      title: "Denombrement (1s1)",
      description: "Le dénombrement étudie les méthodes permettant de compter le nombre de cas possibles dans une situation donnée, en utilisant des règles comme le produit et la somme.",
      image: "/images/exo.jpg",
      duration: "3h15",
    },
    {
      id: 23,
      title: "Derivation (1s1)",
      description: "Le calcul des dérivées étudie les variations des fonctions et leurs applications.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 24,
      title: "Equations, inéquations et systèmes (1s1)",
      description: "Les équations, inéquations et systèmes sont des outils mathématiques permettant de modéliser et résoudre des problèmes variés.",
      image: "/images/exo.jpg",
      duration: "3h15",
    },
    {
      id: 25,
      title: "Fonctions numériques (1s1)",
      description: "Les fonctions numériques sont des relations entre un ensemble de nombres et un autre, souvent représentées par des graphiques.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 26,
      title: "Identités et relations trigonométriques (1s1)",
      description: "Les identités et relations trigonométriques sont des égalités impliquant des fonctions trigonométriques, essentielles pour résoudre des problèmes géométriques.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 27,
      title: "Limites et Continuité (1s1)",
      description: "Les limites et la continuité sont des concepts fondamentaux en analyse, permettant d'étudier le comportement des fonctions.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 28,
      title: "Primitives (1s1)",
      description: "Les primitives sont des fonctions dont la dérivée est donnée, essentielles pour le calcul intégral.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 29,
      title: "Produit scalaire (1s1)",
      description: "Le produit scalaire est une opération algébrique qui associe à deux vecteurs un nombre réel, essentiel en géométrie et en physique.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 30,
      title: "Suites numériques (1s1)",
      description: "Les suites numériques sont des applications de la notion de limite, permettant d'étudier le comportement des suites de nombres.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 31,
      title: "Transformations du Plan (1s1)",
      description: "Les transformations du plan étudient les mouvements et les déformations des figures géométriques dans le plan.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 32,
      title: "Polynômes (1s2)",
      description: "Les polynômes sont des expressions algébriques formées par la somme de termes, chacun étant le produit d'une constante et d'une variable élevée à une puissance.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 33,
      title: "Angles orientés et trigonométrie (1s2)",
      description: "Les angles orientés et la trigonométrie étudient les relations entre les angles et les longueurs dans les triangles.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 34,
      title: "Statistique descriptive (1s2)",
      description: "La statistique descriptive est une branche des statistiques qui se concentre sur la description et la synthèse des données.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 35,
      title: "Produit scalaire (1s2)",
      description: "Le produit scalaire est une opération algébrique qui associe à deux vecteurs un nombre réel, essentiel en géométrie et en physique.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 36,
      title: "Applications (1s1/s2)",
      description: "Une application est une relation qui associe à chaque élément d’un ensemble un unique élément d’un autre ensemble, traduisant une correspondance mathématique précise.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 37,
      title: "Suites numériques (1s2)",
      description: "Les suites numériques sont des applications de la notion de limite, permettant d'étudier le comportement des suites de nombres.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 38,
      title: "Dénombrement (1s2)",
      description: "Le dénombrement est une branche des mathématiques qui étudie les méthodes de comptage, essentielles en combinatoire.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 39,
      title: "Equations, inéquations et systèmes (1s2)",
      description: "Les équations, inéquations et systèmes consistent à déterminer les valeurs inconnues qui rendent vraies des égalités ou inégalités, seules ou combinées entre elles.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 40,
      title: "Fonctions numériques (1s2)",
      description: "Les fonctions numériques sont des relations qui associent à chaque nombre réel un unique nombre réel, permettant d'étudier les variations et les propriétés des fonctions.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 41,
      title: "Limites (1s2)",
      description: "Les limites sont des outils mathématiques permettant d'étudier le comportement des fonctions à l'approche d'un point ou à l'infini.",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
  ],
  Terminale: [
    {
      id: 42,
      title: "Arithmétique I(TS1)",
      description: "L’arithmétique étudie les propriétés des nombres entiers, notamment la divisibilité, les congruences, les nombres premiers et les opérations fondamentales.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 43,
      title: "Arithmétique II(TS1)",
      description: "L’arithmétique étudie les propriétés des nombres entiers, notamment la divisibilité, les congruences, les nombres premiers et les opérations fondamentales.",
      image: "/images/exo.jpg",
      duration: "4h45",
    },
    {
      id: 44,
      title: "Calcul intégral(TS1)",
      description: "Le calcul intégral étudie les intégrales de fonctions afin de calculer des aires, des volumes ou des valeurs moyennes dans des contextes continus.",
      image: "/images/exo.jpg",
      duration: "3h50",
    },
     {
      id: 45,
      title: "Derivations (TS1)",
      description: "Les dérivées sont des outils fondamentaux du calcul différentiel, permettant d'étudier les variations des fonctions.",
      image: "/images/exo.jpg",
      duration: "3h50",
    },
    {
      id: 46,
      title: "Equations différentielles (TS1)",
      description: "Les équations différentielles sont des outils mathématiques permettant de modéliser des phénomènes variés, en établissant des relations entre des fonctions et leurs dérivées.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
     {
      id: 46,
      title: "Fonctions exponentielles et Logarithmiques (TS1)",
      description: "Les fonctions exponentielles et logarithmiques sont des outils mathématiques essentiels, permettant de modéliser des phénomènes de croissance et de décroissance.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
     {
      id: 47,
      title: "Limites et continuité I(TS1)",
      description: "Les limites et la continuité sont des concepts fondamentaux en analyse, permettant d'étudier le comportement des fonctions à l'approche d'un point.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 48,
      title: "Limites et continuité II (TS1)",
      description: "Les limites et la continuité sont des concepts fondamentaux en analyse, permettant d'étudier le comportement des fonctions à l'approche d'un point.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 49,
      title: "Nombres complexes (TS1)",
      description: "Les nombres complexes sont des extensions des nombres réels, permettant de résoudre des équations qui n'ont pas de solutions réelles.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 50,
      title: "Probabilités (TS1)",
      description: "Les probabilités sont des outils mathématiques permettant de modéliser l'incertitude et de quantifier les risques.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 51,
      title: "Transformations (TS1)",
      description: "Les transformations sont des outils mathématiques permettant de modifier des fonctions tout en préservant certaines de leurs propriétés.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 52,
      title: "Suites numériques (TS1)",
      description: "Les suites numériques sont des outils fondamentaux en analyse, permettant d'étudier le comportement des fonctions à l'approche d'un point.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 53,
      title: "Calcul Intégral (TS2)",
      description: "Le calcul intégral est une branche des mathématiques qui étudie les intégrales et leurs applications.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 54,
      title: "Equations différentielles (TS2)",
      description: "Les équations différentielles sont des outils mathématiques permettant de modéliser des phénomènes variés, en établissant des relations entre des fonctions et leurs dérivées.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 55,
      title: "Fonctions numériques (TS2)",
      description: "Les fonctions numériques sont des outils mathématiques permettant de modéliser des phénomènes variés.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 56,
      title: "Nombres complexes et similitudes (TS2)",
      description: "Les nombres complexes et les similitudes sont des concepts fondamentaux en mathématiques, permettant d'étudier des transformations et des relations entre des objets géométriques.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 57,
      title: "Probabilités (TS2)",
      description: "Les probabilités sont des outils mathématiques permettant de modéliser l'incertitude et de quantifier les risques.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 58,
      title: "Statistiques (TS2)",
      description: "Les statistiques sont des outils mathématiques permettant d'analyser et d'interpréter des données.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 59,
      title: "Suites numériques (TS2)",
      description: "Les suites numériques sont des outils fondamentaux en analyse, permettant d'étudier le comportement des fonctions à l'approche d'un point.",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
  ],
  Licence: [
    {
      id: 60,
      title: "Analyse réelle",
      description: "Suites et séries de fonctions",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h",
    },
    {
      id: 61,
      title: "Algèbre linéaire",
      description: "Espaces vectoriels et applications linéaires",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h",
    },
    {
      id: 62,
      title: "Probabilités",
      description: "Lois continues et théorèmes limites",
      image: "/placeholder.svg?height=200&width=400",
      duration: "5h15",
    },
  ],
  Master: [
    {
      id: 63,
      title: "Analyse fonctionnelle",
      description: "Espaces de Hilbert et opérateurs",
      image: "/placeholder.svg?height=200&width=400",
      duration: "8h",
    },
    {
      id: 64,
      title: "Géométrie différentielle",
      description: "Variétés différentielles et formes différentielles",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h30",
    },
    {
      id: 65,
      title: "Équations aux dérivées partielles",
      description: "Méthodes de résolution et applications",
      image: "/placeholder.svg?height=200&width=400",
      duration: "9h",
    },
  ],
  Prépa: [
    {
      id: 66,
      title: "Topologie",
      description: "Espaces métriques et topologiques",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h45",
    },
    {
      id: 67,
      title: "Réduction des endomorphismes",
      description: "Diagonalisation et trigonalisation",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h15",
    },
    {
      id: 68,
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
