"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
  Youtube,
} from "lucide-react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/services/videos-service"

// Import des données depuis la page principale
// En production, cela devrait venir d'une base de données
import { videosData } from "../page"

interface Comment {
  id: number
  author: string
  authorAvatar: string
  date: string
  content: string
  likes: number
}

// Fonction pour récupérer une vidéo par son ID
function getVideoById(id: number) {
  const allVideos = Object.values(videosData).flat()
  return allVideos.find((video) => video.id === id) || null
}

// Fonction pour récupérer des vidéos similaires
function getRelatedVideos(currentVideoId: number, limit: number = 3) {
  const allVideos = Object.values(videosData).flat()
  return allVideos.filter((video) => video.id !== currentVideoId).slice(0, limit)
}

export default function VideoPage() {
  const router = useRouter()
  const params = useParams()
  const videoId = params?.id ? Number(params.id) : null

  const [activeTab, setActiveTab] = useState("description")
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Lucas Petit",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "Il y a 2 jours",
      content: "Excellente vidéo ! J'ai enfin compris les concepts expliqués. Merci beaucoup !",
      likes: 12,
    },
    {
      id: 2,
      author: "Sophie Leclerc",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "Il y a 5 jours",
      content: "Très bien expliqué, j'ai pu suivre facilement. Est-ce qu'il y a une suite ?",
      likes: 5,
    },
  ])

  const video = videoId ? getVideoById(videoId) : null
  const relatedVideos = video ? getRelatedVideos(video.id) : []

  useEffect(() => {
    if (!videoId || !video) {
      router.push("/videos")
    }
  }, [videoId, video, router])

  if (!video) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground">Vidéo non trouvée</p>
        <Button onClick={() => router.push("/videos")} className="mt-4">
          Retour aux vidéos
        </Button>
      </div>
    )
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (commentText.trim()) {
      const newComment: Comment = {
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

  const handleLikeComment = (commentId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      }),
    )
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

  const videoThumbnail = video.thumbnail || getYouTubeThumbnail(video.youtubeId)
  const embedUrl = getYouTubeEmbedUrl(video.youtubeId)

  return (
    <div className="container py-10">
      <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Button variant="ghost" size="icon" onClick={() => router.push("/videos")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {video.category && (
          <Badge className="bg-blue-500/10 text-blue-500">
            {video.category === "cours" ? "Cours" : video.category === "exercices" ? "Exercices" : "Méthodes"}
          </Badge>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            {/* Player YouTube */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-black">
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">{video.title}</h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {formatViews(video.views)} vues
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {video.duration}
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {formatViews(video.likes)} likes
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
                    <div className="absolute top-full right-0 mt-2 p-2 bg-background border rounded-md shadow-md flex gap-2 z-10">
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
                <AvatarImage src={video.authorAvatar || "/placeholder.svg?height=40&width=40"} alt={video.author || "Auteur"} />
                <AvatarFallback>{(video.author || "A")[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{video.author || "Professeur Mathosphère"}</div>
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
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground mb-4">{video.description}</p>
                  {video.content && (
                    <div dangerouslySetInnerHTML={{ __html: video.content }} />
                  )}
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {video.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
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
                    className="bg-primary hover:bg-primary/90 ml-auto"
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
              {relatedVideos.map((relatedVideo) => {
                const relatedThumbnail = relatedVideo.thumbnail || getYouTubeThumbnail(relatedVideo.youtubeId, "medium")
                return (
                  <Link key={relatedVideo.id} href={`/videos/${relatedVideo.id}`} className="flex gap-3 group">
                    <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={relatedThumbnail}
                        alt={relatedVideo.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-white text-xs">
                        {relatedVideo.duration}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {relatedVideo.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{formatViews(relatedVideo.views)} vues</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/videos")}>
                Voir plus de vidéos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">À propos de l'auteur</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={video.authorAvatar || "/placeholder.svg?height=40&width=40"} alt={video.author || "Auteur"} />
                  <AvatarFallback>{(video.author || "A")[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{video.author || "Professeur Mathosphère"}</div>
                  <div className="text-xs text-muted-foreground">Professeur</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {video.authorBio || "Professeur expérimenté en mathématiques, passionné par l'enseignement et la transmission du savoir."}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Voir toutes ses vidéos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Tags populaires</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  video.subject || "Mathématiques",
                  video.classe || video.level,
                  video.category === "cours" ? "Cours" : video.category === "exercices" ? "Exercices" : "Méthodes",
                  "Éducation",
                ]
                  .filter(Boolean)
                  .map((tag) => (
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
