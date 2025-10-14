"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Eye, ArrowLeft, ThumbsUp, Flag, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import {
  collection,
  doc as firestoreDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Fonction pour formater la date relative
const formatRelativeTime = (timestamp: any): string => {
  if (!timestamp) {
    console.warn("⚠️ Timestamp manquant:", timestamp)
    return "Date inconnue"
  }

  let date: Date

  try {
    // Vérifier le type de timestamp et le convertir en Date si nécessaire
    if (timestamp instanceof Date) {
      date = timestamp
    } else if (timestamp.toDate && typeof timestamp.toDate === "function") {
      // C'est un timestamp Firestore
      date = timestamp.toDate()
    } else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      // C'est un objet timestamp Firestore sérialisé
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
    } else if (typeof timestamp === "number") {
      // C'est un timestamp en millisecondes
      date = new Date(timestamp)
    } else if (typeof timestamp === "string") {
      // C'est une date sous forme de chaîne
      date = new Date(timestamp)
    } else {
      console.warn("⚠️ Format de timestamp non reconnu:", typeof timestamp, timestamp)
      return "Date inconnue"
    }

    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      console.warn("⚠️ Date invalide après conversion:", date)
      return "Date inconnue"
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Gérer les dates dans le futur (problèmes d'horloge)
    if (diffInSeconds < 0) {
      return "À l'instant"
    }

    if (diffInSeconds < 60) return "À l'instant"
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`

    return `Le ${date.toLocaleDateString('fr-FR')}`
  } catch (error) {
    console.error("❌ Erreur lors du formatage de la date:", error, timestamp)
    return "Date inconnue"
  }
}

export default function DiscussionPage() {
  const [discussion, setDiscussion] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [similarDiscussions, setSimilarDiscussions] = useState<any[]>([])
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // États pour éviter les actions répétées
  const [hasLikedDiscussion, setHasLikedDiscussion] = useState(false)
  const [hasReportedDiscussion, setHasReportedDiscussion] = useState(false)
  const [likedReplies, setLikedReplies] = useState(new Set<string>())
  const [reportedReplies, setReportedReplies] = useState(new Set<string>())

  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // Récupérer les données de la discussion
  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        setLoading(true)
        setError(null)

        // Récupérer la discussion
        const discussionRef = firestoreDoc(db, "forum_discussions", params.id as string)
        const discussionSnap = await getDoc(discussionRef)

        if (!discussionSnap.exists()) {
          setError("Cette discussion n'existe pas")
          setLoading(false)
          return
        }

        const discussionData = discussionSnap.data()

        // Incrémenter le compteur de vues
        await updateDoc(discussionRef, {
          vues: increment(1),
        })

        // Récupérer les réponses
        const repliesRef = collection(db, "forum_reponses")
        const repliesQuery = query(repliesRef, where("discussionId", "==", params.id as string))
        const repliesSnap = await getDocs(repliesQuery)

        const repliesData = repliesSnap.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }))

        // Trier les réponses par date (plus anciennes d'abord)
        repliesData.sort((a: any, b: any) => {
          if (!a.dateCreation || !b.dateCreation) return 0

          // Extraire les secondes pour la comparaison
          const aSeconds =
            a.dateCreation.seconds || (a.dateCreation instanceof Date ? a.dateCreation.getTime() / 1000 : 0)
          const bSeconds =
            b.dateCreation.seconds || (b.dateCreation instanceof Date ? b.dateCreation.getTime() / 1000 : 0)

          return aSeconds - bSeconds
        })

        // Récupérer des discussions similaires
        const similarRef = collection(db, "forum_discussions")
        const similarQuery = query(similarRef, where("categorie", "==", discussionData.categorie))
        const similarSnap = await getDocs(similarQuery)

        const similarData = similarSnap.docs
          .map((docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          }))
          .filter((d) => d.id !== params.id) // Exclure la discussion actuelle
          .slice(0, 5) // Limiter à 5 discussions similaires

        setDiscussion({
          id: discussionSnap.id,
          ...discussionData,
        })
        setReplies(repliesData)
        setSimilarDiscussions(similarData)

        // Charger les likes et signalements de l'utilisateur connecté
        if (user) {
          // Vérifier si l'utilisateur a aimé la discussion
          const discussionLikeQuery = query(
            collection(db, "forum_likes"),
            where("userId", "==", user.uid),
            where("discussionId", "==", params.id as string)
          )
          const discussionLikeSnap = await getDocs(discussionLikeQuery)
          // Vérifier qu'il existe au moins un like non supprimé
          const hasActiveLike = discussionLikeSnap.docs.some(doc => !doc.data().deleted)
          if (hasActiveLike) {
            setHasLikedDiscussion(true)
          }

          // Vérifier si l'utilisateur a signalé la discussion
          const discussionReportQuery = query(
            collection(db, "forum_signals"),
            where("userId", "==", user.uid),
            where("discussionId", "==", params.id as string),
            where("type", "==", "discussion")
          )
          const discussionReportSnap = await getDocs(discussionReportQuery)
          // Vérifier qu'il existe au moins un signalement non supprimé
          const hasActiveReport = discussionReportSnap.docs.some(doc => !doc.data().deleted)
          if (hasActiveReport) {
            setHasReportedDiscussion(true)
          }

          // Vérifier les likes des réponses
          const repliesLikeQuery = query(
            collection(db, "forum_likes"),
            where("userId", "==", user.uid),
            where("discussionId", "==", params.id as string)
          )
          const repliesLikeSnap = await getDocs(repliesLikeQuery)
          const likedReplyIds = new Set<string>()
          repliesLikeSnap.docs.forEach((doc) => {
            const data = doc.data()
            if (data.replyId && !data.deleted) {
              likedReplyIds.add(data.replyId)
            }
          })
          setLikedReplies(likedReplyIds)

          // Vérifier les signalements des réponses
          const repliesReportQuery = query(
            collection(db, "forum_signals"),
            where("userId", "==", user.uid),
            where("discussionId", "==", params.id as string),
            where("type", "==", "reply")
          )
          const repliesReportSnap = await getDocs(repliesReportQuery)
          const reportedReplyIds = new Set<string>()
          repliesReportSnap.docs.forEach((doc) => {
            const data = doc.data()
            if (data.replyId && !data.deleted) {
              reportedReplyIds.add(data.replyId)
            }
          })
          setReportedReplies(reportedReplyIds)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la discussion:", error)
        setError("Une erreur s'est produite lors du chargement de la discussion")
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussion()
  }, [params.id, user])

  // Soumettre une réponse
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push(`/connexion?redirect=/forum/${params.id}`)
      return
    }

    if (!replyContent.trim()) {
      toast({
        title: "Erreur",
        description: "Le contenu de la réponse ne peut pas être vide",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Récupérer les informations complètes de l'utilisateur depuis Firestore
      let userDateInscription = null
      let userStats = { discussions: 0, reponses: 0 }
      
      try {
        const userDocRef = firestoreDoc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          userDateInscription = userData.dateInscription || null
          userStats = userData.stats || { discussions: 0, reponses: 0 }
        }
      } catch (userError) {
        console.warn("Impossible de récupérer les infos utilisateur:", userError)
      }

      // Ajouter la réponse
      const replyRef = await addDoc(collection(db, "forum_reponses"), {
        contenu: replyContent.trim(),
        auteur: {
          id: user.uid,
          nom: user.displayName || "Utilisateur anonyme",
          avatar: user.photoURL || "",
          dateInscription: userDateInscription,
          stats: userStats,
        },
        dateCreation: serverTimestamp(),
        discussionId: params.id,
        likes: 0,
      })

      // Mettre à jour le compteur de réponses et la date de dernière réponse
      await updateDoc(firestoreDoc(db, "forum_discussions", params.id as string), {
        reponses: increment(1),
        derniereReponse: serverTimestamp(),
      })

      // Mettre à jour les statistiques de l'utilisateur
      try {
        await updateDoc(firestoreDoc(db, "users", user.uid), {
          "stats.reponses": increment(1),
        })
      } catch (statsError) {
        console.error("Erreur lors de la mise à jour des statistiques:", statsError)
      }

      // Ajouter la nouvelle réponse à l'état local
      const newReply = {
        id: replyRef.id,
        contenu: replyContent.trim(),
        auteur: {
          id: user.uid,
          nom: user.displayName || "Utilisateur anonyme",
          avatar: user.photoURL || "",
          dateInscription: userDateInscription,
          stats: userStats,
        },
        dateCreation: new Date(),
        discussionId: params.id,
        likes: 0,
      }

      setReplies([...replies, newReply])
      setReplyContent("")

      toast({
        title: "Réponse publiée",
        description: "Votre réponse a été publiée avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la publication de votre réponse",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handlers pour aimer, partager, signaler
  const handleLikeDiscussion = async () => {
    if (!user) return toast({ title: "Connexion requise", description: "Connectez-vous pour aimer." })
    
    try {
      if (hasLikedDiscussion) {
        // Retirer le like
        const likesQuery = query(
          collection(db, "forum_likes"),
          where("userId", "==", user.uid),
          where("discussionId", "==", params.id as string),
          where("type", "==", "discussion")
        )
        const likesSnap = await getDocs(likesQuery)
        
        // Supprimer le document de like
        const deletePromises = likesSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "forum_likes", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        // Décrémenter le compteur de likes
        await updateDoc(firestoreDoc(db, "forum_discussions", params.id as string), { likes: increment(-1) })
        setDiscussion((prev: any) => prev && { ...prev, likes: Math.max(0, (prev.likes || 1) - 1) })
        setHasLikedDiscussion(false)
        toast({ title: "J'aime retiré", description: "Vous avez retiré votre like." })
      } else {
        // Ajouter le like
        await addDoc(collection(db, "forum_likes"), {
          userId: user.uid,
          discussionId: params.id as string,
          type: "discussion",
          date: serverTimestamp(),
        })
        
        await updateDoc(firestoreDoc(db, "forum_discussions", params.id as string), { likes: increment(1) })
        setDiscussion((prev: any) => prev && { ...prev, likes: (prev.likes || 0) + 1 })
        setHasLikedDiscussion(true)
        toast({ title: "J'aime ajouté !", description: "Vous avez aimé cette discussion." })
      }
    } catch (e) {
      console.error("Erreur lors du like:", e)
      toast({ title: "Erreur", description: "Impossible de modifier le like.", variant: "destructive" })
    }
  }

  const handleShareDiscussion = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: "Lien copié !", description: "Le lien de la discussion a été copié." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier le lien." })
    }
  }

  const handleReportDiscussion = async () => {
    try {
      if (hasReportedDiscussion) {
        // Annuler le signalement
        const reportsQuery = query(
          collection(db, "forum_signals"),
          where("userId", "==", user?.uid),
          where("discussionId", "==", params.id as string),
          where("type", "==", "discussion")
        )
        const reportsSnap = await getDocs(reportsQuery)
        
        // Supprimer les documents de signalement
        const deletePromises = reportsSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "forum_signals", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        setHasReportedDiscussion(false)
        toast({ title: "Signalement annulé", description: "Vous avez annulé votre signalement." })
      } else {
        // Ajouter le signalement
        await addDoc(collection(db, "forum_signals"), {
          type: "discussion",
          discussionId: params.id as string,
          userId: user ? user.uid : null,
          date: serverTimestamp(),
        })
        setHasReportedDiscussion(true)
        toast({ title: "Signalement envoyé", description: "Merci pour votre signalement." })
      }
    } catch (e) {
      console.error("Erreur lors du signalement:", e)
      toast({ title: "Erreur", description: "Impossible de modifier le signalement.", variant: "destructive" })
    }
  }

  const handleLikeReply = async (replyId: string) => {
    if (!user) return toast({ title: "Connexion requise", description: "Connectez-vous pour aimer." })
    
    try {
      if (likedReplies.has(replyId)) {
        // Retirer le like
        const likesQuery = query(
          collection(db, "forum_likes"),
          where("userId", "==", user.uid),
          where("replyId", "==", replyId),
          where("type", "==", "reply")
        )
        const likesSnap = await getDocs(likesQuery)
        
        // Supprimer le document de like
        const deletePromises = likesSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "forum_likes", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        // Décrémenter le compteur de likes
        await updateDoc(firestoreDoc(db, "forum_reponses", replyId), { likes: increment(-1) })
        setReplies((prev) => prev.map(r => r.id === replyId ? { ...r, likes: Math.max(0, (r.likes || 1) - 1) } : r))
        
        const newLikedReplies = new Set(likedReplies)
        newLikedReplies.delete(replyId)
        setLikedReplies(newLikedReplies)
        
        toast({ title: "J'aime retiré", description: "Vous avez retiré votre like." })
      } else {
        // Ajouter le like
        await addDoc(collection(db, "forum_likes"), {
          userId: user.uid,
          discussionId: params.id as string,
          replyId: replyId,
          type: "reply",
          date: serverTimestamp(),
        })
        
        await updateDoc(firestoreDoc(db, "forum_reponses", replyId), { likes: increment(1) })
        setReplies((prev) => prev.map(r => r.id === replyId ? { ...r, likes: (r.likes || 0) + 1 } : r))
        setLikedReplies(new Set([...likedReplies, replyId]))
        toast({ title: "J'aime ajouté !", description: "Vous avez aimé cette réponse." })
      }
    } catch (e) {
      console.error("Erreur lors du like:", e)
      toast({ title: "Erreur", description: "Impossible de modifier le like.", variant: "destructive" })
    }
  }

  const handleReportReply = async (replyId: string) => {
    try {
      if (reportedReplies.has(replyId)) {
        // Annuler le signalement
        const reportsQuery = query(
          collection(db, "forum_signals"),
          where("userId", "==", user?.uid),
          where("replyId", "==", replyId),
          where("type", "==", "reply")
        )
        const reportsSnap = await getDocs(reportsQuery)
        
        // Supprimer les documents de signalement
        const deletePromises = reportsSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "forum_signals", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        const newReportedReplies = new Set(reportedReplies)
        newReportedReplies.delete(replyId)
        setReportedReplies(newReportedReplies)
        
        toast({ title: "Signalement annulé", description: "Vous avez annulé votre signalement." })
      } else {
        // Ajouter le signalement
        await addDoc(collection(db, "forum_signals"), {
          type: "reply",
          replyId,
          discussionId: params.id as string,
          userId: user ? user.uid : null,
          date: serverTimestamp(),
        })
        setReportedReplies(new Set([...reportedReplies, replyId]))
        toast({ title: "Signalement envoyé", description: "Merci pour votre signalement." })
      }
    } catch (e) {
      console.error("Erreur lors du signalement:", e)
      toast({ title: "Erreur", description: "Impossible de modifier le signalement.", variant: "destructive" })
    }
  }

  const handleShareReply = async (replyId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/forum/${params.id as string}#reply-${replyId}`)
      toast({ title: "Lien copié !", description: "Le lien de la réponse a été copié." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de copier le lien.", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex justify-center items-center p-8">
            <p className="text-black">Chargement de la discussion...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-4 text-black">Erreur</h2>
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => router.push("/forum")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour au forum
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!discussion) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/forum")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour au forum
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Badge>{discussion.categorie}</Badge>
                <span className="text-xs text-gray-600">{formatRelativeTime(discussion.dateCreation)}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {discussion.reponses} réponses
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {discussion.vues} vues
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-black">{discussion.titre}</h1>

            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={discussion.auteur?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={discussion.auteur?.nom || "Utilisateur"}
                />
                <AvatarFallback>{discussion.auteur?.nom ? discussion.auteur.nom.charAt(0) : "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-black">{discussion.auteur?.nom || "Utilisateur anonyme"}</p>
                <p className="text-xs text-gray-600">
                  Membre depuis {formatRelativeTime(discussion.auteur?.dateInscription)}
                </p>
              </div>
            </div>

            <div
              className="prose prose-gray max-w-none mb-6 text-black"
              dangerouslySetInnerHTML={{ __html: discussion.contenu }}
            />

            <div className="flex justify-between items-center pt-4 border-t border-gray-300">
              <div className="flex gap-2">
                <Button 
                  variant={hasLikedDiscussion ? "default" : "ghost"} 
                  size="sm" 
                  onClick={handleLikeDiscussion}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" /> 
                  {hasLikedDiscussion ? "Ne plus aimer" : "J'aime"} {discussion.likes || 0}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShareDiscussion}>
                  <Share2 className="h-4 w-4 mr-2" /> Partager
                </Button>
              </div>
              <Button 
                variant={hasReportedDiscussion ? "destructive" : "ghost"} 
                size="sm" 
                onClick={handleReportDiscussion}
              >
                <Flag className="h-4 w-4 mr-2" /> 
                {hasReportedDiscussion ? "Annuler le signalement" : "Signaler"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-black">
                {replies.length} {replies.length === 1 ? "réponse" : "réponses"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {replies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Aucune réponse pour le moment. Soyez le premier à répondre !</p>
                </div>
              ) : (
                replies.map((reply) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-300 pb-6 last:border-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={reply.auteur?.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={reply.auteur?.nom || "Utilisateur"}
                        />
                        <AvatarFallback>{reply.auteur?.nom ? reply.auteur.nom.charAt(0) : "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-black">{reply.auteur?.nom || "Utilisateur anonyme"}</p>
                        <p className="text-xs text-gray-600">{formatRelativeTime(reply.dateCreation)}</p>
                      </div>
                    </div>

                    <div
                      className="prose prose-gray max-w-none mb-4 text-black"
                      dangerouslySetInnerHTML={{ __html: reply.contenu }}
                    />

                    <div className="flex gap-2">
                      <Button 
                        variant={likedReplies.has(reply.id) ? "default" : "ghost"} 
                        size="sm" 
                        onClick={() => handleLikeReply(reply.id)}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" /> 
                        {likedReplies.has(reply.id) ? "Ne plus aimer" : "J'aime"} {reply.likes || 0}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShareReply(reply.id)}>
                        <Share2 className="h-3 w-3 mr-1" /> Partager
                      </Button>
                      <Button 
                        variant={reportedReplies.has(reply.id) ? "destructive" : "ghost"} 
                        size="sm" 
                        onClick={() => handleReportReply(reply.id)}
                      >
                        <Flag className="h-3 w-3 mr-1" /> 
                        {reportedReplies.has(reply.id) ? "Annuler" : "Signaler"}
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}

              <form onSubmit={handleSubmitReply} className="pt-4">
                <h3 className="text-lg font-medium mb-4 text-black">Ajouter une réponse</h3>
                {!user && (
                  <div className="bg-gray-800/50 p-4 rounded-md mb-4">
                    <p className="text-sm text-black">
                      Vous devez être connecté pour répondre.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto hover:text-gray-800"
                        onClick={() => router.push(`/connexion?redirect=/forum/${params.id}`)}
                      >
                        Se connecter
                      </Button>
                    </p>
                  </div>
                )}
                <Textarea
                  placeholder="Votre réponse..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[150px] mb-4"
                  disabled={!user || isSubmitting}
                />
                <Button type="submit" disabled={!user || isSubmitting}>
                  {isSubmitting ? "Publication en cours..." : "Publier la réponse"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-black">Discussions similaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {similarDiscussions.length > 0 ? (
                similarDiscussions.map((discussion) => (
                  <div key={discussion.id} className="space-y-1">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-left hover:text-gray-800 transition-colors line-clamp-2 text-black"
                      onClick={() => router.push(`/forum/${discussion.id}`)}
                    >
                      {discussion.titre}
                    </Button>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MessageSquare className="h-3 w-3" />
                      <span>{discussion.reponses || 0} réponses</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Aucune discussion similaire trouvée.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-black">À propos de l'auteur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={discussion.auteur?.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={discussion.auteur?.nom || "Utilisateur"}
                  />
                  <AvatarFallback>{discussion.auteur?.nom ? discussion.auteur.nom.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-black">{discussion.auteur?.nom || "Utilisateur anonyme"}</p>
                  <p className="text-xs text-gray-600">
                    Membre depuis {formatRelativeTime(discussion.auteur?.dateInscription)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Discussions</span>
                  <span className="text-black">{discussion.auteur?.stats?.discussions || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Réponses</span>
                  <span className="text-black">{discussion.auteur?.stats?.reponses || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
