"use client"

import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Video, MessageSquare, FileText, CheckCircle, Star } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function EncadrementDashboardPage() {
  const router = useRouter()

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

  return (
    <div className="container py-10">
      <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Mon Encadrement Personnalisé</h1>
          <p className="text-muted-foreground">
            <Badge className="bg-gray-900 mr-2">{encadrementData.formule}</Badge>
            Suivi individuel avec {encadrementData.enseignant.name}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prochaines sessions</CardTitle>
              <CardDescription>Vos séances d'encadrement à venir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {encadrementData.prochaineSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{session.sujet}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.date} • {session.heure}
                      </div>
                    </div>
                  </div>
                  <Badge className={session.statut === "confirmé" ? "bg-green-600" : "bg-orange-500"}>
                    {session.statut}
                  </Badge>
                </div>
              ))}

              <Button className="w-full bg-gray-900 hover:bg-gray-800">Planifier une nouvelle session</Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="sessions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions">Sessions précédentes</TabsTrigger>
              <TabsTrigger value="progression">Ma progression</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="sessions" className="mt-6 space-y-4">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                {encadrementData.sessionsPrecedentes.map((session) => (
                  <motion.div key={session.id} variants={fadeIn}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{session.sujet}</h3>
                            <p className="text-sm text-muted-foreground">
                              {session.date} • {session.heure}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Voir les détails
                          </Button>
                        </div>

                        {session.notes && (
                          <div className="mb-4">
                            <div className="text-sm font-medium mb-1">Notes :</div>
                            <p className="text-sm text-muted-foreground">{session.notes}</p>
                          </div>
                        )}

                        {session.ressources && session.ressources.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Ressources :</div>
                            <div className="flex flex-wrap gap-2">
                              {session.ressources.map((ressource, index) => (
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
                ))}
              </motion.div>

              <Button variant="outline" className="w-full">
                Voir toutes les sessions
              </Button>
            </TabsContent>
            <TabsContent value="progression" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progression par chapitre</CardTitle>
                  <CardDescription>Suivez votre avancement dans chaque chapitre</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {encadrementData.progression.chapitres.map((chapitre, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{chapitre.nom}</span>
                        <span className="text-sm text-muted-foreground">{chapitre.progres}%</span>
                      </div>
                      <Progress value={chapitre.progres} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="messages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Échanges avec votre enseignant</CardTitle>
                  <CardDescription>Historique de vos conversations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {encadrementData.messages.map((message) => (
                    <div key={message.id} className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.avatar} alt={message.from} />
                        <AvatarFallback>{message.from.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.from}</span>
                          <span className="text-xs text-muted-foreground">{message.date}</span>
                        </div>

                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  <Separator className="my-4" />

                  <div className="flex gap-2">
                    <Input placeholder="Écrivez votre message..." className="flex-1" />
                    <Button className="bg-gray-900 hover:bg-gray-800">Envoyer</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={encadrementData.enseignant.avatar} alt={encadrementData.enseignant.name} />
                  <AvatarFallback>{encadrementData.enseignant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{encadrementData.enseignant.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{encadrementData.enseignant.role}</p>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{encadrementData.enseignant.rating}/5</span>
                </div>
                <Badge variant="outline" className="mb-4">
                  {encadrementData.enseignant.speciality}
                </Badge>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button variant="outline" size="icon" className="h-10 w-full">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-full">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-full">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails de votre formule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Formule Intensive</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">4 séances de 1h par mois</span>
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
                  <span>1er avril 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prochaine facturation</span>
                  <span>1er mai 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant mensuel</span>
                  <span className="font-bold">89€</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                Gérer mon abonnement
              </Button>
              <Button variant="outline" className="w-full text-red-500 hover:text-red-600">
                Annuler mon encadrement
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ressources recommandées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="#" className="block group">
                <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                  Fiche de cours - Nombres complexes
                </h4>
                <p className="text-xs text-muted-foreground">PDF • Ajouté le 10 avril</p>
              </Link>
              <Link href="#" className="block group">
                <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                  Exercices corrigés - Intégrales
                </h4>
                <p className="text-xs text-muted-foreground">PDF • Ajouté le 8 avril</p>
              </Link>
              <Link href="#" className="block group">
                <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                  Vidéo - Méthode de résolution des équations différentielles
                </h4>
                <p className="text-xs text-muted-foreground">Vidéo • 15:24 • Ajouté le 5 avril</p>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
