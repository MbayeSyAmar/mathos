"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Check, X, Eye, Clock, CheckCircle, XCircle, Ban } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  getAllPendingRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  updateRequestNotes,
  getRequestsStats,
  type EncadrementRequest,
} from "@/lib/services/encadrement-requests-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

export default function SuperAdminRequestsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pendingRequests, setPendingRequests] = useState<EncadrementRequest[]>([])
  const [allRequests, setAllRequests] = useState<EncadrementRequest[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 })
  const [selectedRequest, setSelectedRequest] = useState<EncadrementRequest | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [processing, setProcessing] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pending, all, statistics] = await Promise.all([
        getAllPendingRequests(),
        getAllRequests(),
        getRequestsStats(),
      ])
      setPendingRequests(pending)
      setAllRequests(all)
      setStats(statistics)
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Erreur lors du chargement des demandes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async () => {
    if (!selectedRequest || !user) return

    try {
      setProcessing(true)
      await approveRequest(selectedRequest.id, user.uid, adminNotes)
      toast.success("Demande approuvée avec succès")
      setShowApproveDialog(false)
      setAdminNotes("")
      fetchData()
    } catch (error) {
      console.error("Error approving request:", error)
      toast.error("Erreur lors de l'approbation")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest || !user || !rejectionReason.trim()) {
      toast.error("Veuillez indiquer une raison de rejet")
      return
    }

    try {
      setProcessing(true)
      await rejectRequest(selectedRequest.id, user.uid, rejectionReason, adminNotes)
      toast.success("Demande rejetée")
      setShowRejectDialog(false)
      setAdminNotes("")
      setRejectionReason("")
      fetchData()
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("Erreur lors du rejet")
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
    const statusConfig = {
      pending: { label: "En attente", className: "bg-orange-500", icon: Clock },
      approved: { label: "Approuvée", className: "bg-green-600", icon: CheckCircle },
      rejected: { label: "Rejetée", className: "bg-red-600", icon: XCircle },
      cancelled: { label: "Annulée", className: "bg-gray-600", icon: Ban },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const RequestRow = ({ request }: { request: EncadrementRequest }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{request.studentName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{request.studentName}</div>
            <div className="text-sm text-muted-foreground">{request.studentEmail}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{request.studentClass}</div>
        <div className="text-sm text-muted-foreground">{request.studentLevel}</div>
      </TableCell>
      <TableCell>
        <div>{request.teacherName}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{request.formule}</Badge>
      </TableCell>
      <TableCell>{getStatusBadge(request.status)}</TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">{formatDate(request.createdAt)}</div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRequest(request)
              setShowDetailsDialog(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {request.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => {
                  setSelectedRequest(request)
                  setShowApproveDialog(true)
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  setSelectedRequest(request)
                  setShowRejectDialog(true)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Demandes d'Encadrement</h1>
        <p className="text-muted-foreground">Gérer toutes les demandes d'encadrement des étudiants</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annulées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            En attente ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Toutes ({allRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes en attente de traitement</CardTitle>
              <CardDescription>Demandes nécessitant votre attention</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Aucune demande en attente
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Classe/Niveau</TableHead>
                      <TableHead>Professeur</TableHead>
                      <TableHead>Formule</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <RequestRow key={request.id} request={request} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les demandes</CardTitle>
              <CardDescription>Historique complet des demandes</CardDescription>
            </CardHeader>
            <CardContent>
              {allRequests.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Aucune demande
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Classe/Niveau</TableHead>
                      <TableHead>Professeur</TableHead>
                      <TableHead>Formule</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allRequests.map((request) => (
                      <RequestRow key={request.id} request={request} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>Informations complètes sur la demande d'encadrement</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Étudiant</Label>
                  <div className="font-medium">{selectedRequest.studentName}</div>
                  <div className="text-sm text-muted-foreground">{selectedRequest.studentEmail}</div>
                </div>
                <div>
                  <Label>Classe</Label>
                  <div className="font-medium">{selectedRequest.studentClass}</div>
                  <div className="text-sm text-muted-foreground">{selectedRequest.studentLevel}</div>
                </div>
                <div>
                  <Label>École</Label>
                  <div className="font-medium">{selectedRequest.studentSchool}</div>
                </div>
                <div>
                  <Label>Professeur demandé</Label>
                  <div className="font-medium">{selectedRequest.teacherName}</div>
                </div>
                <div>
                  <Label>Formule</Label>
                  <div className="font-medium">{selectedRequest.formule}</div>
                </div>
                <div>
                  <Label>Matière</Label>
                  <div className="font-medium">{selectedRequest.subject}</div>
                </div>
              </div>
              <div>
                <Label>Objectifs</Label>
                <div className="text-sm">{selectedRequest.objectives}</div>
              </div>
              <div>
                <Label>Disponibilités</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.availability.map((slot, index) => (
                    <Badge key={index} variant="outline">{slot}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Message</Label>
                <div className="text-sm">{selectedRequest.message}</div>
              </div>
              {selectedRequest.adminNotes && (
                <div>
                  <Label>Notes admin</Label>
                  <div className="text-sm">{selectedRequest.adminNotes}</div>
                </div>
              )}
              {selectedRequest.rejectionReason && (
                <div>
                  <Label>Raison du rejet</Label>
                  <div className="text-sm text-red-600">{selectedRequest.rejectionReason}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Approbation */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver la demande</DialogTitle>
            <DialogDescription>
              Approuver la demande d'encadrement de {selectedRequest?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-notes">Notes (optionnel)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Ajoutez des notes sur cette approbation..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={processing}>
              Annuler
            </Button>
            <Button onClick={handleApprove} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>
              Rejeter la demande d'encadrement de {selectedRequest?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Raison du rejet *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Indiquez la raison du rejet..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="reject-notes">Notes additionnelles (optionnel)</Label>
              <Textarea
                id="reject-notes"
                placeholder="Ajoutez des notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={processing}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
