"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  Loader2, 
  Trash2, 
  CheckCheck,
  MessageSquare,
  UserPlus,
  BookOpen,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

interface Notification {
  id: string
  type: "request" | "message" | "system"
  title: string
  message: string
  read: boolean
  createdAt: Timestamp
  link?: string
}

export default function ProfesseurNotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const notificationsRef = collection(db, "notifications")
      const q = query(
        notificationsRef,
        where("recipientId", "==", user.uid),
        where("recipientRole", "==", "teacher"),
        orderBy("createdAt", "desc")
      )
      
      const snapshot = await getDocs(q)
      const notificationsList: Notification[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        notificationsList.push({
          id: doc.id,
          type: data.type || "system",
          title: data.title || "",
          message: data.message || "",
          read: data.read || false,
          createdAt: data.createdAt,
          link: data.link,
        })
      })
      
      setNotifications(notificationsList)
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error)
      toast.error("Erreur lors du chargement des notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId)
      await updateDoc(notificationRef, { read: true })
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      
      toast.success("Notification marquée comme lue")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      
      await Promise.all(
        unreadNotifications.map(n => {
          const notificationRef = doc(db, "notifications", n.id)
          return updateDoc(notificationRef, { read: true })
        })
      )
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success("Toutes les notifications ont été marquées comme lues")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId)
      await deleteDoc(notificationRef)
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      toast.success("Notification supprimée")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la suppression")
    }
  }

  const deleteAllRead = async () => {
    try {
      const readNotifications = notifications.filter(n => n.read)
      
      await Promise.all(
        readNotifications.map(n => {
          const notificationRef = doc(db, "notifications", n.id)
          return deleteDoc(notificationRef)
        })
      )
      
      setNotifications(prev => prev.filter(n => !n.read))
      toast.success("Notifications lues supprimées")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors de la suppression")
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "request":
        return <BookOpen className="h-5 w-5 text-orange-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "system":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return ""
    
    const date = timestamp.toDate()
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 1) return "À l'instant"
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    if (diffInMinutes < 2880) return "Hier"
    if (diffInMinutes < 43200) return `Il y a ${Math.floor(diffInMinutes / 1440)} jours`
    
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read
    if (filter === "read") return n.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const readCount = notifications.filter(n => n.read).length

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
          <p className="text-muted-foreground">Gérez vos notifications</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
          {readCount > 0 && (
            <Button variant="outline" onClick={deleteAllRead}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer les lues
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Non lues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Toutes les notifications</CardTitle>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="unread">Non lues</TabsTrigger>
                <TabsTrigger value="read">Lues</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filter === "unread" 
                  ? "Aucune notification non lue" 
                  : filter === "read"
                  ? "Aucune notification lue"
                  : "Aucune notification"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    !notification.read 
                      ? "border-l-4 border-l-primary bg-muted/30" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <Badge variant="secondary" className="flex-shrink-0">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      {notification.link && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = notification.link!}
                        >
                          Voir
                        </Button>
                      )}
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCheck className="h-4 w-4 mr-1" />
                          Marquer comme lu
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
