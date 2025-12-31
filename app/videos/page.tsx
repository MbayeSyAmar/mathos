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
  Play,
  ArrowRight,
  Clock,
  Eye,
  Search,
  Target,
  Zap,
  Award,
  TrendingUp,
  GraduationCap,
  Youtube,
  ThumbsUp,
} from "lucide-react"
import { getCourseImage } from "@/lib/utils/course-images"
import { getYouTubeIdForSubject } from "@/lib/data/youtube-videos-mapping"
import { getYouTubeThumbnail, getYouTubeUrl } from "@/lib/services/videos-service"
import { motion } from "framer-motion"

const levels = [
  { id: "college", name: "Collège", classes: ["6ème", "5ème", "4ème", "3ème"], icon: "📚", color: "from-blue-500 to-cyan-500" },
  { id: "lycee", name: "Lycée", classes: ["2nde", "1ère", "Terminale"], icon: "🎓", color: "from-purple-500 to-pink-500" },
  { id: "concours", name: "Concours", classes: ["Brevet", "Bac", "Prépa"], icon: "🏆", color: "from-orange-500 to-red-500" },
]

export interface Video {
  id: number
  title: string
  description: string
  youtubeId: string
  thumbnail: string
  duration: string
  views: number
  likes: number
  level: string
  classe?: string
  subject?: string
  category?: "cours" | "exercices" | "methodes"
}

export type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale" | "Brevet" | "Bac" | "Prépa"

// Fonction pour créer une vidéo avec un ID YouTube unique
function createVideo(data: Omit<Video, "youtubeId" | "thumbnail"> & { youtubeId?: string; thumbnail?: string }): Video {
  const youtubeId = data.youtubeId || getYouTubeIdForSubject(data.subject || data.title, data.classe)
  return {
    ...data,
    youtubeId,
    thumbnail: data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail : getYouTubeThumbnail(youtubeId, "high"),
  }
}

// Liste des vidéos avec leurs IDs YouTube
const videoList = [
  { title: "PETIT DÉJEUNER À L'INFINI ☕", youtubeId: "Mqy03cO4HU0" },
  { title: "Lagrange et le Vieux Paysan 👴🏼", youtubeId: "gMUhQ3EDjUA" },
  { title: "La Régression Linéaire, Un Problème d'Optimisation !", youtubeId: "imvLTU6NbtA" },
  { title: "L'HEURE DU CRIME ‼️ 🤔", youtubeId: "LGuqe1bXEKk" },
  { title: "UNE INTÉGRALE UN PEU MUSCLÉE 🤭", youtubeId: "7sIEXK28-eA" },
  { title: "UNE CONSTANTE INATTENDUE 🤔", youtubeId: "Gq3I0qKFgOc" },
  { title: "UN PROBLÈME D'ANNIVERSAIRE 🎂", youtubeId: "WwalG4MHfyc" },
  { title: "Un Produit Infini disparaît subitement !", youtubeId: "aJwwEWMCSwQ" },
  { title: "Plus Simple Qu'il n'y Paraît !", youtubeId: "-25Z1I74gfQ" },
  { title: "📌 DÉNOMBREMENT - COURS COMPLET | TERMINALE S - SCEANCE 1📌", youtubeId: "EqII7iT9144" },
  { title: "🥇 Aurais-tu réussi ce problème de Probabilités ?", youtubeId: "QaP27NIveoY" },
  { title: "Des étudiants de l'EPT révèlent leurs meilleures astuces pour intégrer l'école !", youtubeId: "P94-Pp-nK5k" },
  { title: "Concours IPSL : Les Meilleurs Conseils des Admis pour Réussir !", youtubeId: "Y0OcKYeb9Vk" },
]

// Compteur global pour les IDs uniques
let globalVideoId = 1

// Fonction pour créer une vidéo avec les données fournies
function createVideoFromList(videoIndex: number, classe: ClasseKey, level: string): Video {
  const video = videoList[videoIndex % videoList.length]
  const id = globalVideoId++
  return createVideo({
    id: id,
    title: video.title,
    description: "Découvrez cette vidéo mathématique passionnante !",
    youtubeId: video.youtubeId,
      thumbnail: "",
    duration: "25:00",
    views: 50000,
    likes: 1500,
    level: level,
    classe: classe,
    subject: "mathématiques",
      category: "cours",
  })
}

export const videosData: Record<ClasseKey, Video[]> = {
  "6ème": [
    createVideoFromList(0, "6ème", "Collège"),
    createVideoFromList(1, "6ème", "Collège"),
    createVideoFromList(2, "6ème", "Collège"),
    createVideoFromList(3, "6ème", "Collège"),
    createVideoFromList(4, "6ème", "Collège"),
    createVideoFromList(5, "6ème", "Collège"),
  ],
  "5ème": [
    createVideoFromList(6, "5ème", "Collège"),
    createVideoFromList(7, "5ème", "Collège"),
    createVideoFromList(8, "5ème", "Collège"),
    createVideoFromList(9, "5ème", "Collège"),
    createVideoFromList(10, "5ème", "Collège"),
    createVideoFromList(11, "5ème", "Collège"),
  ],
  "4ème": [
    createVideoFromList(12, "4ème", "Collège"),
    createVideoFromList(0, "4ème", "Collège"),
    createVideoFromList(1, "4ème", "Collège"),
    createVideoFromList(2, "4ème", "Collège"),
    createVideoFromList(3, "4ème", "Collège"),
    createVideoFromList(4, "4ème", "Collège"),
  ],
  "3ème": [
    createVideoFromList(5, "3ème", "Collège"),
    createVideoFromList(6, "3ème", "Collège"),
    createVideoFromList(7, "3ème", "Collège"),
    createVideoFromList(8, "3ème", "Collège"),
    createVideoFromList(9, "3ème", "Collège"),
    createVideoFromList(10, "3ème", "Collège"),
  ],
  "2nde": [
    createVideoFromList(11, "2nde", "Lycée"),
    createVideoFromList(12, "2nde", "Lycée"),
    createVideoFromList(0, "2nde", "Lycée"),
    createVideoFromList(1, "2nde", "Lycée"),
    createVideoFromList(2, "2nde", "Lycée"),
    createVideoFromList(3, "2nde", "Lycée"),
    createVideoFromList(4, "2nde", "Lycée"),
    createVideoFromList(5, "2nde", "Lycée"),
  ],
  "1ère": [
    createVideoFromList(6, "1ère", "Lycée"),
    createVideoFromList(7, "1ère", "Lycée"),
    createVideoFromList(8, "1ère", "Lycée"),
    createVideoFromList(9, "1ère", "Lycée"),
    createVideoFromList(10, "1ère", "Lycée"),
    createVideoFromList(11, "1ère", "Lycée"),
    createVideoFromList(12, "1ère", "Lycée"),
    createVideoFromList(0, "1ère", "Lycée"),
  ],
  Terminale: [
    createVideoFromList(1, "Terminale", "Lycée"),
    createVideoFromList(2, "Terminale", "Lycée"),
    createVideoFromList(3, "Terminale", "Lycée"),
    createVideoFromList(4, "Terminale", "Lycée"),
    createVideoFromList(5, "Terminale", "Lycée"),
    createVideoFromList(6, "Terminale", "Lycée"),
    createVideoFromList(7, "Terminale", "Lycée"),
    createVideoFromList(8, "Terminale", "Lycée"),
  ],
  Brevet: [
    createVideoFromList(9, "Brevet", "Concours"),
    createVideoFromList(10, "Brevet", "Concours"),
    createVideoFromList(11, "Brevet", "Concours"),
    createVideoFromList(12, "Brevet", "Concours"),
  ],
  Bac: [
    createVideoFromList(0, "Bac", "Concours"),
    createVideoFromList(1, "Bac", "Concours"),
    createVideoFromList(2, "Bac", "Concours"),
    createVideoFromList(3, "Bac", "Concours"),
  ],
  Prépa: [
    createVideoFromList(4, "Prépa", "Supérieur"),
    createVideoFromList(5, "Prépa", "Supérieur"),
    createVideoFromList(6, "Prépa", "Supérieur"),
    createVideoFromList(7, "Prépa", "Supérieur"),
    createVideoFromList(8, "Prépa", "Supérieur"),
    createVideoFromList(9, "Prépa", "Supérieur"),
  ],
}

const getCategoryColor = (category?: string) => {
  switch (category) {
    case "cours":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "exercices":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "methodes":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    default:
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
  }
}

const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views.toString()
}

export default function VideosPage() {
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

  const getTotalVideos = () => {
    return Object.values(videosData).reduce((total, videos) => total + videos.length, 0)
  }

  const getTotalDuration = () => {
    return Object.values(videosData).reduce((total, videos) => {
      return total + videos.reduce((sum, video) => {
        const [minutes, seconds] = video.duration.split(":").map(Number)
        return sum + minutes * 60 + seconds
      }, 0)
    }, 0)
  }

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  const filteredVideos = (classe: ClasseKey) => {
    const videos = videosData[classe] || []
    if (!searchQuery) return videos
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.subject && video.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    )
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
                <Play className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vidéos Mathosphère
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos vidéos explicatives pour comprendre les concepts mathématiques.
                Plus de {getTotalVideos()} vidéos et {formatTotalDuration(getTotalDuration())} de contenu pour tous les niveaux.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalVideos()}+ vidéos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{formatTotalDuration(getTotalDuration())} de contenu</span>
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
                  placeholder="Rechercher une vidéo..."
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
                        {videosData[classe as ClasseKey]?.length || 0}
                      </Badge>
                    </Button>
                  </motion.a>
                ))}
              </motion.div>

              {/* Liste des vidéos par classe */}
              {level.classes.map((classe) => {
                const videos = filteredVideos(classe as ClasseKey)
                if (videos.length === 0 && searchQuery) return null

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
                          <Play className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Vidéos {classe}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {videos.length} vidéo{videos.length > 1 ? "s" : ""} disponible{videos.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {videos.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Aucune vidéo trouvée</p>
                          <p className="text-muted-foreground">
                            Aucune vidéo ne correspond à votre recherche "{searchQuery}"
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
                        {videos.map((video) => {
                          // Utiliser l'image de cours comme image principale, avec fallback vers thumbnail YouTube si disponible
                          const courseImage = video.subject ? getCourseImage(video.subject, video.classe) : getCourseImage("mathématiques", video.classe)
                          const videoImage = video.thumbnail || courseImage || "/images/math-blackboard.png"

                          return (
                            <motion.div key={video.id} variants={fadeIn}>
                              <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                                <div className="relative h-64 overflow-hidden">
                                  <Image
                                    src={videoImage}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onError={(e) => {
                                      e.currentTarget.src = "/images/math-blackboard.png"
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  {/* Badge de catégorie */}
                                  {video.category && (
                                    <div className="absolute top-4 left-4">
                                      <Badge
                                        className={`${getCategoryColor(video.category)} backdrop-blur-md shadow-lg border-2`}
                                      >
                                        {video.category === "cours" ? "Cours" : video.category === "exercices" ? "Exercices" : "Méthodes"}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Badge de classe */}
                                  <div className="absolute top-4 right-4">
                                    <Badge className="bg-background/95 backdrop-blur-md text-foreground shadow-lg border-2 border-primary/20">
                                      {video.classe || video.level}
                                    </Badge>
                                  </div>

                                  {/* Bouton play au centre */}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-primary/90 text-primary-foreground rounded-full p-4 shadow-2xl">
                                      <Play className="h-8 w-8 fill-current" />
                                    </div>
                                  </div>

                                  {/* Contenu overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="font-bold text-foreground text-xl md:text-2xl mb-3 drop-shadow-2xl line-clamp-2">
                                      {video.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{video.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Eye className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{formatViews(video.views)}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                                        <ThumbsUp className="h-4 w-4 fill-white" />
                                        <span className="font-semibold text-sm">{formatViews(video.likes)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Effet de brillance au survol */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <CardContent className="pt-6 flex-grow">
                                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                    {video.description}
                                  </p>
                                </CardContent>

                                <CardFooter className="pt-4 pb-6">
                                  <Button variant="secondary" className="w-full" asChild>
                                    <Link href={getYouTubeUrl(video.youtubeId)} target="_blank" rel="noreferrer">
                                      <Youtube className="mr-2 h-4 w-4" />
                                      Voir sur YouTube
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
