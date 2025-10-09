"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat-interface"
import { Loader2, MessageSquare, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import { 
  getConversationsByUserId,
  getUnreadMessageCount,
  type Conversation 
} from "@/lib/services/messaging-service"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { cn } from "@/lib/utils"

interface Teacher {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  speciality?: string
}

export default function SuperAdminMessagesPage() {
  const { user, userData } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [teachers, setTeachers] = useState<Map<string, Teacher>>(new Map())
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user && userData?.role === "super_admin") {
      loadConversations()
    }
  }, [mounted, user, userData])

  const loadConversations = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Charger toutes les conversations du super admin
      const convs = await getConversationsByUserId(user.uid)
      setConversations(convs)

      // Charger les infos des professeurs
      const teacherMap = new Map<string, Teacher>()
      const unreadMap = new Map<string, number>()

      for (const conv of convs) {
        // Le professeur est toujours le teacherId dans notre structure
        const teacherId = conv.teacherId
        if (teacherId && teacherId !== user.uid) {
          // Charger les infos du professeur
          const teacherDoc = await getDoc(doc(db, "users", teacherId))
          if (teacherDoc.exists()) {
            const data = teacherDoc.data()
            teacherMap.set(teacherId, {
              uid: teacherId,
              displayName: data.displayName || "Professeur",
              email: data.email || "",
              photoURL: data.photoURL || null,
              speciality: data.speciality,
            })
          }

          // Charger le nombre de messages non lus pour le super admin
          // Dans notre structure, le super admin est toujours dans le rôle "teacher"
          const q = query(
            collection(db, "messages"),
            where("conversationId", "==", conv.id),
            where("read", "==", false),
            where("senderRole", "==", "teacher")
          )
          const unreadSnapshot = await getDocs(q)
          unreadMap.set(conv.id, unreadSnapshot.size)
        }
      }

      setTeachers(teacherMap)
      setUnreadCounts(unreadMap)

      // Sélectionner la première conversation par défaut
      if (convs.length > 0) {
        setSelectedConversation(convs[0])
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTeacherForConversation = (conv: Conversation): Teacher | null => {
    // Le professeur est toujours le teacherId dans notre structure
    const teacherId = conv.teacherId !== user?.uid ? conv.teacherId : conv.studentId
    return teacherId ? teachers.get(teacherId) || null : null
  }

  // Éviter les problèmes d'hydration
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des conversations...</span>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Conversations avec les professeurs</p>
        </div>

        <Alert>
          <MessageSquare className="h-4 w-4" />
          <AlertTitle>Aucune conversation</AlertTitle>
          <AlertDescription>
            Vous n'avez pas encore de conversations avec les professeurs. Les professeurs peuvent vous contacter via leur
            espace.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">{conversations.length} conversation(s) avec les professeurs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Professeurs</CardTitle>
            <CardDescription>Sélectionnez une conversation</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {conversations.map((conv) => {
                  const teacher = getTeacherForConversation(conv)
                  const unreadCount = unreadCounts.get(conv.id) || 0
                  const isSelected = selectedConversation?.id === conv.id

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                        isSelected ? "bg-primary/10 border-2 border-primary" : "hover:bg-muted"
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={teacher?.photoURL || ""} />
                        <AvatarFallback>{teacher?.displayName.charAt(0) || "P"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">{teacher?.displayName || "Professeur"}</div>
                          {unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        {teacher?.speciality && (
                          <div className="text-xs text-muted-foreground truncate">{teacher.speciality}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat actif */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedConversation && getTeacherForConversation(selectedConversation)
                ? `Conversation avec ${getTeacherForConversation(selectedConversation)?.displayName}`
                : "Sélectionnez une conversation"}
            </CardTitle>
            {selectedConversation && getTeacherForConversation(selectedConversation)?.email && (
              <CardDescription>{getTeacherForConversation(selectedConversation)?.email}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedConversation && user && userData ? (
              <ChatInterface
                conversation={selectedConversation}
                currentUserId={user.uid}
                currentUserName={userData.displayName || "Admin"}
                currentUserRole="super_admin"
              />
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Aucune conversation sélectionnée</AlertTitle>
                <AlertDescription>Sélectionnez un professeur dans la liste pour commencer à discuter.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
