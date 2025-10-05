import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Youtube, ArrowRight, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "tous", name: "Toutes les vidéos" },
  { id: "cours", name: "Cours" },
  { id: "exercices", name: "Exercices résolus" },
  { id: "methodes", name: "Méthodes" },
  { id: "concours", name: "Préparation concours" },
]

const videosData = [
  {
    id: 1,
    title: "Les nombres complexes - Partie 1",
    description: "Introduction aux nombres complexes et opérations de base",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "cours",
    duration: "15:24",
    views: 12540,
    date: "15 mars 2023",
  },
  {
    id: 2,
    title: "Résolution d'équations du second degré",
    description: "Méthodes et astuces pour résoudre rapidement les équations",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "exercices",
    duration: "18:36",
    views: 8750,
    date: "22 avril 2023",
  },
  {
    id: 3,
    title: "Comment réussir en mathématiques ?",
    description: "Conseils pratiques pour progresser efficacement",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "methodes",
    duration: "12:45",
    views: 15230,
    date: "10 mai 2023",
  },
  {
    id: 4,
    title: "Préparation au Brevet - Géométrie",
    description: "Révisions complètes pour l'épreuve de mathématiques",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "concours",
    duration: "25:18",
    views: 9870,
    date: "5 juin 2023",
  },
  {
    id: 5,
    title: "Les intégrales - Cours complet",
    description: "Tout ce qu'il faut savoir sur le calcul intégral",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "cours",
    duration: "32:10",
    views: 7650,
    date: "18 juillet 2023",
  },
  {
    id: 6,
    title: "Exercices corrigés sur les suites",
    description: "Résolution détaillée d'exercices sur les suites numériques",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "exercices",
    duration: "28:45",
    views: 6320,
    date: "3 août 2023",
  },
  {
    id: 7,
    title: "Techniques de mémorisation en mathématiques",
    description: "Comment retenir efficacement les formules et théorèmes",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "methodes",
    duration: "14:20",
    views: 11450,
    date: "12 septembre 2023",
  },
  {
    id: 8,
    title: "Préparation au Bac - Analyse",
    description: "Révisions complètes pour l'épreuve de mathématiques",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "concours",
    duration: "35:52",
    views: 13780,
    date: "25 octobre 2023",
  },
  {
    id: 9,
    title: "Les probabilités - Cours complet",
    description: "Tout ce qu'il faut savoir sur les probabilités",
    thumbnail: "/placeholder.svg?height=200&width=400",
    category: "cours",
    duration: "29:15",
    views: 8940,
    date: "8 novembre 2023",
  },
]

const getCategoryColor = (category) => {
  switch (category) {
    case "cours":
      return "bg-blue-500/10 text-blue-500"
    case "exercices":
      return "bg-green-500/10 text-green-500"
    case "methodes":
      return "bg-orange-500/10 text-orange-500"
    case "concours":
      return "bg-purple-500/10 text-purple-500"
    default:
      return "bg-gray-500/10 text-gray-500"
  }
}

const formatViews = (views) => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views
}

export default function VideosPage() {
  return (
    <div className="container py-10">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Vidéos Mathosphère</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Découvrez nos vidéos explicatives pour comprendre les concepts mathématiques.
        </p>
      </div>

      <Tabs defaultValue="tous" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosData
                .filter((video) => category.id === "tous" || video.category === category.id)
                .map((video) => (
                  <Card key={video.id} className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(video.category)}`}>
                          {categories.find((c) => c.id === video.category)?.name || video.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-white text-sm flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-primary text-primary-foreground rounded-full p-3">
                          <Youtube className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Eye className="mr-1 h-4 w-4" />
                          {formatViews(video.views)} vues
                        </div>
                        <div>{video.date}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/videos/${video.id}`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          Regarder <ArrowRight className="ml-2 h-4 w-4" />
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
