"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ThumbsUp,
  Share,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  Eye,
  Calendar,
  PlayCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"

// Données simulées pour la vidéo
const videoData = {
  id: 1,
  title: "Les nombres complexes - Partie 1",
  description: "Introduction aux nombres complexes et opérations de base",
  thumbnail: "/placeholder.svg?height=400&width=800",
  videoUrl: "#", // URL fictive
  category: "cours",
  duration: "15:24",
  views: 12540,
  date: "15 mars 2023",
  author: "Marie Dupont",
  authorAvatar: "/placeholder.svg?height=40&width=40",
  authorBio: "Professeure agrégée de mathématiques, spécialisée en algèbre et analyse complexe.",
  content: `
    <h2>Description de la vidéo</h2>
    <p>Dans cette première partie sur les nombres complexes, nous abordons les concepts fondamentaux et les opérations de base. Cette vidéo est destinée aux élèves de Terminale et aux étudiants en première année d'études supérieures.</p>
    
    <h3>Plan de la vidéo</h3>
    <ol>
      <li>Introduction et motivation historique (00:00 - 02:15)</li>
      <li>Définition des nombres complexes (02:16 - 04:30)</li>
      <li>Forme algébrique et représentation dans le plan complexe (04:31 - 07:45)</li>
      <li>Opérations de base : addition et soustraction (07:46 - 10:20)</li>
      <li>Multiplication et division (10:21 - 14:30)</li>
      <li>Conclusion et aperçu de la partie 2 (14:31 - 15:24)</li>
    </ol>
    
    <h3>Prérequis</h3>
    <p>Pour suivre cette vidéo, vous devez être à l'aise avec :</p>
    <ul>
      <li>Les opérations sur les nombres réels</li>
      <li>La résolution d'équations du second degré</li>
      <li>Les notions de base de géométrie analytique</li>
    </ul>
    
    <h3>Ressources complémentaires</h3>
    <p>Pour approfondir le sujet, vous pouvez consulter :</p>
    <ul>
      <li>La fiche de cours sur les nombres complexes disponible sur Mathosphère</li>
      <li>Les exercices d'application associés à cette vidéo</li>
      <li>La partie 2 de cette série qui abordera la forme trigonométrique et les applications</li>
    </ul>
  `,
  tags: ["Nombres complexes", "Terminale", "Algèbre", "Analyse complexe"],
  relatedVideos: [
    {
      id: 2,
      title: "Résolution d'équations du second degré",
      thumbnail: "/placeholder.svg?height=100&width=200",
      duration: "18:36",
      views: 8750,
      date: "22 avril 2023",
    },
    {
      id: 5,
      title: "Les intégrales - Cours complet",
      thumbnail: "/placeholder.svg?height=100&width=200",
      duration: "32:10",
      views: 7650,
      date: "18 juillet 2023",
    },
    {
      id: 9,
      title: "Les probabilités - Cours complet",
      thumbnail: "/placeholder.svg?height=100&width=200",
      duration: "29:15",
      views: 8940,
      date: "8 novembre 2023",
    },
  ],
  comments: [
    {
      id: 1,
      author: "Lucas Petit",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "16 mars 2023",
      content:
        "Excellente vidéo ! J'ai enfin compris la différence entre la forme algébrique et la forme trigonométrique. Merci beaucoup !",
      likes: 12,
    },
    {
      id: 2,
      author: "Sophie Leclerc",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "17 mars 2023",
      content:
        "Est-ce que vous pourriez préciser comment calculer le module d'un nombre complexe ? Je n'ai pas bien compris cette partie.",
      likes: 5,
    },
    {
      id: 3,
      author: "Marie Dupont",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "17 mars 2023",
      content:
        "Bonjour Sophie, le module d'un nombre complexe z = a + ib est défini par |z| = √(a² + b²). C'est la distance entre le point représentant z dans le plan complexe et l'origine. J'aborderai ce sujet plus en détail dans la partie 2 !",
      likes: 8,
    },
  ],
}

export default function VideoPage({ params }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("description")
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState(videoData.comments)

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()

    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "Vous",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        date: "À l'instant",
        content: commentText,
        likes: 0,
      }

      setComments([...comments, newComment])
      setCommentText("")
    }
  }

  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      }),
    )
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views
  }

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
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container py-10">
      <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Button variant="ghost" size="icon" onClick={() => router.push("/videos")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Badge className="bg-blue-500/10 text-blue-500">
          {videoData.category === "cours" ? "Cours" : videoData.category}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 group">
              <Image
                src={videoData.thumbnail || "/placeholder.svg"}
                alt={videoData.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-white text-sm flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {videoData.duration}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">{videoData.title}</h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {formatViews(videoData.views)} vues
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {videoData.date}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isLiked ? "text-primary" : "text-muted-foreground"}
                  onClick={handleLike}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" /> J'aime
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isBookmarked ? "text-primary" : "text-muted-foreground"}
                  onClick={handleBookmark}
                >
                  <Bookmark className="h-4 w-4 mr-1" /> Enregistrer
                </Button>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-1" /> Partager
                  </Button>

                  {showShareOptions && (
                    <div className="absolute top-full right-0 mt-2 p-2 bg-background border rounded-md shadow-md flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Facebook className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Twitter className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <Avatar className="h-12 w-12">
                <AvatarImage src={videoData.authorAvatar} alt={videoData.author} />
                <AvatarFallback>{videoData.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{videoData.author}</div>
                <div className="text-xs text-muted-foreground">Professeur</div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                S'abonner
              </Button>
            </div>

            <Tabs defaultValue="description" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="comments">Commentaires ({comments.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <div
                  className="prose prose-gray dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: videoData.content }}
                />

                <div className="flex flex-wrap gap-2 mt-6">
                  {videoData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="comments" className="mt-4">
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="mb-2"
                    rows={3}
                  />
                  <Button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 ml-auto"
                    disabled={!commentText.trim()}
                  >
                    Publier
                  </Button>
                </form>

                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                  {comments.map((comment) => (
                    <motion.div key={comment.id} variants={fadeIn}>
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </div>

                          <p className="text-sm mb-2">{comment.content}</p>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground"
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" /> {comment.likes}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vidéos similaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {videoData.relatedVideos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`} className="flex gap-3 group">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-white text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{formatViews(video.views)} vues</span>
                      <span>•</span>
                      <span>{video.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                Voir plus de vidéos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">À propos de l'auteur</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={videoData.authorAvatar} alt={videoData.author} />
                  <AvatarFallback>{videoData.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{videoData.author}</div>
                  <div className="text-xs text-muted-foreground">Professeur</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{videoData.authorBio}</p>
              <Button variant="outline" size="sm" className="w-full">
                Voir toutes ses vidéos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Tags populaires</h3>
              <div className="flex flex-wrap gap-2">
                {["Nombres complexes", "Terminale", "Algèbre", "Analyse", "Cours", "Exercices", "Prépa"].map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
