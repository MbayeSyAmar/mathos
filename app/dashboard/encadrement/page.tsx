"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Video, MessageSquare, FileText, CheckCircle, Star, Loader2, AlertCircle, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEncadrement } from "@/hooks/use-encadrement"
import { useAuth } from "@/lib/auth-context"
import { ChatInterface } from "@/components/chat-interface"
import {
  getConversationByParticipants,
  createConversation,
  type Conversation,
} from "@/lib/services/messaging-service"
import {
  getStudentProgress,
  type StudentProgress,
} from "@/lib/services/student-progress-service"
import {
  getUserBadges,
  checkAndUnlockBadges,
  type Badge as BadgeType,
} from "@/lib/services/badges-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

export default function EncadrementDashboardPage() {
  const router = useRouter()
  const { user, userData } = useAuth()
  const {
    loading,
    error,
    encadrement,
    teacher,
    upcomingSessions,
    pastSessions,
    messages,
    progression,
    resources,
    refreshData,
  } = useEncadrement()

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null)
  const [userBadges, setUserBadges] = useState<BadgeType[]>([])
  const [loadingChat, setLoadingChat] = useState(true)

  useEffect(() => {
    if (user && encadrement && teacher) {
      initializeConversation()
      loadStudentProgress()
    }
  }, [user, encadrement, teacher])

  const initializeConversation = async () => {
    if (!user || !encadrement || !teacher) return

    try {
      setLoadingChat(true)
      let conv = await getConversationByParticipants(user.uid, teacher.uid)
      
      if (!conv) {
        // Créer une nouvelle conversation
        const convId = await createConversation(
          user.uid,
          userData?.displayName || user.email || "Étudiant",
          teacher.uid,
          teacher.displayName,
          encadrement.id
        )
        conv = await getConversationByParticipants(user.uid, teacher.uid)
      }
      
      setConversation(conv)
    } catch (error) {
      console.error("Error initializing conversation:", error)
      toast.error("Erreur lors de l'initialisation du chat")
    } finally {
      setLoadingChat(false)
    }
  }

  const loadStudentProgress = async () => {
    if (!user) return

    try {
      const progress = await getStudentProgress(user.uid)
      setStudentProgress(progress)
      
      if (progress) {
        // Récupérer les badges
        const badges = getUserBadges(progress.badges)
        setUserBadges(badges)
        
        // Vérifier les nouveaux badges
        const newBadges = await checkAndUnlockBadges(user.uid)
        if (newBadges.length > 0) {
          newBadges.forEach((badge) => {
            toast.success(`🎉 Nouveau badge débloqué : ${badge.title}!`, {
              description: badge.description,
            })
          })
          // Recharger la progression
          const updatedProgress = await getStudentProgress(user.uid)
          setStudentProgress(updatedProgress)
          if (updatedProgress) {
            setUserBadges(getUserBadges(updatedProgress.badges))
          }
        }
      }
    } catch (error) {
      console.error("Error loading student progress:", error)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "EEEE d MMMM yyyy", { locale: fr })
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "HH:mm", { locale: fr })
  }

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "d MMM yyyy", { locale: fr })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "confirmé", className: "bg-green-600" },
      scheduled: { label: "planifié", className: "bg-blue-600" },
      completed: { label: "terminé", className: "bg-gray-600" },
      cancelled: { label: "annulé", className: "bg-red-600" },
    }
    return statusConfig[status as keyof typeof statusConfig] || { label: status, className: "bg-gray-500" }
  }

  // Données simulées pour l'encadrement
  const encadrementData = {
    formule: "Formule Intensive",
    enseignant: {
      name: "Thomas Martin",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Professeur agrégé de mathématiques",
      rating: 4.9,
      speciality: "Préparation aux concours",
    },
    prochaineSessions: [
      {
        id: 1,
        date: "Lundi 15 avril 2024",
        heure: "16:00 - 17:00",
        sujet: "Révision des nombres complexes",
        statut: "confirmé",
      },
      {
        id: 2,
        date: "Jeudi 18 avril 2024",
        heure: "17:30 - 18:30",
        sujet: "Exercices sur les intégrales",
        statut: "à confirmer",
      },
    ],
    sessionsPrecedentes: [
      {
        id: 3,
        date: "Lundi 8 avril 2024",
        heure: "16:00 - 17:00",
        sujet: "Introduction aux nombres complexes",
        notes: "Revoir la forme trigonométrique et les applications",
        ressources: ["Fiche de cours", "Exercices corrigés"],
      },
      {
        id: 4,
        date: "Jeudi 4 avril 2024",
        heure: "17:30 - 18:30",
        sujet: "Préparation au contrôle sur les suites",
        notes: "Bien maîtriser les suites arithmético-géométriques",
        ressources: ["Annales corrigées", "Fiche méthode"],
      },
      {
        id: 5,
        date: "Lundi 1er avril 2024",
        heure: "16:00 - 17:00",
        sujet: "Exercices sur les suites",
        notes: "Revoir la démonstration par récurrence",
        ressources: ["Exercices supplémentaires"],
      },
    ],
    progression: {
      chapitres: [
        { nom: "Suites numériques", progres: 90 },
        { nom: "Fonctions exponentielles", progres: 75 },
        { nom: "Nombres complexes", progres: 40 },
        { nom: "Intégrales", progres: 20 },
        { nom: "Probabilités", progres: 60 },
      ],
    },
    messages: [
      {
        id: 1,
        from: "Thomas Martin",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "10 avril 2024",
        content:
          "Bonjour Marie, j'ai préparé des exercices supplémentaires sur les nombres complexes pour notre prochaine séance. N'hésitez pas à les consulter avant lundi.",
      },
      {
        id: 2,
        from: "Marie Dupont",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "10 avril 2024",
        content: "Merci beaucoup ! Je vais les regarder ce week-end et préparer mes questions.",
      },
      {
        id: 3,
        from: "Thomas Martin",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "5 avril 2024",
        content: "Excellent travail aujourd'hui sur les suites. Continuez comme ça, vous faites de bons progrès !",
      },
    ],
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

  // État de chargement
  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre encadrement...</p>
        </div>
      </div>
    )
  }

  // Erreur
  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={refreshData} className="mt-4">
          Réessayer
        </Button>
      </div>
    )
  }

  // Pas d'encadrement actif
  if (!encadrement) {
    return (
      <div className="container py-10">
        <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Mon Encadrement Personnalisé</h1>
          </div>
        </motion.div>

        <Card>
          <CardContent className="py-10 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Aucun encadrement actif</h3>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore souscrit à un encadrement personnalisé.
            </p>
            <Button onClick={() => router.push("/encadrement")} className="bg-gray-900 hover:bg-gray-800">
              Découvrir nos formules
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Mon Encadrement Personnalisé</h1>
          <p className="text-muted-foreground">
            <Badge className="bg-gray-900 mr-2">{encadrement.formule}</Badge>
            Suivi individuel avec {teacher?.displayName || "votre enseignant"}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="md:col-span-2 space-y-6">
          {/* Prochaines sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Prochaines sessions</CardTitle>
              <CardDescription>Vos séances d'encadrement à venir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Aucune session planifiée</p>
              ) : (
                upcomingSessions.map((session) => {
                  const statusBadge = getStatusBadge(session.status)
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{session.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(session.date)} • {formatTime(session.date)} ({session.duration} min)
                          </div>
                        </div>
                      </div>
                      <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                    </div>
                  )
                })
              )}

              <Button className="w-full bg-gray-900 hover:bg-gray-800" onClick={() => alert("Fonctionnalité à venir")}>
                Planifier une nouvelle session
              </Button>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="sessions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions">Sessions précédentes</TabsTrigger>
              <TabsTrigger value="progression">Ma progression</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Sessions précédentes */}
            <TabsContent value="sessions" className="mt-6 space-y-4">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                {pastSessions.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">Aucune session passée</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastSessions.map((session) => (
                    <motion.div key={session.id} variants={fadeIn}>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg">{session.subject}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(session.date)} • {formatTime(session.date)} ({session.duration} min)
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => alert("Détails à venir")}>
                              Voir les détails
                            </Button>
                          </div>

                          {session.notes && (
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-1">Notes :</div>
                              <p className="text-sm text-muted-foreground">{session.notes}</p>
                            </div>
                          )}

                          {session.resources && session.resources.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2">Ressources :</div>
                              <div className="flex flex-wrap gap-2">
                                {session.resources.map((ressource, index) => (
                                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {ressource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>

              {pastSessions.length > 0 && (
                <Button variant="outline" className="w-full" onClick={refreshData}>
                  Actualiser
                </Button>
              )}
            </TabsContent>

            {/* Progression */}
            <TabsContent value="progression" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progression par chapitre</CardTitle>
                  <CardDescription>Suivez votre avancement dans chaque chapitre</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {progression.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Aucune progression enregistrée</p>
                  ) : (
                    progression.map((chapter) => (
                      <div key={chapter.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{chapter.chapter}</span>
                          <span className="text-sm text-muted-foreground">{chapter.progress}%</span>
                        </div>
                        <Progress value={chapter.progress} />
                        {chapter.notes && (
                          <p className="text-xs text-muted-foreground italic">{chapter.notes}</p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Échanges avec votre enseignant</CardTitle>
                  <CardDescription>Discutez en temps réel avec {teacher?.displayName}</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingChat ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Chargement du chat...</span>
                    </div>
                  ) : conversation && user && userData ? (
                    <ChatInterface
                      conversation={conversation}
                      currentUserId={user.uid}
                      currentUserName={userData.displayName || user.email?.split("@")[0] || "Étudiant"}
                      currentUserRole="student"
                    />
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Chat non disponible</AlertTitle>
                      <AlertDescription>
                        Impossible de charger le chat. Veuillez réessayer plus tard.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          {/* Carte du professeur */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={teacher?.photoURL || ""} alt={teacher?.displayName} />
                  <AvatarFallback>{teacher?.displayName?.charAt(0) || "P"}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{teacher?.displayName || "Enseignant"}</h2>
                <p className="text-sm text-muted-foreground mb-2">{teacher?.role === "teacher" ? "Professeur" : "Enseignant"}</p>
                {teacher?.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{teacher.rating}/5</span>
                  </div>
                )}
                {teacher?.speciality && (
                  <Badge variant="outline" className="mb-4">
                    {teacher.speciality}
                  </Badge>
                )}
                {teacher?.bio && <p className="text-sm text-muted-foreground mb-4">{teacher.bio}</p>}
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button variant="outline" size="icon" className="h-10 w-full" onClick={() => alert("Messagerie à venir")}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-full" onClick={() => alert("Visio à venir")}>
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-full" onClick={() => alert("Calendrier à venir")}>
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges et Récompenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Badges et Récompenses
              </CardTitle>
              <CardDescription>
                {userBadges.length} badge{userBadges.length > 1 ? "s" : ""} débloqué{userBadges.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentProgress ? (
                <div className="space-y-4">
                  {/* XP Total */}
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="font-medium">Total XP</span>
                    <span className="text-2xl font-bold text-primary">{studentProgress.xp}</span>
                  </div>

                  {/* Badges débloqués */}
                  {userBadges.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Badges débloqués</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {userBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div className="text-2xl mb-1">{badge.icon}</div>
                            <div className="text-xs font-medium mb-1">{badge.title}</div>
                            <div className="text-xs text-muted-foreground">{badge.description}</div>
                            <div className="text-xs text-primary mt-1">+{badge.xpReward} XP</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Aucun badge débloqué pour le moment. Continuez vos efforts !
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Détails de la formule */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de votre formule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{encadrement.formule}</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{encadrement.sessionsPerMonth} séances par mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Programme sur mesure</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Accès illimité aux ressources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Support prioritaire 7j/7</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date de début</span>
                  <span>{formatDateTime(encadrement.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochaine facturation</span>
                  <span>{formatDateTime(encadrement.nextBillingDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant mensuel</span>
                  <span className="font-bold">{encadrement.monthlyAmount}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge
                    className={
                      encadrement.status === "active"
                        ? "bg-green-600"
                        : encadrement.status === "paused"
                          ? "bg-orange-500"
                          : "bg-red-600"
                    }
                  >
                    {encadrement.status === "active" ? "Actif" : encadrement.status === "paused" ? "En pause" : "Annulé"}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => alert("Gestion à venir")}>
                Gérer mon abonnement
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-500 hover:text-red-600"
                onClick={() => {
                  if (confirm("Êtes-vous sûr de vouloir annuler votre encadrement ?")) {
                    alert("Fonctionnalité à venir")
                  }
                }}
              >
                Annuler mon encadrement
              </Button>
            </CardFooter>
          </Card>

          {/* Ressources recommandées */}
          <Card>
            <CardHeader>
              <CardTitle>Ressources recommandées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.length === 0 ? (
                <p className="text-center text-muted-foreground py-2 text-sm">Aucune ressource disponible</p>
              ) : (
                resources.slice(0, 5).map((resource) => (
                  <Link key={resource.id} href={resource.url} target="_blank" className="block group">
                    <h4 className="text-sm font-medium group-hover:text-primary transition-colors">{resource.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {resource.type.toUpperCase()} • Ajouté le {formatDateTime(resource.createdAt)}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
