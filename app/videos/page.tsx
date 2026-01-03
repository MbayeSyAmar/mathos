"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Play,
  Clock,
  Eye,
  Search,
  Target,
  Youtube,
  ThumbsUp,
} from "lucide-react"
import { getYouTubeThumbnail, getYouTubeUrl } from "@/lib/services/videos-service"
import { motion } from "framer-motion"

export interface Video {
  id: number
  title: string
  description: string
  youtubeId: string
  thumbnail: string
  duration: string
  views: number
  likes: number
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

// Créer la liste complète des vidéos
export const allVideos: Video[] = videoList.map((video, index) => ({
  id: index + 1,
  title: video.title,
  description: "Découvrez cette vidéo mathématique passionnante !",
  youtubeId: video.youtubeId,
  thumbnail: getYouTubeThumbnail(video.youtubeId, "high"),
  duration: "25:00",
  views: 50000,
  likes: 1500,
}))

// Export for compatibility with the detail page
export const videosData = { all: allVideos }

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

  const getTotalDuration = () => {
    return allVideos.reduce((total, video) => {
      const [minutes, seconds] = video.duration.split(":").map(Number)
      return total + minutes * 60 + seconds
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

  const filteredVideos = allVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                {allVideos.length} vidéos et {formatTotalDuration(getTotalDuration())} de contenu.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{allVideos.length} vidéos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{formatTotalDuration(getTotalDuration())} de contenu</span>
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
        {/* Liste des vidéos */}
        {filteredVideos.length === 0 ? (
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
            {filteredVideos.map((video) => {
              const videoImage = video.thumbnail || "/images/math-blackboard.png"

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
      </div>
    </div>
  )
}
