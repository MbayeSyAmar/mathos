"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  UserCheck,
  RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import {
  getDemandesByStatus,
  getDemandesStats,
  updateDemandeStatus,
  type DemandeEncadrement,
} from "@/lib/services/demande-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminDemandesPage() {
  const router = useRouter()
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [demandes, setDemandes] = useState<DemandeEncadrement[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, contacted: 0 })
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "approved" | "rejected" | "contacted">("pending")
  const [selectedDemande, setSelectedDemande] = useState<DemandeEncadrement | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | "contact" | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [processing, setProcessing] = useState(false)

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (userData && !['super_admin', 'teacher', 'tutor'].includes(userData.role)) {
      router.push('/dashboard')
    }
  }, [userData, router])

  const fetchDemandes = async () => {
    try {
      setLoading(true)
      
      // Récupérer les statistiques
      const statsData = await getDemandesStats()
      setStats(statsData)
      
      // Récupérer les demandes selon l'onglet sélectionné
      let demandesData: DemandeEncadrement[]
      
      if (selectedTab === "all") {
        demandesData = await getDemandesByStatus()
      } else {
        demandesData = await getDemandesByStatus(selectedTab)
      }
      
      setDemandes(demandesData)
    } catch (error) {
      console.error("Error fetching demandes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && userData) {
      fetchDemandes()
    }
  }, [user, userData, selectedTab])

  const handleAction = (demande: DemandeEncadrement, action: "approve" | "reject" | "contact") => {
    setSelectedDemande(demande)
    setActionType(action)
    setAdminNotes("")
    setDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedDemande || !actionType || !user) return

    try {
      setProcessing(true)
      
      const statusMap = {
        approve: 'approved' as const,
        reject: 'rejected' as const,
        contact: 'contacted' as const,
      }
      
      await updateDemandeStatus(
        selectedDemande.id,
        statusMap[actionType],
        user.uid,
        adminNotes || undefined
      )
      
      // Recharger les demandes
      await fetchDemandes()
      
      setDialogOpen(false)
      setSelectedDemande(null)
      setActionType(null)
      setAdminNotes("")
    } catch (error) {
      console.error("Error processing demande:", error)
      alert("Erreur lors du traitement de la demande")
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "d MMM yyyy à HH:mm", { locale: fr })
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "En attente", className: "bg-orange-500", icon: Clock },
      approved: { label: "Approuvée", className: "bg-green-600", icon: CheckCircle },
      rejected: { label: "Refusée", className: "bg-red-600", icon: XCircle },
      contacted: { label: "Contacté", className: "bg-blue-600", icon: UserCheck },
    }
    const { label, className, icon: Icon } = config[status as keyof typeof config] || { 
      label: status, 
      className: "bg-gray-500", 
      icon: Clock 
    }
    
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading && demandes.length === 0) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div className="flex items-center justify-between mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Demandes d'Encadrement</h1>
            <p className="text-muted-foreground">Gérer les demandes des étudiants</p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchDemandes} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </motion.div>

      {/* Statistiques */}
      <motion.div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
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
            <div className="text-2xl font-bold text-blue-600">{stats.contacted}</div>
            <p className="text-xs text-muted-foreground">Contactés</p>
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

      {/* Tableau des demandes */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Liste des demandes</CardTitle>
            <CardDescription>Filtrez et gérez les demandes d'encadrement</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
                <TabsTrigger value="contacted">Contactés ({stats.contacted})</TabsTrigger>
                <TabsTrigger value="approved">Approuvées ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Refusées ({stats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                {demandes.length === 0 ? (
                  <div className="text-center py-10">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune demande à afficher</p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Niveau</TableHead>
                          <TableHead>Formule</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {demandes.map((demande) => (
                          <TableRow key={demande.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{demande.studentName}</div>
                                <div className="text-sm text-muted-foreground">{demande.studentEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell>{demande.level}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{demande.formule}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(demande.createdAt)}</TableCell>
                            <TableCell>{getStatusBadge(demande.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDemande(demande)
                                    setDialogOpen(true)
                                    setActionType(null)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {demande.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAction(demande, 'contact')}
                                    >
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Contacter
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600"
                                      onClick={() => handleAction(demande, 'approve')}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approuver
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600"
                                      onClick={() => handleAction(demande, 'reject')}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Refuser
                                    </Button>
                                  </>
                                )}
                              </div>
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

      {/* Dialog de détails/action */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionType ? 
                `${actionType === 'approve' ? 'Approuver' : actionType === 'reject' ? 'Refuser' : 'Contacter'} la demande` 
                : 'Détails de la demande'}
            </DialogTitle>
            <DialogDescription>
              {selectedDemande?.studentName} - {selectedDemande?.studentEmail}
            </DialogDescription>
          </DialogHeader>

          {selectedDemande && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Niveau</Label>
                  <p className="font-medium">{selectedDemande.level}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Matière</Label>
                  <p className="font-medium">{selectedDemande.subject}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Formule</Label>
                  <p className="font-medium">{selectedDemande.formule}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Téléphone</Label>
                  <p className="font-medium">{selectedDemande.studentPhone || 'Non renseigné'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Objectifs</Label>
                <p className="text-sm mt-1">{selectedDemande.objectifs}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Disponibilités</Label>
                <p className="text-sm mt-1">{selectedDemande.disponibilites}</p>
              </div>

              {actionType && (
                <div>
                  <Label htmlFor="notes">Notes administratives (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ajoutez des notes sur cette demande..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </div>
          )}

          {actionType && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>
                Annuler
              </Button>
              <Button onClick={confirmAction} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  `Confirmer ${actionType === 'approve' ? "l'approbation" : actionType === 'reject' ? 'le refus' : 'le contact'}`
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
