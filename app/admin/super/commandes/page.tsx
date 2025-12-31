"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Eye, Phone, Mail, MapPin, Package, Calendar, User, DollarSign } from "lucide-react"
import { collection, getDocs, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image?: string
  category?: string
}

interface Order {
  id: string
  orderNumber: string
  userId: string
  userInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  items: OrderItem[]
  total: number
  subtotal: number
  status: string
  paymentMethod: string
  deliveryNote?: string
  createdAt: any
  updatedAt?: any
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  processing: { label: "En préparation", variant: "default" },
  shipped: { label: "Expédiée", variant: "default" },
  delivered: { label: "Livrée", variant: "default" },
  cancelled: { label: "Annulée", variant: "destructive" },
}

export default function SuperAdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const ordersRef = collection(db, "orders")
      const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(ordersQuery)
      
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[]
      
      setOrders(ordersData)
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
      toast.error("Erreur lors du chargement des commandes")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsDialog(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      setUpdating(true)
      const orderRef = doc(db, "orders", selectedOrder.id)
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(adminNotes && { adminNotes }),
      })

      toast.success("Statut de la commande mis à jour")
      setShowStatusDialog(false)
      setNewStatus("")
      setAdminNotes("")
      fetchOrders()
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast.error("Erreur lors de la mise à jour du statut")
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (amount: number) => {
    return `${amount.toLocaleString("fr-FR")} FCFA`
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Date inconnue"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "dd MMMM yyyy à HH:mm", { locale: fr })
  }

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des commandes</h1>
        <p className="text-muted-foreground mt-2">
          Consultez et gérez toutes les commandes des clients
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes</CardTitle>
          <CardDescription>
            {orders.length} commande{orders.length > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.userInfo?.firstName} {order.userInfo?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.userInfo?.city}, {order.userInfo?.country}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {order.userInfo?.email}
                          </p>
                          <p className="text-xs flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.userInfo?.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items?.length || 0} article{order.items?.length !== 1 ? "s" : ""}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusLabels[order.status]?.variant || "default"}>
                          {statusLabels[order.status]?.label || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour voir les détails complets */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la commande {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Toutes les informations fournies par le client
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Informations client */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations client
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Prénom</Label>
                      <p className="font-medium">{selectedOrder.userInfo.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Nom</Label>
                      <p className="font-medium">{selectedOrder.userInfo.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Label>
                      <p className="font-medium">{selectedOrder.userInfo.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Téléphone
                      </Label>
                      <p className="font-medium">{selectedOrder.userInfo.phone}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Adresse complète
                    </Label>
                    <p className="font-medium">
                      {selectedOrder.userInfo.address}
                      <br />
                      {selectedOrder.userInfo.postalCode} {selectedOrder.userInfo.city}
                      <br />
                      {selectedOrder.userInfo.country}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Articles commandés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Articles commandés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantité : {item.quantity} × {formatPrice(item.price)}
                            </p>
                            {item.category && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {item.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-muted-foreground">À discuter</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations de commande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Informations de commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Statut actuel</Label>
                      <div className="mt-1">
                        <Badge variant={statusLabels[selectedOrder.status]?.variant || "default"}>
                          {statusLabels[selectedOrder.status]?.label || selectedOrder.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Mode de paiement
                      </Label>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Date de commande</Label>
                      <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    {selectedOrder.updatedAt && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Dernière mise à jour</Label>
                        <p className="font-medium">{formatDate(selectedOrder.updatedAt)}</p>
                      </div>
                    )}
                  </div>
                  {selectedOrder.deliveryNote && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Note de livraison</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                        {selectedOrder.deliveryNote}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOrder(null)
                setShowDetailsDialog(false)
              }}
            >
              Fermer
            </Button>
            <Button
              onClick={() => {
                setShowDetailsDialog(false)
                setShowStatusDialog(true)
              }}
            >
              Modifier le statut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier le statut */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le statut de la commande</DialogTitle>
            <DialogDescription>
              Mettez à jour le statut de la commande {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Nouveau statut</Label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Sélectionner un statut</option>
                {Object.entries(statusLabels).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes administratives (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes pour cette commande..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowStatusDialog(false)
                setNewStatus("")
                setAdminNotes("")
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateStatus} disabled={!newStatus || updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

