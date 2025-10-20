import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const year = new Date().getFullYear()
const lastYear = year - 1
const currentYear = year 

const categories = [
  { id: "tous", name: "Tous les articles" },
  { id: "methodes", name: "Méthodes" },
  { id: "concours", name: "Concours" },
  { id: "college", name: "Collège" },
]

const blogData = [
  {
    slug: "reussir-en-maths",
    title: "Comment réussir en mathématiques ? 10 habitudes qui marchent",
    description: "Organisation, mémorisation active et entraînement ciblé: le trio gagnant.",
    image: "images/reussirenmaths.jpg",
    category: "methodes",
    date: `15 septembre ${currentYear}`,
    author: "Mamadou Ndao",
    readTime: "9 min",
  },
  {
    slug: "brevet-maths-guide",
    title: "Préparer le Brevet des collèges en mathématiques",
    description: "Guide complet pour réviser et réussir l'épreuve de mathématiques du Brevet",
    image: "/images/brevet.jpg",
    category: "concours",
    date: `22 septembre ${currentYear}`,
    author: "Pape Baba Sylla",
    readTime: "12 min",
  },
  {
    slug: "olympiades-maths",
    title: "Préparer les Olympiades de mathématiques",
    description: "Curiosité, rigueur et créativité: votre boîte à outils pour les problèmes ouverts.",
    image: "/images/olymp.jpg",
    category: "concours",
    date: `13 septembre ${currentYear}`,
    author: "Mame Goumba Amar",
    readTime: "11 min",
  },
  {
    slug: "bac-maths-guide",
    title: "Réussir l'épreuve de mathématiques du Baccalauréat",
    description: "Stratégies par type d'exercice et gestion du temps pour le jour J.",
    image: "/images/bac.jpeg",
    category: "concours",
    date: `25 septembre ${currentYear}`,
    author: "Serigne Lo",
    readTime: "13 min",
  },
  {
    slug: "calcul-mental-techniques",
    title: "Calcul mental: techniques rapides et entraînement quotidien",
    description: "Trucs et astuces pour gagner en vitesse et en précision.",
    image: "/images/mental.jpg",
    category: "college",
    date: `10 septembre ${currentYear}`,
    author: "Algassimou Bah",
    readTime: "8 min",
  },
  {
    slug: "probabilites-intro",
    title: "Comprendre les probabilités: de l’intuition aux calculs",
    description: "Expériences aléatoires, arbres, lois usuelles: les bases solides.",
    image: "/images/prob.jpg",
    category: "probas",
    date: `12 septembre ${currentYear}`,
    author: "Ibrahima Sow",
    readTime: "10 min",
  },
  {
    slug: "geometrie-analytique",
    title: "Géométrie analytique: droites, cercles et stratégies",
    description: "Tout pour maîtriser les équations de droites et de cercles en repère.",
    image: "/images/geometrie.png",
    category: "geometrie",
    date: `06 septembre ${currentYear}`,
    author: "Moustapha Diagne",
    readTime: "9 min",
  },
  {
    slug: "algorithmique-python-college",
    title: "Initiation à l’algorithmique et à Python (Pour les Curieux)",
    description: "Variables, boucles, conditions et premiers programmes utiles.",
    image: "/images/python.jpg",
    category: "programmation",
    date: `10 septembre ${currentYear}`,
    author: "Jonas John Athnase Senghor",
    readTime: "10 min",
  },
  {
    slug: "fonctions-lycee",
    title: "Fonctions au lycée: ln, exp",
    description: "Les réflexes pour analyser, calculer et justifier rapidement.",
    image: "/images/ln.png",
    category: "algebre",
    date: `18 septembre ${currentYear}`,
    author: "Boubacar Sidibe",
    readTime: "12 min",
  },
  {
    slug: "statistiques-lycee",
    title: "Statistiques: moyenne, médiane, écart-type et interprétation",
    description: "De la lecture d’un tableau à l’analyse critique de données.",
    image: "/images/stat.png",
    category: "statistiques",
    date: `09 septembre ${currentYear}`,
    author: "Mary Sadio Toure",
    readTime: "9 min",
  },
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case "methodes":
      return "bg-blue-500/10 text-blue-500"
    case "concours":
      return "bg-green-500/10 text-green-500"
    case "college":
      return "bg-amber-500/10 text-amber-500"
    case "programmation":
      return "bg-teal-500/10 text-teal-500"
    case "algebre":
      return "bg-rose-500/10 text-rose-500"
    case "geometrie":
      return "bg-purple-500/10 text-purple-500"
    case "probas":
      return "bg-indigo-500/10 text-indigo-500"
    case "statistiques":
      return "bg-emerald-500/10 text-emerald-500"
    default:
      return "bg-gray-500/10 text-gray-500"
  }
}

export default function BlogPage() {
  return (
    <div className="container py-10">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Blog Mathosphère</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Articles, conseils et histoires sur le monde fascinant des mathématiques.
        </p>
      </div>

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
              {blogData
                .filter((blog) => category.id === "tous" || blog.category === category.id)
                .map((blog) => (
                  <Card
                    key={blog.slug}
                    className="overflow-hidden group h-full flex flex-col border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="relative h-48">
                      <Image
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(blog.category)} font-medium`}>
                          {categories.find((c) => c.id === blog.category)?.name || blog.category}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-5">
                      <CardTitle className="text-xl font-bold leading-tight text-foreground hover:text-primary transition-colors">
                        <Link href={`/blog/${blog.slug}`} className="hover:underline">
                          {blog.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 flex-grow">
                      <CardDescription className="text-base text-muted-foreground mb-4">
                        {blog.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-auto pt-2 border-t">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-primary" />
                          {blog.date}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4 text-primary" />
                          {blog.author}
                        </div>
                        <div className="font-medium">Lecture: {blog.readTime}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Link href={`/blog/${blog.slug}`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}