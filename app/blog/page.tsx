"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, User, Search, Sparkles, TrendingUp, PenLine, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const currentYear = new Date().getFullYear()

const categories = [
  { id: "tous", name: "Tous les articles", icon: "✨" },
  { id: "methodes", name: "Méthodes & réussite", icon: "🧠" },
  { id: "concours", name: "Concours & examens", icon: "🏆" },
  { id: "college", name: "Collège", icon: "📘" },
  { id: "algebre", name: "Algèbre", icon: "∑" },
  { id: "geometrie", name: "Géométrie", icon: "📐" },
  { id: "probas", name: "Probabilités", icon: "🎲" },
  { id: "statistiques", name: "Statistiques", icon: "📊" },
  { id: "programmation", name: "Python & Algo", icon: "💻" },
]

const blogData = [
  {
    slug: "reussir-en-maths",
    title: "Comment réussir en mathématiques ? 10 habitudes qui marchent",
    description: "Organisation, mémorisation active et entraînement ciblé: le trio gagnant.",
    image: "/images/reussirenmaths.jpg",
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

const stats = [
  { label: "Articles inspirants", value: "120+" },
  { label: "Lecteurs actifs", value: "18K" },
  { label: "Astuces pratiques", value: "250+" },
  { label: "Auteurs passionnés", value: "25" },
]

const highlightTopics = ["Révisions express", "Mindset mathématique", "Python créatif", "Concours Bac & Brevet", "Méthodes visuelles", "Données & IA"]

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

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
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id)

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const matchesSearch = (blog: (typeof blogData)[number]) => {
    if (!normalizedSearch) return true
    const haystack = `${blog.title} ${blog.description} ${blog.author}`.toLowerCase()
    return haystack.includes(normalizedSearch)
  }

  const currentCategoryArticles = useMemo(() => {
    return blogData
      .filter((blog) => activeCategory === "tous" || blog.category === activeCategory)
      .filter((blog) => matchesSearch(blog))
  }, [activeCategory, normalizedSearch])

  const featuredArticle = currentCategoryArticles[0] ?? blogData[0]

  return (
    <div className="space-y-12">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10">
          <motion.div className="space-y-6 text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Inspirations mathématiques {currentYear}
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-5xl lg:text-6xl">
              Histoires, méthodes et inspirations pour aimer les mathématiques
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Chaque article est conçu comme un mini voyage : anecdotes de classe, conseils d&apos;apprentissage, préparation aux examens et défis créatifs pour transformer les maths en source de plaisir.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 backdrop-blur">
                <TrendingUp className="h-4 w-4 text-primary" />
                Nouveaux billets chaque semaine
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 backdrop-blur">
                <PenLine className="h-4 w-4 text-primary" />
                Auteurs enseignants & coachs
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 backdrop-blur">
                <BookOpen className="h-4 w-4 text-primary" />
                Guides, interviews & storytelling
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="gap-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-lg hover:opacity-90">
                <PenLine className="h-4 w-4" />
                Proposer un article
              </Button>
              <Button variant="outline" className="gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/10">
                <Sparkles className="h-4 w-4" />
                Découvrir la rédaction
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container relative z-20 -mt-16 space-y-12">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {featuredArticle && (
          <motion.div className="group relative overflow-hidden rounded-3xl border bg-card shadow-sm" variants={fadeIn} initial="hidden" animate="visible">
            <div className="relative h-80 w-full overflow-hidden">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute left-6 top-6 flex flex-col gap-3">
                <Badge className={`${getCategoryColor(featuredArticle.category)} font-semibold uppercase tracking-wide`}>
                  Article phare
                </Badge>
                <Badge className={`${getCategoryColor(featuredArticle.category)} font-semibold`}>
                  {categories.find((c) => c.id === featuredArticle.category)?.name || featuredArticle.category}
                </Badge>
              </div>
            </div>
            <div className="space-y-4 p-8">
              <p className="text-sm font-medium text-muted-foreground">Sélection premium</p>
              <Link href={`/blog/${featuredArticle.slug}`}>
                <h2 className="text-3xl font-bold leading-tight tracking-tight hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
              </Link>
              <p className="text-lg text-muted-foreground">{featuredArticle.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {featuredArticle.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {featuredArticle.date}
                </div>
                <div className="font-semibold">Lecture: {featuredArticle.readTime}</div>
              </div>
              <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white hover:opacity-90">
                Lire l&apos;article complet
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
          <Card className="border-muted/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">La rédaction Mathosphère</CardTitle>
              <CardDescription>Des chiffres qui montrent que vous n’êtes pas seul(e) à aimer nos histoires.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={fadeIn} className="rounded-2xl border bg-muted/40 p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-foreground/5">
            <CardHeader className="space-y-2">
              <CardTitle>Tendances</CardTitle>
              <CardDescription>Explorez des angles originaux, recommandés par nos lecteurs.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {highlightTopics.map((topic) => (
                <Badge key={topic} variant="outline" className="rounded-full border-primary/30 px-4 py-1 text-sm">
                  {topic}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div className="rounded-3xl border bg-card/40 p-6 backdrop-blur" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cherchez un auteur, un thème, un mot-clé..."
              className="h-12 rounded-full border-none bg-muted/60 pl-12 text-base shadow-inner focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
              {currentCategoryArticles.length} articles inspirants
            </Badge>
            <Badge variant="outline" className="rounded-full border-dashed px-4 py-1 text-sm">
              Mode lecture immersive
            </Badge>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-2 gap-2 overflow-hidden rounded-3xl bg-muted/40 p-2 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="rounded-2xl border border-transparent px-3 py-3 text-sm font-semibold data-[state=active]:border-primary/30 data-[state=active]:bg-background"
            >
              <span className="mr-2 text-lg">{category.icon}</span>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => {
          const categoryArticles = blogData
            .filter((blog) => category.id === "tous" || blog.category === category.id)
            .filter((blog) => matchesSearch(blog))

          return (
            <TabsContent key={category.id} value={category.id} className="mt-6 space-y-8">
              {categoryArticles.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                  <CardContent>
                    <p className="text-lg font-semibold text-muted-foreground">Aucun article ne correspond à votre recherche.</p>
                    <p className="text-sm text-muted-foreground/80">Essayez un autre mot-clé ou changez de catégorie.</p>
                  </CardContent>
                </Card>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryArticles.map((blog) => (
                    <motion.div key={blog.slug} variants={fadeIn}>
                      <Card className="flex h-full flex-col overflow-hidden border-muted/60 bg-card/70 backdrop-blur transition hover:border-primary/40">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
                          <div className="absolute left-4 top-4">
                            <Badge className={`${getCategoryColor(blog.category)} font-medium`}>
                              {categories.find((c) => c.id === blog.category)?.name || blog.category}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="space-y-3">
                          <CardTitle className="text-xl leading-tight">
                            <Link href={`/blog/${blog.slug}`} className="hover:text-primary">
                              {blog.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-base text-muted-foreground">{blog.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto space-y-3 text-sm text-muted-foreground">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-primary" />
                              {blog.date}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="h-4 w-4 text-primary" />
                              {blog.author}
                            </div>
                            <div className="font-semibold text-primary">Lecture: {blog.readTime}</div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/30 px-6 py-4">
                          <Link href={`/blog/${blog.slug}`} className="w-full">
                            <Button className="w-full gap-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white hover:opacity-90">
                              Lire l&apos;article
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  </div>
  )
}