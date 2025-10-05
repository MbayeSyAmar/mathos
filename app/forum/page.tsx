"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, TrendingUp, Clock, Eye, Search, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Types pour les discussions du forum
interface ForumDiscussion {
  id: string
  titre: string
  auteur: {
    id: string
    nom: string
    avatar: string
  }
  dateCreation: any // Timestamp Firebase
  categorie: string
  reponses: number
  vues: number
  derniereReponse: any // Timestamp Firebase
  contenu: string
  estPopulaire: boolean
  estNouveau: boolean
}

// Catégories du forum
const categories = [
  { id: "tous", name: "Toutes les discussions" },
  { id: "analyse", name: "Analyse" },
  { id: "algebre", name: "Algèbre" },
  { id: "geometrie", name: "Géométrie" },
  { id: "probabilites", name: "Probabilités" },
  { id: "concours", name: "Préparation aux concours" },
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Analyse":
      return "bg-gray-800 hover:bg-gray-700"
    case "Algèbre":
      return "bg-gray-700 hover:bg-gray-600"
    case "Géométrie":
      return "bg-gray-600 hover:bg-gray-500"
    case "Probabilités":
      return "bg-gray-500 hover:bg-gray-400"
    case "Concours":
      return "bg-gray-900 hover:bg-gray-800"
    default:
      return "bg-gray-700 hover:bg-gray-600"
  }
}

// Fonction pour formater la date relative
const formatRelativeTime = (timestamp: any) => {
  if (!timestamp) return "Date inconnue"

  let date: Date

  if (timestamp instanceof Date) {
    date = timestamp
  } else if (timestamp.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate()
  } else if (timestamp.seconds && timestamp.nanoseconds) {
    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  } else if (typeof timestamp === "number") {
    date = new Date(timestamp)
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp)
  } else {
    return "Date inconnue"
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "À l'instant"
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`

  return `Le ${date.toLocaleDateString()}`
}

export default function ForumPage() {
  const [discussions, setDiscussions] = useState<ForumDiscussion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("tous")
  const [stats, setStats] = useState({
    discussions: 0,
    messages: 0,
    membres: 0,
    dernierMembre: "",
    membresEnLigne: 0,
    invitesEnLigne: 0,
  })
  const [membresEnLigne, setMembresEnLigne] = useState<Array<{ id: string; displayName?: string; photoURL?: string }>>([])
  const { user } = useAuth()
  const router = useRouter()

  // Récupérer les discussions du forum depuis Firestore
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true)

        const discussionsRef = collection(db, "forum_discussions")
        let discussionsQuery

        if (activeCategory !== "tous") {
          discussionsQuery = query(discussionsRef, where("categorie", "==", activeCategory))
        } else {
          discussionsQuery = query(discussionsRef)
        }

        const snapshot = await getDocs(discussionsQuery)

        const discussionsData: ForumDiscussion[] = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data() as any

            const isNew =
              data.dateCreation && new Date().getTime() - data.dateCreation.toDate().getTime() < 24 * 60 * 60 * 1000

            const isPopular = (data.reponses || 0) > 10

            return {
              id: doc.id,
              titre: data.titre || "",
              auteur: data.auteur || { id: "", nom: "", avatar: "" },
              dateCreation: data.dateCreation,
              categorie: data.categorie || "Autre",
              reponses: data.reponses || 0,
              vues: data.vues || 0,
              derniereReponse: data.derniereReponse || data.dateCreation,
              contenu: data.contenu || "",
              estNouveau: isNew,
              estPopulaire: isPopular,
            }
          }),
        )

        discussionsData.sort((a, b) => {
          const dateA = a.dateCreation?.toDate?.() || new Date(a.dateCreation) || new Date(0)
          const dateB = b.dateCreation?.toDate?.() || new Date(b.dateCreation) || new Date(0)
          return dateB.getTime() - dateA.getTime()
        })

        setDiscussions(discussionsData)

        setStats((prev) => ({
          ...prev,
          discussions: discussionsData.length,
          messages: discussionsData.reduce((total, d) => total + (d.reponses || 0), 0),
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des discussions:", error)
        setDiscussions([])
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [activeCategory])

  // Récupérer les statistiques du forum
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Nombre total de discussions
        const discussionsRef = collection(db, "forum_discussions")
        const discussionsSnapshot = await getDocs(discussionsRef)
        const discussionsCount = discussionsSnapshot.size

        // Nombre total de messages (discussions + réponses)
        const reponsesRef = collection(db, "forum_reponses")
        const reponsesSnapshot = await getDocs(reponsesRef)
        const messagesCount = discussionsCount + reponsesSnapshot.size

        // Nombre total de membres
        const membresRef = collection(db, "users")
        const membresSnapshot = await getDocs(membresRef)
        const membresCount = membresSnapshot.size

        type MemberDoc = { id: string; createdAt?: any; displayName?: string; photoURL?: string }
        const membresData: MemberDoc[] = membresSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Record<string, unknown>),
        })) as MemberDoc[]

        const toMillis = (ts: any): number => {
          if (!ts) return 0
          if (typeof ts === 'number') return ts
          if (ts instanceof Date) return ts.getTime()
          if (ts.toDate && typeof ts.toDate === 'function') return ts.toDate().getTime()
          if (ts.seconds) return ts.seconds * 1000
          return 0
        }

        membresData.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))

        let dernierMembre = "Inconnu"
        if (membresData.length > 0) {
          dernierMembre = membresData[0].displayName || "Utilisateur"
        }

        const membresEnLigneData = membresData.slice(0, 8)
        setMembresEnLigne(membresEnLigneData)

        setStats((prev) => ({
          ...prev,
          discussions: discussionsCount,
          messages: messagesCount,
          membres: membresCount,
          dernierMembre,
          membresEnLigne: Math.min(24, membresCount),
          invitesEnLigne: 46,
        }))
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error)
      }
    }

    fetchStats()
  }, [])

  // Filtrer les discussions en fonction de la recherche
  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.contenu?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const handleNewDiscussion = () => {
    if (user) {
      router.push("/forum/nouvelle-discussion")
    } else {
      router.push("/connexion?redirect=/forum/nouvelle-discussion")
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
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-black">Forum Mathosphère</h1>
          <p className="text-gray-600">Échangez avec la communauté sur tous les sujets mathématiques</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
            <Input
              placeholder="Rechercher dans le forum..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleNewDiscussion}>
            <Plus className="h-4 w-4 mr-2" /> Nouvelle discussion
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="tous" className="w-full" onValueChange={handleCategoryChange}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <p className="text-black">Chargement des discussions...</p>
                </div>
              ) : filteredDiscussions.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {filteredDiscussions.map((discussion) => (
                    <motion.div key={discussion.id} variants={fadeIn}>
                      <Card className="overflow-hidden group hover:border-gray-500 transition-colors">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getCategoryColor(discussion.categorie)}`}>
                                  {discussion.categorie}
                                </Badge>
                                {discussion.estNouveau && (
                                  <Badge variant="outline" className="bg-gray-900 text-white border-gray-700">
                                    Nouveau
                                  </Badge>
                                )}
                                {discussion.estPopulaire && (
                                  <Badge variant="outline" className="border-gray-700">
                                    <TrendingUp className="h-3 w-3 mr-1" /> Populaire
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-600">
                                {formatRelativeTime(discussion.dateCreation)}
                              </span>
                            </div>

                            <Link href={`/forum/${discussion.id}`} className="block group">
                              <h3 className="text-xl font-bold mb-2 group-hover:text-gray-800 transition-colors text-black">
                                {discussion.titre}
                              </h3>
                              <p className="text-gray-600 line-clamp-2 mb-4">
                                {discussion.contenu && typeof discussion.contenu === "string"
                                  ? discussion.contenu.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
                                  : "Aucun contenu disponible"}
                              </p>
                            </Link>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={discussion.auteur?.avatar || "/placeholder.svg?height=40&width=40"}
                                    alt={discussion.auteur?.nom || "Utilisateur"}
                                  />
                                  <AvatarFallback>
                                    {discussion.auteur?.nom ? discussion.auteur.nom.charAt(0) : "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-black">
                                  {discussion.auteur?.nom || "Utilisateur anonyme"}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <div className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {discussion.reponses || 0} réponses
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {discussion.vues || 0} vues
                                </div>
                                <div className="hidden md:flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Dernière réponse {formatRelativeTime(discussion.derniereReponse)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2 text-black">Aucune discussion trouvée</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? "Aucune discussion ne correspond à votre recherche."
                      : "Aucune discussion n'a été créée dans cette catégorie."}
                  </p>
                  <Button onClick={handleNewDiscussion}>
                    <Plus className="h-4 w-4 mr-2" /> Créer une nouvelle discussion
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-black">Statistiques du forum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discussions</span>
                <span className="font-medium text-black">{stats.discussions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Messages</span>
                <span className="font-medium text-black">{stats.messages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Membres</span>
                <span className="font-medium text-black">{stats.membres}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dernier membre</span>
                <span className="font-medium text-black">{stats.dernierMembre}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-black">Membres en ligne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {membresEnLigne.map((membre, i) => (
                  <Avatar key={membre.id} className="h-8 w-8 border-2 border-green-500">
                    <AvatarImage src={membre.photoURL || `/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>{membre.displayName?.charAt(0) || `U${i}`}</AvatarFallback>
                  </Avatar>
                ))}
                {stats.membresEnLigne > membresEnLigne.length && (
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs">
                    +{stats.membresEnLigne - membresEnLigne.length}
                  </div>
                )}
              </div>
              <div className="mt-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>{stats.membresEnLigne} membres en ligne</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                  <span>{stats.invitesEnLigne} invités en navigation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-black">Discussions populaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussions
                .filter((d) => d.estPopulaire)
                .slice(0, 3)
                .map((discussion) => (
                  <div key={discussion.id} className="space-y-1">
                    <Link
                      href={`/forum/${discussion.id}`}
                      className="text-sm font-medium hover:text-gray-800 transition-colors line-clamp-1 text-black"
                    >
                      {discussion.titre}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MessageSquare className="h-3 w-3" />
                      <span>{discussion.reponses || 0} réponses</span>
                    </div>
                  </div>
                ))}
              {discussions.filter((d) => d.estPopulaire).length === 0 && (
                <p className="text-sm text-gray-600">Aucune discussion populaire pour le moment.</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/forum?tab=populaires">Voir plus</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
