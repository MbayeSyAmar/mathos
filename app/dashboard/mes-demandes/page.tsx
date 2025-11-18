"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Eye, RefreshCw, AlertCircle, Ban, FileText, Calendar, User, GraduationCap, Target } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getStudentRequests, type EncadrementRequest } from "@/lib/services/encadrement-requests-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { BackButton } from "@/components/back-button"

export default function MesDemandesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [demandes, setDemandes] = useState<EncadrementRequest[]>([])
  const [filteredDemandes, setFilteredDemandes] = useState<EncadrementRequest[]>([])
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedDemande, setSelectedDemande] = useState<EncadrementRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    if (user) {
      fetchDemandes()
    }
  }, [user])

  useEffect(() => {
    filterDemandes()
  }, [selectedTab, demandes])

  const fetchDemandes = async () => {
    if (!user) return

    try {
      setLoading(true)
      const requests = await getStudentRequests(user.uid)
      setDemandes(requests)
      
      setStats({
        total: requests.length,
        pending: requests.filter(d => d.status === "pending").length,
        approved: requests.filter(d => d.status === "approved").length,
        rejected: requests.filter(d => d.status === "rejected").length,
      })

      const recentlyProcessed = requests.filter(d => {
        if (!d.processedAt) return false
        const processedTime = d.processedAt.seconds * 1000
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
        return processedTime > oneDayAgo
      })

      if (recentlyProcessed.length > 0) {
        recentlyProcessed.forEach(req => {
          if (req.status === "approved") {
            toast.success(`Votre demande pour "${req.subject}" a été approuvée !`)
          } else if (req.status === "rejected") {
            toast.error(`Votre demande pour "${req.subject}" a été refusée.`)
          }
        })
      }
    } catch (error) {
      console.error("Error fetching demandes:", error)
      toast.error("Erreur lors du chargement des demandes")
    } finally {
      setLoading(false)
    }
  }

  const filterDemandes = () => {
    if (selectedTab === "all") {
      setFilteredDemandes(demandes)
    } else {
      setFilteredDemandes(demandes.filter(d => d.status === selectedTab))
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "d MMM yyyy à HH:mm", { locale: fr })
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "En attente", className: "bg-orange-500", icon: Clock },
      approved: { label: "Approuvée", className: "bg-green-600", icon: CheckCircle },
      rejected: { label: "Refusée", className: "bg-red-600", icon: XCircle },
      cancelled: { label: "Annulée", className: "bg-gray-600", icon: Ban },
    }
    
    const { label, className, icon: Icon } = config[status as keyof typeof config] || {
      label: status,
      className: "bg-gray-500",
      icon: AlertCircle,
    }
    
    return (
      <Badge className={`${className} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
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

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de vos demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-10 space-y-8">
      <div className="mb-6">
        <BackButton href="/dashboard" label="Retour au dashboard" />
      </div>

      <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Mes Demandes de Formation
        </h1>
        <p className="text-muted-foreground">Suivez l'état de vos demandes d'encadrement</p>
      </motion.div>

      {/* Statistiques */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4" 
        initial="hidden" 
        animate="visible" 
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn}>
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <p className="text-sm text-muted-foreground mt-1">Total</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-orange-500">{stats.pending}</div>
                  <p className="text-sm text-muted-foreground mt-1">En attente</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                  <p className="text-sm text-muted-foreground mt-1">Approuvées</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                  <p className="text-sm text-muted-foreground mt-1">Refusées</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Liste des demandes */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Historique des demandes
                </CardTitle>
                <CardDescription>Consultez le statut de toutes vos demandes</CardDescription>
              </div>
              <Button onClick={fetchDemandes} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  Toutes
                  <Badge variant="secondary">{stats.total}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  En attente
                  <Badge variant="secondary">{stats.pending}</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approuvées
                  <Badge variant="secondary">{stats.approved}</Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Refusées
                  <Badge variant="secondary">{stats.rejected}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                {filteredDemandes.length === 0 ? (
                  <div className="text-center py-16">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {demandes.length === 0 
                        ? "Aucune demande de formation"
                        : "Aucune demande dans cette catégorie"
                      }
                    </p>
                    <p className="text-muted-foreground mb-6">
                      {demandes.length === 0 
                        ? "Commencez par faire une demande d'encadrement"
                        : "Aucune demande ne correspond à ce filtre"
                      }
                    </p>
                    {demandes.length === 0 && (
                      <Button size="lg" onClick={() => router.push("/encadrement")}>
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Faire une demande
                      </Button>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredDemandes.map((demande) => (
                      <motion.div key={demande.id} variants={fadeIn}>
                        <Card className="h-full hover:shadow-lg transition-all border-2">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">{demande.teacherName}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline">{demande.subject}</Badge>
                                  <Badge variant="secondary">{demande.formule}</Badge>
                                </CardDescription>
                              </div>
                              {getStatusBadge(demande.status)}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(demande.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{demande.studentLevel} - {demande.studentClass}</span>
                            </div>
                            {demande.objectives && (
                              <div className="flex items-start gap-2 text-sm">
                                <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <p className="text-muted-foreground line-clamp-2">{demande.objectives}</p>
                              </div>
                            )}
                          </CardContent>
                          <CardContent className="pt-0">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                setSelectedDemande(demande)
                                setDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de détails */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Détails de la demande
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedDemande?.teacherName} - {selectedDemande?.subject}
            </DialogDescription>
          </DialogHeader>

          {selectedDemande && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      Statut
                    </div>
                    {getStatusBadge(selectedDemande.status)}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <GraduationCap className="h-4 w-4" />
                      Formule
                    </div>
                    <p className="font-medium">{selectedDemande.formule}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      Niveau
                    </div>
                    <p className="font-medium">{selectedDemande.studentLevel}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      Classe
                    </div>
                    <p className="font-medium">{selectedDemande.studentClass}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">École</p>
                    <p className="text-sm">{selectedDemande.studentSchool}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Objectifs</p>
                    <p className="text-sm">{selectedDemande.objectives}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Disponibilités</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDemande.availability.map((slot, index) => (
                        <Badge key={index} variant="outline">{slot}</Badge>
                      ))}
                    </div>
                  </div>

                  {selectedDemande.message && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Message</p>
                      <p className="text-sm bg-muted p-3 rounded-lg">{selectedDemande.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      Date de soumission
                    </div>
                    <p className="text-sm font-medium">{formatDate(selectedDemande.createdAt)}</p>
                  </CardContent>
                </Card>

                {selectedDemande.processedAt && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {selectedDemande.status === "approved" ? "Approuvée le" : "Refusée le"}
                      </div>
                      <p className="text-sm font-medium">{formatDate(selectedDemande.processedAt)}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {selectedDemande.rejectionReason && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                  <CardHeader>
                    <CardTitle className="text-base text-red-900 dark:text-red-100">
                      Raison du refus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-800 dark:text-red-200">{selectedDemande.rejectionReason}</p>
                  </CardContent>
                </Card>
              )}

              {selectedDemande.status === "approved" && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CardHeader>
                    <CardTitle className="text-base text-green-900 dark:text-green-100 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Demande approuvée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Votre professeur vous contactera prochainement pour organiser les séances.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
