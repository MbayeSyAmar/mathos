"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Eye, RefreshCw, AlertCircle, Ban } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getStudentRequests, type EncadrementRequest } from "@/lib/services/encadrement-requests-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"
import { toast } from "sonner"

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
      console.log("🔍 Fetching requests for student:", user.uid)
      
      const requests = await getStudentRequests(user.uid)
      console.log("📊 Student requests:", requests)
      
      setDemandes(requests)
      
      // Calculer les stats
      setStats({
        total: requests.length,
        pending: requests.filter(d => d.status === "pending").length,
        approved: requests.filter(d => d.status === "approved").length,
        rejected: requests.filter(d => d.status === "rejected").length,
      })

      // Afficher une notification si une demande a été traitée récemment (dans les dernières 24h)
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
      <Badge className={`${className} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
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

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Mes Demandes de Formation</h1>
        <p className="text-muted-foreground">Suivez l'état de vos demandes d'encadrement</p>
      </motion.div>

      {/* Statistiques */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approuvées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Refusées</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des demandes */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historique des demandes</CardTitle>
                <CardDescription>Consultez le statut de toutes vos demandes</CardDescription>
              </div>
              <Button onClick={fetchDemandes} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approuvées ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Refusées ({stats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                {filteredDemandes.length === 0 ? (
                  <div className="text-center py-10">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {demandes.length === 0 
                        ? "Vous n'avez pas encore de demande de formation"
                        : "Aucune demande dans cette catégorie"
                      }
                    </p>
                    {demandes.length === 0 && (
                      <Button className="mt-4" onClick={() => router.push("/encadrement")}>
                        Faire une demande
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Professeur</TableHead>
                          <TableHead>Matière</TableHead>
                          <TableHead>Formule</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDemandes.map((demande) => (
                          <TableRow key={demande.id}>
                            <TableCell>
                              <div className="font-medium">{demande.teacherName}</div>
                            </TableCell>
                            <TableCell>{demande.subject}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{demande.formule}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(demande.createdAt)}</TableCell>
                            <TableCell>{getStatusBadge(demande.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDemande(demande)
                                  setDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de détails */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              {selectedDemande?.teacherName} - {selectedDemande?.subject}
            </DialogDescription>
          </DialogHeader>

          {selectedDemande && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <div className="mt-1">{getStatusBadge(selectedDemande.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Formule</p>
                  <p className="font-medium mt-1">{selectedDemande.formule}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Niveau</p>
                  <p className="font-medium mt-1">{selectedDemande.studentLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classe</p>
                  <p className="font-medium mt-1">{selectedDemande.studentClass}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">École</p>
                <p className="text-sm mt-1">{selectedDemande.studentSchool}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Objectifs</p>
                <p className="text-sm mt-1">{selectedDemande.objectives}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Disponibilités</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedDemande.availability.map((slot, index) => (
                    <Badge key={index} variant="outline">{slot}</Badge>
                  ))}
                </div>
              </div>

              {selectedDemande.message && (
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="text-sm mt-1">{selectedDemande.message}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Date de soumission</p>
                <p className="text-sm mt-1">{formatDate(selectedDemande.createdAt)}</p>
              </div>

              {selectedDemande.processedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedDemande.status === "approved" ? "Approuvée le" : "Refusée le"}
                  </p>
                  <p className="text-sm mt-1">{formatDate(selectedDemande.processedAt)}</p>
                </div>
              )}

              {selectedDemande.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-semibold text-red-900">Raison du refus</p>
                  <p className="text-sm text-red-800 mt-1">{selectedDemande.rejectionReason}</p>
                </div>
              )}

              {selectedDemande.status === "approved" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm font-semibold text-green-900">✅ Demande approuvée</p>
                  <p className="text-sm text-green-800 mt-1">
                    Votre professeur vous contactera prochainement pour organiser les séances.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
