"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
  Search,
  Plus,
  Users,
  User,
  Target,
  Zap,
  Award,
  ArrowRight,
  Flame,
  Sparkles,
  PenLine,
} from "lucide-react"
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
  dateCreation: any
  categorie: string
  reponses: number
  vues: number
  derniereReponse: any
  contenu: string
  estPopulaire: boolean
  estNouveau: boolean
}

// Catégories du forum
const categories = [
  { id: "tous", name: "Toutes", icon: "💬", color: "from-blue-500 to-cyan-500" },
  { id: "analyse", name: "Analyse", icon: "📊", color: "from-purple-500 to-pink-500" },
  { id: "algebre", name: "Algèbre", icon: "🔢", color: "from-green-500 to-emerald-500" },
  { id: "geometrie", name: "Géométrie", icon: "📐", color: "from-orange-500 to-red-500" },
  { id: "probabilites", name: "Probabilités", icon: "🎲", color: "from-indigo-500 to-blue-500" },
  { id: "concours", name: "Concours", icon: "🏆", color: "from-yellow-500 to-orange-500" },
]

const highlightTopics = [
  "Questions flash",
  "Méthodes visuelles",
  "Révisions Bac",
  "Olympiades",
  "Python & IA",
  "Défis hebdo",
]

const getCategoryColor = (category: string) => {
  const cat = categories.find((c) => c.id === category)
  if (cat) {
    return `bg-gradient-to-r ${cat.color} text-white border-0`
  }
  return "bg-primary/10 text-primary border-primary/20"
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
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`

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
        const discussionsRef = collection(db, "forum_discussions")
        const discussionsSnapshot = await getDocs(discussionsRef)
        const discussionsCount = discussionsSnapshot.size

        const reponsesRef = collection(db, "forum_reponses")
        const reponsesSnapshot = await getDocs(reponsesRef)
        const messagesCount = discussionsCount + reponsesSnapshot.size

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
          if (typeof ts === "number") return ts
          if (ts instanceof Date) return ts.getTime()
          if (ts.toDate && typeof ts.toDate === "function") return ts.toDate().getTime()
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
  const filteredDiscussions = useMemo(() => {
    const queryLower = searchQuery.toLowerCase()
    return discussions.filter(
      (discussion) =>
        discussion.titre?.toLowerCase().includes(queryLower) ||
        discussion.contenu?.toLowerCase().includes(queryLower),
    )
  }, [discussions, searchQuery])

  const featuredDiscussion = filteredDiscussions[0] ?? discussions[0]

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
        staggerChildren: 0.08,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background py-16 md:py-24">
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
                <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-primary/80">
                <Sparkles className="h-4 w-4" />
                Communauté Mathosphère
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Forum Mathématique Collaboratif
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Posez vos questions, partagez vos astuces et collaborez avec une communauté passionnée qui progresse ensemble au quotidien.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
              <div className="flex items-center justify-center gap-2 rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur-sm">
                <Target className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Discussions actives</p>
                  <p className="text-lg font-semibold">{stats.discussions}+</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur-sm">
                <Zap className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Messages postés</p>
                  <p className="text-lg font-semibold">{stats.messages}+</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur-sm">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Membres</p>
                  <p className="text-lg font-semibold">{stats.membres}+</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="gap-2" onClick={handleNewDiscussion}>
                <Plus className="h-4 w-4" />
                Ouvrir une discussion
              </Button>
              <Button variant="outline" className="gap-2 border-dashed">
                <PenLine className="h-4 w-4" />
                Rédiger une astuce
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container -mt-8 relative z-20 mb-10 w-full">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="rounded-3xl border-2 shadow-xl">
            <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Rechercher un fil, un auteur ou un mot-clé..."
                  className="h-12 rounded-full border-0 bg-muted/60 pl-12 text-base shadow-inner focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
                  {filteredDiscussions.length} discussions disponibles
                </Badge>
                <Badge variant="outline" className="rounded-full border-dashed px-4 py-1 text-sm">
                  Réponses en moins de 24h
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="container flex-1 space-y-10 pb-8">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {featuredDiscussion ? (
          <motion.div
            className="group rounded-3xl border bg-card shadow-sm overflow-hidden"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-3 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`${getCategoryColor(featuredDiscussion.categorie)} font-semibold`}>
                  Fil mis en avant
                </Badge>
                {featuredDiscussion.estPopulaire && (
                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 font-semibold">Populaire</Badge>
                )}
                {featuredDiscussion.estNouveau && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 font-semibold">Nouveau</Badge>
                )}
              </div>
              <Link href={`/forum/${featuredDiscussion.id}`}>
                <h2 className="text-3xl font-bold leading-tight tracking-tight transition-colors hover:text-primary">
                  {featuredDiscussion.titre}
                </h2>
              </Link>
              <p className="text-lg text-muted-foreground">
                {featuredDiscussion.contenu
                  ? featuredDiscussion.contenu.replace(/<[^>]*>/g, "").substring(0, 220) + "..."
                  : "Aucun contenu disponible pour cette discussion."}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {featuredDiscussion.auteur?.nom || "Utilisateur anonyme"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {formatRelativeTime(featuredDiscussion.dateCreation)}
                </div>
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <MessageSquare className="h-4 w-4" />
                  {featuredDiscussion.reponses || 0} réponses
                </div>
              </div>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href={`/forum/${featuredDiscussion.id}`}>
                  Continuer la discussion
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <Card className="rounded-3xl border-dashed py-10 text-center">
            <CardContent>
              <p className="text-lg font-semibold mb-3">Aucune discussion sélectionnée</p>
              <p className="text-muted-foreground mb-6">
                Lancez la première question pour inspirer la communauté.
              </p>
              <Button onClick={handleNewDiscussion} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une discussion
              </Button>
            </CardContent>
          </Card>
        )}

        <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
          <Card className="border-muted/60 bg-card/60 backdrop-blur rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl">Communauté active</CardTitle>
              <CardDescription>Des chiffres qui montrent l&apos;énergie du forum.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                { label: "Discussions", value: stats.discussions },
                { label: "Messages", value: stats.messages },
                { label: "Membres", value: stats.membres },
                { label: "Dernier membre", value: stats.dernierMembre || "Inconnu" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeIn} className="rounded-2xl border bg-muted/30 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-foreground/5 rounded-3xl">
            <CardHeader className="space-y-2">
              <CardTitle>Tendances du moment</CardTitle>
              <CardDescription>Les sujets que tout le monde explore.</CardDescription>
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

      <div className="space-y-8">
        <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full space-y-6 pb-4">
          <TabsList className="grid w-full grid-cols-2 gap-3 rounded-3xl bg-muted/50 p-2 shadow-lg sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center justify-center gap-2 rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold transition-all data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-4">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
                    <p className="mt-4 text-muted-foreground">Chargement des discussions...</p>
                  </div>
                ) : filteredDiscussions.length > 0 ? (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                    {filteredDiscussions.map((discussion) => (
                      <motion.div key={discussion.id} variants={fadeIn}>
                        <Card className="group overflow-hidden rounded-3xl border border-muted/60 bg-card/70 backdrop-blur transition hover:border-primary/40">
                          <CardContent className="p-6 space-y-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={`${getCategoryColor(discussion.categorie)} font-medium`}>
                                  {discussion.categorie}
                                </Badge>
                                {discussion.estNouveau && (
                                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200">Nouveau</Badge>
                                )}
                                {discussion.estPopulaire && (
                                  <Badge className="bg-orange-500/15 text-orange-600 border-orange-200">Populaire</Badge>
                                )}
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">
                                {formatRelativeTime(discussion.dateCreation)}
                              </span>
                            </div>

                            <Link href={`/forum/${discussion.id}`} className="block space-y-3">
                              <h3 className="text-xl font-semibold leading-tight transition-colors hover:text-primary">
                                {discussion.titre}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2">
                                {discussion.contenu && typeof discussion.contenu === "string"
                                  ? discussion.contenu.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
                                  : "Aucun contenu disponible"}
                              </p>
                            </Link>

                            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-primary/20">
                                  <AvatarImage
                                    src={discussion.auteur?.avatar || "/placeholder.svg?height=40&width=40"}
                                    alt={discussion.auteur?.nom || "Utilisateur"}
                                  />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {discussion.auteur?.nom ? discussion.auteur.nom.charAt(0).toUpperCase() : "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {discussion.auteur?.nom || "Utilisateur anonyme"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Dernière réponse {formatRelativeTime(discussion.derniereReponse)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1 font-semibold text-foreground">
                                  <MessageSquare className="h-4 w-4 text-primary" />
                                  {discussion.reponses || 0}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1 font-semibold text-foreground">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  {discussion.vues || 0}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <Card className="rounded-3xl border-dashed py-16 text-center">
                    <CardContent>
                      <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Aucune discussion trouvée</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchQuery
                          ? `Aucune discussion ne correspond à "${searchQuery}".`
                          : "Soyez la première personne à lancer un sujet passionnant !"}
                      </p>
                      <Button onClick={handleNewDiscussion} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Créer une nouvelle discussion
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="rounded-3xl border bg-card/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="h-5 w-5 text-primary" />
                      Statistiques en direct
                    </CardTitle>
                    <CardDescription>Un aperçu de l&apos;activité en temps réel.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Membres en ligne", value: `${stats.membresEnLigne}` },
                      { label: "Invités actifs", value: `${stats.invitesEnLigne}` },
                      { label: "Dernier inscrit", value: stats.dernierMembre || "Inconnu" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border bg-card/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-green-500" />
                      Membres en ligne
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {membresEnLigne.map((membre, i) => (
                        <Avatar key={membre.id} className="h-10 w-10 border border-green-400 bg-background">
                          <AvatarImage src={membre.photoURL || `/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback className="bg-green-500/10 text-green-700">
                            {membre.displayName?.charAt(0) || `U${i}`}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {stats.membresEnLigne > membresEnLigne.length && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-primary text-xs font-bold text-primary">
                          +{stats.membresEnLigne - membresEnLigne.length}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        {stats.membresEnLigne} membres connectés
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                        {stats.invitesEnLigne} invités en navigation
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border bg-card/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                      Discussions populaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {discussions.filter((d) => d.estPopulaire).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Encore aucune discussion populaire.</p>
                    )}
                    {discussions
                      .filter((d) => d.estPopulaire)
                      .slice(0, 3)
                      .map((discussion) => (
                        <Link
                          key={discussion.id}
                          href={`/forum/${discussion.id}`}
                          className="block rounded-2xl border border-dashed px-4 py-3 transition hover:border-primary/40"
                        >
                          <p className="text-sm font-medium text-foreground line-clamp-2">{discussion.titre}</p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            {discussion.reponses || 0} réponses
                          </div>
                        </Link>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  )
}
