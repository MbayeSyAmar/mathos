"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Mail, 
  ShoppingCart, 
  UserPlus, 
  MessageSquare,
  BookOpen,
  Loader2,
  Filter
} from "lucide-react"
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "order" | "user" | "message" | "request" | "course"
  title: string
  message: string
  read: boolean
  createdAt: any
  link?: string
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const notificationsRef = collection(db, "notifications")
      const notificationsQuery = query(
        notificationsRef, 
        where("recipientRole", "==", "super_admin"),
        orderBy("createdAt", "desc")
      )
      const notificationsSnapshot = await getDocs(notificationsQuery)
      
      const notificationsList = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification))

      setNotifications(notificationsList)
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error)
      
      // Créer des notifications de démonstration si la collection n'existe pas
      const demoNotifications: Notification[] = [
        {
          id: "1",
          type: "order",
          title: "Nouvelle commande",
          message: "Une nouvelle commande #CMD-2024-001 a été passée",
          read: false,
          createdAt: new Date(),
          link: "/admin/super/boutique"
        },
        {
          id: "2",
          type: "user",
          title: "Nouvel utilisateur",
          message: "Un nouvel utilisateur s'est inscrit sur la plateforme",
          read: false,
          createdAt: new Date(Date.now() - 3600000),
          link: "/admin/super/utilisateurs"
        },
        {
          id: "3",
          type: "message",
          title: "Nouveau message",
          message: "Un professeur vous a envoyé un message",
          read: true,
          createdAt: new Date(Date.now() - 7200000),
          link: "/admin/super/messages"
        },
        {
          id: "4",
          type: "request",
          title: "Demande d'encadrement",
          message: "Une nouvelle demande d'encadrement est en attente",
          read: false,
          createdAt: new Date(Date.now() - 10800000),
          link: "/admin/super/demandes"
        },
      ]
      setNotifications(demoNotifications)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )

      const notificationRef = doc(db, "notifications", notificationId)
      await updateDoc(notificationRef, { read: true })
      
      toast.success("Notification marquée comme lue")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      
      // Mettre à jour dans Firestore
      const unreadNotifications = notifications.filter(n => !n.read)
      const promises = unreadNotifications.map(n => 
        updateDoc(doc(db, "notifications", n.id), { read: true })
      )
      await Promise.all(promises)
      
      toast.success("Toutes les notifications ont été marquées comme lues")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      const notificationRef = doc(db, "notifications", notificationId)
      await deleteDoc(notificationRef)
      
      toast.success("Notification supprimée")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la suppression")
    }
  }

  const deleteAllRead = async () => {
    try {
      const readNotifications = notifications.filter(n => n.read)
      
      setNotifications(prev => prev.filter(n => !n.read))
      
      const promises = readNotifications.map(n => 
        deleteDoc(doc(db, "notifications", n.id))
      )
      await Promise.all(promises)
      
      toast.success(`${readNotifications.length} notifications supprimées`)
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la suppression")
    }
  }

  const getIcon = (type: string) => {
    const icons = {
      order: <ShoppingCart className="h-5 w-5 text-blue-500" />,
      user: <UserPlus className="h-5 w-5 text-green-500" />,
      message: <MessageSquare className="h-5 w-5 text-purple-500" />,
      request: <BookOpen className="h-5 w-5 text-orange-500" />,
      course: <BookOpen className="h-5 w-5 text-indigo-500" />,
    }
    return icons[type as keyof typeof icons] || <Bell className="h-5 w-5" />
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Date inconnue"
    
    let date: Date
    if (timestamp?.toDate) {
      date = timestamp.toDate()
    } else if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000)
    } else if (timestamp instanceof Date) {
      date = timestamp
    } else {
      return "Date inconnue"
    }

    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return "À l'instant"
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInDays === 1) return "Hier"
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(date)
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read
    if (filter === "read") return n.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des notifications...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : "Aucune nouvelle notification"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
          <Button 
            variant="outline" 
            onClick={deleteAllRead}
            disabled={notifications.filter(n => n.read).length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer les lues
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non lues</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lues</CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
            <p className="text-xs text-muted-foreground">Traitées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Toutes ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">
            Lues ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Aucune notification</p>
                <p className="text-sm text-muted-foreground">
                  {filter === "unread" 
                    ? "Toutes vos notifications ont été lues" 
                    : "Vous n'avez pas encore de notifications"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`${!notification.read ? 'border-l-4 border-l-primary bg-muted/30' : ''}`}
                >
                  <CardContent className="flex items-start justify-between p-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{notification.title}</p>
                          {!notification.read && (
                            <Badge variant="default" className="h-5 px-2 text-xs">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
