"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  User,
  ThumbsUp,
  MessageSquare,
  Share,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { 
  collection, 
  doc as firestoreDoc, 
  getDoc, 
  getDocs,
  addDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  query,
  where,
  orderBy
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Données simulées pour l'article
const articleData = {
  id: 2,
  title: "Préparer le Brevet des collèges",
  description: "Guide complet pour réviser et réussir l'épreuve de mathématiques du Brevet",
  image: "/placeholder.svg?height=400&width=800",
  category: "concours",
  date: "22 avril 2023",
  author: "Thomas Martin",
  authorAvatar: "/placeholder.svg?height=40&width=40",
  authorBio:
    "Professeur de mathématiques en collège depuis 10 ans, passionné par la pédagogie et l'accompagnement des élèves.",
  readTime: "12 min",
  content: `
    <h2>Introduction</h2>
    <p>Le Brevet des collèges est une étape importante dans le parcours scolaire des élèves. L'épreuve de mathématiques, en particulier, peut être source de stress pour beaucoup. Dans cet article, nous vous proposons un guide complet pour préparer efficacement cette épreuve et maximiser vos chances de réussite.</p>
    
    <h2>Structure de l'épreuve</h2>
    <p>L'épreuve de mathématiques du Brevet dure 2 heures et est notée sur 100 points. Elle est composée de plusieurs exercices indépendants qui couvrent l'ensemble du programme de mathématiques de la 3ème :</p>
    <ul>
      <li>Nombres et calculs</li>
      <li>Organisation et gestion de données, fonctions</li>
      <li>Grandeurs et mesures</li>
      <li>Espace et géométrie</li>
      <li>Algorithmique et programmation</li>
    </ul>
    
    <h2>Méthodologie de révision</h2>
    <p>Pour préparer efficacement l'épreuve, voici une méthodologie en 5 étapes :</p>
    
    <h3>1. Faire un bilan de vos connaissances</h3>
    <p>Commencez par identifier vos points forts et vos points faibles. Utilisez le programme officiel comme check-list et évaluez votre niveau de maîtrise pour chaque notion.</p>
    
    <h3>2. Établir un planning de révision</h3>
    <p>Organisez vos révisions sur plusieurs semaines avant l'examen. Consacrez plus de temps aux notions que vous maîtrisez moins bien, sans négliger les autres.</p>
    
    <h3>3. Réviser les notions théoriques</h3>
    <p>Pour chaque chapitre :</p>
    <ul>
      <li>Relisez vos cours et assurez-vous de comprendre toutes les définitions, propriétés et théorèmes</li>
      <li>Faites des fiches de synthèse avec les formules importantes</li>
      <li>Revoyez les méthodes de résolution des exercices types</li>
    </ul>
    
    <h3>4. S'entraîner régulièrement</h3>
    <p>L'entraînement est la clé de la réussite :</p>
    <ul>
      <li>Commencez par des exercices ciblés sur chaque notion</li>
      <li>Progressez vers des exercices plus complexes</li>
      <li>Terminez par des sujets complets dans les conditions de l'examen</li>
    </ul>
    
    <h3>5. Analyser vos erreurs</h3>
    <p>Après chaque entraînement :</p>
    <ul>
      <li>Identifiez vos erreurs et comprenez leur origine</li>
      <li>Revoyez les notions correspondantes</li>
      <li>Refaites des exercices similaires pour vérifier votre progression</li>
    </ul>
    
    <h2>Les notions essentielles à maîtriser</h2>
    
    <h3>Nombres et calculs</h3>
    <p>Assurez-vous de maîtriser :</p>
    <ul>
      <li>Les calculs avec les fractions</li>
      <li>Les puissances</li>
      <li>Le calcul littéral (développement, factorisation)</li>
      <li>La résolution d'équations et d'inéquations du premier degré</li>
    </ul>
    
    <h3>Organisation et gestion de données, fonctions</h3>
    <p>Concentrez-vous sur :</p>
    <ul>
      <li>Les fonctions linéaires et affines</li>
      <li>La proportionnalité</li>
      <li>Les statistiques (moyenne, médiane, étendue)</li>
      <li>Les probabilités</li>
    </ul>
    
    <h3>Grandeurs et mesures</h3>
    <p>Révisez particulièrement :</p>
    <ul>
      <li>Les conversions d'unités</li>
      <li>Les calculs d'aires et de volumes</li>
      <li>L'effet d'un agrandissement ou d'une réduction sur les longueurs, les aires et les volumes</li>
    </ul>
    
    <h3>Espace et géométrie</h3>
    <p>Ne négligez pas :</p>
    <ul>
      <li>Le théorème de Pythagore</li>
      <li>Le théorème de Thalès</li>
      <li>Les transformations (symétries, translations, rotations)</li>
      <li>La trigonométrie dans le triangle rectangle</li>
    </ul>
    
    <h3>Algorithmique et programmation</h3>
    <p>Familiarisez-vous avec :</p>
    <ul>
      <li>Les notions de variable, de boucle et de condition</li>
      <li>La lecture et l'écriture d'algorithmes simples</li>
      <li>Le langage de programmation Scratch</li>
    </ul>
    
    <h2>Conseils pour le jour J</h2>
    
    <h3>Avant l'épreuve</h3>
    <ul>
      <li>Dormez suffisamment la veille</li>
      <li>Préparez votre matériel : calculatrice, instruments de géométrie, stylos, etc.</li>
      <li>Prenez un petit-déjeuner équilibré</li>
      <li>Arrivez en avance pour vous installer sereinement</li>
    </ul>
    
    <h3>Pendant l'épreuve</h3>
    <ul>
      <li>Lisez attentivement l'ensemble du sujet avant de commencer</li>
      <li>Gérez votre temps : 2 heures passent vite !</li>
      <li>Commencez par les exercices que vous maîtrisez le mieux</li>
      <li>Soignez la présentation et la rédaction</li>
      <li>N'oubliez pas de vérifier vos calculs</li>
      <li>Si vous bloquez sur un exercice, passez au suivant et revenez-y plus tard</li>
    </ul>
    
    <h2>Ressources recommandées</h2>
    <p>Pour compléter vos révisions, voici quelques ressources utiles :</p>
    <ul>
      <li>Les annales du Brevet des années précédentes</li>
      <li>Les fiches de révision Mathosphère</li>
      <li>Les quiz interactifs de notre plateforme</li>
      <li>Les vidéos explicatives sur les notions complexes</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>La préparation du Brevet des collèges en mathématiques demande du temps et de la régularité. En suivant cette méthodologie et en vous entraînant régulièrement, vous aborderez l'épreuve avec confiance et maximiserez vos chances de réussite.</p>
    
    <p>N'oubliez pas que l'équipe de Mathosphère est là pour vous accompagner dans cette préparation. N'hésitez pas à consulter nos ressources dédiées et à poser vos questions sur le forum.</p>
    
    <p>Bon courage pour vos révisions et votre examen !</p>
  `,
  tags: ["Brevet", "Collège", "Révisions", "Examens", "Méthodologie"],
  relatedArticles: [
    {
      id: 1,
      title: "Comment réussir en mathématiques ?",
      image: "/placeholder.svg?height=100&width=200",
      category: "methodes",
      date: "15 mars 2023",
    },
    {
      id: 5,
      title: "Préparer les Olympiades de mathématiques",
      image: "/placeholder.svg?height=100&width=200",
      category: "concours",
      date: "18 juillet 2023",
    },
    {
      id: 8,
      title: "Préparer le Baccalauréat",
      image: "/placeholder.svg?height=100&width=200",
      category: "concours",
      date: "25 octobre 2023",
    },
  ],
  comments: [
    {
      id: 1,
      author: "Sophie Leclerc",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "23 avril 2023",
      content:
        "Merci pour cet article très complet ! J'accompagne mon fils dans sa préparation au Brevet et ces conseils vont nous être très utiles.",
      likes: 8,
    },
    {
      id: 2,
      author: "Lucas Petit",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "24 avril 2023",
      content:
        "Est-ce que vous pourriez préciser quelles sont les formules de géométrie les plus importantes à retenir pour le Brevet ?",
      likes: 3,
    },
    {
      id: 3,
      author: "Thomas Martin",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "24 avril 2023",
      content:
        "Bonjour Lucas, les formules essentielles sont celles liées au théorème de Pythagore, au théorème de Thalès, et aux calculs d'aires et de volumes des figures usuelles. Je vous conseille de créer une fiche récapitulative avec ces formules.",
      likes: 5,
    },
  ],
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState(articleData.comments)
  const [likedComments, setLikedComments] = useState(new Set<number>())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Charger les états des likes et bookmarks
  useEffect(() => {
    const loadUserInteractions = async () => {
      if (!user) return

      try {
        // Vérifier si l'utilisateur a aimé l'article
        const articleLikesQuery = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("articleId", "==", params.id),
          where("type", "==", "article")
        )
        const articleLikesSnap = await getDocs(articleLikesQuery)
        setIsLiked(articleLikesSnap.docs.some(doc => !doc.data().deleted))

        // Vérifier si l'utilisateur a enregistré l'article
        const bookmarksQuery = query(
          collection(db, "blog_bookmarks"),
          where("userId", "==", user.uid),
          where("articleId", "==", params.id)
        )
        const bookmarksSnap = await getDocs(bookmarksQuery)
        setIsBookmarked(bookmarksSnap.docs.some(doc => !doc.data().deleted))

        // Vérifier quels commentaires l'utilisateur a aimés
        const commentLikesQuery = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("articleId", "==", params.id),
          where("type", "==", "comment")
        )
        const commentLikesSnap = await getDocs(commentLikesQuery)
        const likedCommentIds = new Set<number>()
        commentLikesSnap.docs.forEach(doc => {
          const data = doc.data()
          if (data.commentId && !data.deleted) {
            likedCommentIds.add(data.commentId)
          }
        })
        setLikedComments(likedCommentIds)
      } catch (error) {
        console.error("Erreur lors du chargement des interactions:", error)
      }
    }

    loadUserInteractions()
  }, [user, params.id])

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour aimer cet article",
        variant: "destructive",
      })
      return
    }

    try {
      if (isLiked) {
        // Retirer le like
        const likesQuery = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("articleId", "==", params.id),
          where("type", "==", "article")
        )
        const likesSnap = await getDocs(likesQuery)
        
        const deletePromises = likesSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "blog_likes", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        setIsLiked(false)
        toast({ title: "J'aime retiré", description: "Vous avez retiré votre like" })
      } else {
        // Ajouter le like
        await addDoc(collection(db, "blog_likes"), {
          userId: user.uid,
          articleId: params.id,
          type: "article",
          date: serverTimestamp(),
        })
        
        setIsLiked(true)
        toast({ title: "J'aime ajouté", description: "Vous avez aimé cet article" })
      }
    } catch (error) {
      console.error("Erreur lors du like:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour enregistrer cet article",
        variant: "destructive",
      })
      return
    }

    try {
      if (isBookmarked) {
        // Retirer le bookmark
        const bookmarksQuery = query(
          collection(db, "blog_bookmarks"),
          where("userId", "==", user.uid),
          where("articleId", "==", params.id)
        )
        const bookmarksSnap = await getDocs(bookmarksQuery)
        
        const deletePromises = bookmarksSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "blog_bookmarks", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        setIsBookmarked(false)
        toast({ title: "Enregistrement retiré", description: "Article retiré de vos favoris" })
      } else {
        // Ajouter le bookmark
        await addDoc(collection(db, "blog_bookmarks"), {
          userId: user.uid,
          articleId: params.id,
          date: serverTimestamp(),
        })
        
        setIsBookmarked(true)
        toast({ title: "Article enregistré", description: "Article ajouté à vos favoris" })
      }
    } catch (error) {
      console.error("Erreur lors du bookmark:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'article",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowShareOptions(!showShareOptions)
      toast({ 
        title: "Lien copié", 
        description: "Le lien de l'article a été copié dans le presse-papiers" 
      })
    } catch (error) {
      setShowShareOptions(!showShareOptions)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour commenter",
        variant: "destructive",
      })
      router.push(`/connexion?redirect=/blog/${params.id}`)
      return
    }

    if (!commentText.trim()) return

    setIsSubmitting(true)
    try {
      // Récupérer les infos utilisateur depuis Firestore
      let userDateInscription = null
      let userName = user.displayName || "Utilisateur anonyme"
      let userAvatar = user.photoURL || ""
      
      try {
        const userDocRef = firestoreDoc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          userDateInscription = userData.dateInscription || null
          if (userData.nom) userName = userData.nom
          if (userData.avatar) userAvatar = userData.avatar
        }
      } catch (userError) {
        console.warn("Impossible de récupérer les infos utilisateur:", userError)
      }

      const newComment = {
        id: comments.length + 1,
        author: userName,
        authorAvatar: userAvatar,
        authorId: user.uid,
        date: "À l'instant",
        content: commentText.trim(),
        likes: 0,
      }

      // Ajouter le commentaire à Firestore
      await addDoc(collection(db, "blog_comments"), {
        articleId: params.id,
        auteur: {
          id: user.uid,
          nom: userName,
          avatar: userAvatar,
          dateInscription: userDateInscription,
        },
        contenu: commentText.trim(),
        dateCreation: serverTimestamp(),
        likes: 0,
      })

      setComments([...comments, newComment])
      setCommentText("")
      
      toast({
        title: "Commentaire publié",
        description: "Votre commentaire a été ajouté avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error)
      toast({
        title: "Erreur",
        description: "Impossible de publier le commentaire",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour aimer un commentaire",
        variant: "destructive",
      })
      return
    }

    try {
      if (likedComments.has(commentId)) {
        // Retirer le like
        const likesQuery = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("commentId", "==", commentId),
          where("type", "==", "comment")
        )
        const likesSnap = await getDocs(likesQuery)
        
        const deletePromises = likesSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "blog_likes", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, likes: Math.max(0, comment.likes - 1) }
            }
            return comment
          })
        )
        
        const newLikedComments = new Set(likedComments)
        newLikedComments.delete(commentId)
        setLikedComments(newLikedComments)
        
        toast({ title: "J'aime retiré", description: "Vous avez retiré votre like" })
      } else {
        // Ajouter le like
        await addDoc(collection(db, "blog_likes"), {
          userId: user.uid,
          articleId: params.id,
          commentId: commentId,
          type: "comment",
          date: serverTimestamp(),
        })
        
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, likes: comment.likes + 1 }
            }
            return comment
          })
        )
        
        setLikedComments(new Set([...likedComments, commentId]))
        toast({ title: "J'aime ajouté", description: "Vous avez aimé ce commentaire" })
      }
    } catch (error) {
      console.error("Erreur lors du like du commentaire:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive",
      })
    }
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
        <Button variant="ghost" size="icon" onClick={() => router.push("/blog")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Badge className="bg-green-500/10 text-green-500">
          {articleData.category === "concours" ? "Concours" : articleData.category}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{articleData.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {articleData.date}
              </div>
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                {articleData.author}
              </div>
              <div>Lecture: {articleData.readTime}</div>
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={articleData.image || "/placeholder.svg"}
                alt={articleData.title}
                fill
                className="object-cover"
              />
            </div>

            <div
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: articleData.content }}
            />

            <div className="flex flex-wrap gap-2 mt-8">
              {articleData.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t">
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
                  className="text-muted-foreground"
                  onClick={() => {
                    const commentsSection = document.getElementById("comments")
                    if (commentsSection) {
                      commentsSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Commenter
                </Button>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-1" /> Partager
                  </Button>

                  {showShareOptions && (
                    <div className="absolute top-full left-0 mt-2 p-2 bg-background border rounded-md shadow-md flex gap-2">
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

              <Button
                variant="ghost"
                size="sm"
                className={isBookmarked ? "text-primary" : "text-muted-foreground"}
                onClick={handleBookmark}
              >
                <Bookmark className="h-4 w-4 mr-1" /> Enregistrer
              </Button>
            </div>
          </motion.div>

          <Separator />

          <motion.div initial="hidden" animate="visible" variants={fadeIn} id="comments">
            <h2 className="text-2xl font-bold mb-6">Commentaires ({comments.length})</h2>

            <form onSubmit={handleSubmitComment} className="mb-8">
              <Textarea
                placeholder="Ajouter un commentaire..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800 ml-auto" disabled={!commentText.trim() || isSubmitting}>
                {isSubmitting ? "Publication..." : "Publier"}
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
                        className={`text-xs ${likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"}`}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" /> 
                        {likedComments.has(comment.id) ? "Ne plus aimer" : "J'aime"} ({comment.likes})
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">À propos de l'auteur</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={articleData.authorAvatar} alt={articleData.author} />
                  <AvatarFallback>{articleData.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{articleData.author}</div>
                  <div className="text-xs text-muted-foreground">Auteur</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{articleData.authorBio}</p>
              <Button variant="outline" size="sm" className="w-full">
                Voir tous ses articles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Articles similaires</h3>
              <div className="space-y-4">
                {articleData.relatedArticles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.id}`} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{article.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Tags populaires</h3>
              <div className="flex flex-wrap gap-2">
                {["Brevet", "Bac", "Collège", "Lycée", "Révisions", "Méthodologie", "Examens", "Concours"].map(
                  (tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
