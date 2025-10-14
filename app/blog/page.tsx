import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "tous", name: "Tous les articles" },
  { id: "methodes", name: "Méthodes" },
  { id: "concours", name: "Concours" },
  { id: "histoire", name: "Histoire des maths" },
]

const blogData = [
  {
    id: 1,
    title: "Comment réussir en mathématiques ?",
    description: "Découvrez les meilleures méthodes pour progresser efficacement en mathématiques",
    image: "/placeholder.svg?height=200&width=400",
    category: "methodes",
    date: "15 mars 2023",
    author: "Marie Dupont",
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Préparer le Brevet des collèges",
    description: "Guide complet pour réviser et réussir l'épreuve de mathématiques du Brevet",
    image: "/placeholder.svg?height=200&width=400",
    category: "concours",
    date: "22 avril 2023",
    author: "Thomas Martin",
    readTime: "12 min",
  },
  {
    id: 3,
    title: "La vie d'Euler",
    description: "Biographie du mathématicien Leonhard Euler et ses contributions majeures",
    image: "/placeholder.svg?height=200&width=400",
    category: "histoire",
    date: "10 mai 2023",
    author: "Sophie Leclerc",
    readTime: "15 min",
  },
  {
    id: 4,
    title: "Mémoriser les formules mathématiques",
    description: "Techniques de mémorisation efficaces pour retenir les formules complexes",
    image: "/placeholder.svg?height=200&width=400",
    category: "methodes",
    date: "5 juin 2023",
    author: "Paul Dubois",
    readTime: "10 min",
  },
  {
    id: 5,
    title: "Préparer les Olympiades de mathématiques",
    description: "Conseils et exercices pour se préparer aux compétitions mathématiques",
    image: "/placeholder.svg?height=200&width=400",
    category: "concours",
    date: "18 juillet 2023",
    author: "Émilie Rousseau",
    readTime: "14 min",
  },
  {
    id: 6,
    title: "L'histoire des nombres complexes",
    description: "De l'impossibilité apparente à l'outil mathématique indispensable",
    image: "/placeholder.svg?height=200&width=400",
    category: "histoire",
    date: "3 août 2023",
    author: "Marc Leroy",
    readTime: "12 min",
  },
  {
    id: 7,
    title: "Gérer son temps pendant les examens",
    description: "Stratégies pour optimiser son temps lors des épreuves de mathématiques",
    image: "/placeholder.svg?height=200&width=400",
    category: "methodes",
    date: "12 septembre 2023",
    author: "Julie Moreau",
    readTime: "9 min",
  },
  {
    id: 8,
    title: "Préparer le Baccalauréat",
    description: "Guide complet pour réviser l'épreuve de mathématiques du Bac",
    image: "/placeholder.svg?height=200&width=400",
    category: "concours",
    date: "25 octobre 2023",
    author: "Nicolas Petit",
    readTime: "16 min",
  },
  {
    id: 9,
    title: "Les femmes qui ont révolutionné les mathématiques",
    description: "Portraits de mathématiciennes exceptionnelles à travers l'histoire",
    image: "/placeholder.svg?height=200&width=400",
    category: "histoire",
    date: "8 novembre 2023",
    author: "Camille Durand",
    readTime: "18 min",
  },
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case "methodes":
      return "bg-blue-500/10 text-blue-500"
    case "concours":
      return "bg-green-500/10 text-green-500"
    case "histoire":
      return "bg-purple-500/10 text-purple-500"
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
                    key={blog.id}
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
                        <Link href={`/blog/${blog.id}`} className="hover:underline">
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
                      <Link href={`/blog/${blog.id}`} className="w-full">
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
