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
  BookOpen,
  ArrowRight,
  Clock,
  Eye,
  Search,
  Target,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  User,
  Tag,
  Sparkles,
} from "lucide-react"
import { getCourseImage } from "@/lib/utils/course-images"
import { motion } from "framer-motion"

const categories = [
  { id: "tous", name: "Tous les articles", icon: "📚", color: "from-blue-500 to-cyan-500" },
  { id: "methodes", name: "Méthodes", icon: "💡", color: "from-purple-500 to-pink-500" },
  { id: "astuces", name: "Astuces", icon: "✨", color: "from-orange-500 to-red-500" },
  { id: "actualites", name: "Actualités", icon: "📰", color: "from-green-500 to-emerald-500" },
  { id: "tutoriels", name: "Tutoriels", icon: "🎓", color: "from-indigo-500 to-blue-500" },
]

interface BlogPost {
  id: number
  title: string
  description: string
  image: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  views: number
  category: string
  tags: string[]
  featured?: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Astuces pour Réussir en Mathématiques",
    description: "Découvrez les secrets des meilleurs élèves en mathématiques ! Des techniques éprouvées pour améliorer vos notes et développer votre confiance en vous. Des conseils pratiques et applicables dès aujourd'hui.",
    image: "",
    author: "Marie Dubois",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "15 mars 2024",
    readTime: "8 min",
    views: 12540,
    category: "astuces",
    tags: ["Astuces", "Méthodes", "Réussite"],
    featured: true,
  },
  {
    id: 2,
    title: "Comment Mémoriser les Formules Mathématiques",
    description: "Apprenez des techniques de mémorisation efficaces pour retenir toutes vos formules mathématiques. Des méthodes visuelles, des astuces mnémotechniques et des stratégies de révision optimisées.",
    image: "",
    author: "Pierre Martin",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "12 mars 2024",
    readTime: "12 min",
    views: 9870,
    category: "methodes",
    tags: ["Mémoire", "Formules", "Révision"],
  },
  {
    id: 3,
    title: "Les Mathématiques dans la Vie Quotidienne",
    description: "Explorez comment les mathématiques sont présentes partout autour de nous ! De la cuisine à l'architecture, découvrez les applications fascinantes des mathématiques dans notre quotidien.",
    image: "",
    author: "Sophie Laurent",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "10 mars 2024",
    readTime: "10 min",
    views: 8560,
    category: "actualites",
    tags: ["Applications", "Vie quotidienne", "Mathématiques"],
  },
  {
    id: 4,
    title: "Tutoriel : Résoudre les Équations Complexes",
    description: "Un guide complet étape par étape pour maîtriser la résolution d'équations complexes. Avec des exemples pratiques, des exercices corrigés et des astuces pour éviter les erreurs courantes.",
    image: "",
    author: "Jean Dupont",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "8 mars 2024",
    readTime: "15 min",
    views: 11230,
    category: "tutoriels",
    tags: ["Équations", "Tutoriel", "Algèbre"],
  },
  {
    id: 5,
    title: "Les Meilleures Applications pour Apprendre les Maths",
    description: "Découvrez une sélection des meilleures applications mobiles et web pour apprendre et réviser les mathématiques. Des outils interactifs, ludiques et efficaces pour progresser rapidement.",
    image: "",
    author: "Emma Bernard",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "5 mars 2024",
    readTime: "9 min",
    views: 7430,
    category: "astuces",
    tags: ["Applications", "Technologie", "Apprentissage"],
  },
  {
    id: 6,
    title: "Comment Préparer un Examen de Mathématiques",
    description: "Une méthode complète pour bien préparer vos examens de mathématiques. Organisation, planning de révision, techniques de résolution et gestion du stress pour réussir avec confiance.",
    image: "",
    author: "Lucas Moreau",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "3 mars 2024",
    readTime: "11 min",
    views: 9230,
    category: "methodes",
    tags: ["Examen", "Préparation", "Réussite"],
  },
  {
    id: 7,
    title: "L'Histoire Fascinante des Mathématiques",
    description: "Plongez dans l'histoire passionnante des mathématiques ! Découvrez les grandes découvertes, les mathématiciens célèbres et les concepts qui ont révolutionné notre compréhension du monde.",
    image: "",
    author: "Claire Rousseau",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "1 mars 2024",
    readTime: "14 min",
    views: 6780,
    category: "actualites",
    tags: ["Histoire", "Culture", "Mathématiques"],
  },
  {
    id: 8,
    title: "Astuces pour Calculer Mentalement Rapidement",
    description: "Développez vos compétences en calcul mental avec des techniques simples et efficaces. Des astuces pour additionner, soustraire, multiplier et diviser rapidement sans calculatrice.",
    image: "",
    author: "Thomas Petit",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "28 février 2024",
    readTime: "7 min",
    views: 8920,
    category: "astuces",
    tags: ["Calcul mental", "Astuces", "Rapidité"],
  },
  {
    id: 9,
    title: "Tutoriel : Maîtriser la Géométrie en 5 Étapes",
    description: "Un guide progressif pour maîtriser tous les concepts de géométrie. De la base aux notions avancées, avec des exercices pratiques et des visualisations interactives pour mieux comprendre.",
    image: "",
    author: "Julie Martin",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "25 février 2024",
    readTime: "13 min",
    views: 7650,
    category: "tutoriels",
    tags: ["Géométrie", "Tutoriel", "Apprentissage"],
  },
  {
    id: 10,
    title: "Les Mathématiques et l'Intelligence Artificielle",
    description: "Explorez comment les mathématiques sont au cœur de l'intelligence artificielle moderne. Découvrez les concepts mathématiques qui permettent aux machines d'apprendre et de raisonner.",
    image: "",
    author: "Marc Lefebvre",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "22 février 2024",
    readTime: "16 min",
    views: 10450,
    category: "actualites",
    tags: ["IA", "Technologie", "Mathématiques"],
  },
  {
    id: 11,
    title: "Méthode Pomodoro pour les Révisions de Maths",
    description: "Apprenez à utiliser la technique Pomodoro pour optimiser vos révisions de mathématiques. Une méthode efficace pour maintenir votre concentration et améliorer votre productivité.",
    image: "",
    author: "Nathalie Durand",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "20 février 2024",
    readTime: "6 min",
    views: 5430,
    category: "methodes",
    tags: ["Méthode", "Productivité", "Révision"],
  },
  {
    id: 12,
    title: "Les Erreurs Courantes en Mathématiques et Comment Les Éviter",
    description: "Identifiez et corrigez les erreurs les plus fréquentes en mathématiques. Des exemples concrets, des explications détaillées et des conseils pour éviter ces pièges à l'avenir.",
    image: "",
    author: "David Simon",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "18 février 2024",
    readTime: "10 min",
    views: 8120,
    category: "astuces",
    tags: ["Erreurs", "Conseils", "Amélioration"],
  },
]

const formatViews = (views: number) => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views.toString()
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("tous")

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

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "tous" || post.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find((post) => post.featured)

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
                <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Blog Mathosphère
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos articles, tutoriels et astuces pour exceller en mathématiques. Des contenus riches et variés pour tous les niveaux.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{blogPosts.length}+ articles</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Contenu varié</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Award className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Experts certifiés</span>
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
                  placeholder="Rechercher un article..."
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
        {/* Article mis en avant */}
        {featuredPost && selectedCategory === "tous" && !searchQuery && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="overflow-hidden border-2 shadow-2xl bg-gradient-to-br from-card to-card/50">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={getCourseImage("mathématiques")}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                    <Sparkles className="h-3 w-3 mr-1" /> Article à la une
                  </Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getCategoryColor(featuredPost.category)}>{featuredPost.category}</Badge>
                    <span className="text-sm text-muted-foreground">{featuredPost.date}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{featuredPost.description}</p>
                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{formatViews(featuredPost.views)} vues</span>
                    </div>
                  </div>
                  <Button
                    className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
                    asChild
                  >
                    <Link href={`/blogs/${featuredPost.id}`}>
                      Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabs pour les catégories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-2 bg-muted/50">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-semibold text-xs md:text-sm">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Aucun article trouvé</p>
                  <p className="text-muted-foreground">
                    Aucun article ne correspond à votre recherche "{searchQuery}"
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
                {filteredPosts
                  .filter((post) => !post.featured || selectedCategory !== "tous" || searchQuery)
                  .map((post) => {
                    const postImage = post.image || getCourseImage("mathématiques")

                    return (
                      <motion.div key={post.id} variants={fadeIn}>
                        <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={postImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <Badge
                              className={`absolute top-4 left-4 ${getCategoryColor(post.category)} shadow-lg border-0`}
                            >
                              {post.category}
                            </Badge>

                            {post.featured && (
                              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                                <Sparkles className="h-3 w-3 mr-1" /> À la une
                              </Badge>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          </div>

                          <CardContent className="pt-6 flex-grow">
                            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{post.date}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{post.readTime}</span>
                            </div>
                            <h3 className="font-bold text-foreground text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">{post.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Eye className="h-4 w-4" />
                                <span>{formatViews(post.views)}</span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="pt-4 pb-6">
                            <Button
                              className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg"
                              variant="outline"
                              asChild
                            >
                              <Link href={`/blogs/${post.id}`}>
                                <span>Lire l'article</span>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getCategoryColor(category: string) {
  const cat = categories.find((c) => c.id === category)
  if (cat) {
    return `bg-gradient-to-r ${cat.color} text-white border-0`
  }
  return "bg-primary/10 text-primary border-primary/20"
}



