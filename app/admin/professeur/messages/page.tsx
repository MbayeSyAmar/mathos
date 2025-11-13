"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/chat-interface"
import { Loader2, MessageSquare, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import {
  getConversationByParticipants,
  createConversation,
  getConversation,
  type Conversation,
} from "@/lib/services/messaging-service"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

export default function ProfesseurMessagesPage() {
  const { user, userData } = useAuth()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [superAdmin, setSuperAdmin] = useState<{ uid: string; displayName: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user && userData) {
      initializeConversation()
    }
  }, [mounted, user, userData])

  const initializeConversation = async () => {
    if (!user || !userData) return

    try {
      setLoading(true)

      // Trouver le super admin
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", "super_admin"))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        toast.error("Aucun administrateur trouvé")
        setLoading(false)
        return
      }

      const adminDoc = querySnapshot.docs[0]
      const adminData = adminDoc.data()
      const adminInfo = {
        uid: adminDoc.id,
        displayName: adminData.displayName || adminData.name || "Super Admin",
      }
      setSuperAdmin(adminInfo)

      const teacherDisplayName = userData.displayName || user.email?.split("@")[0] || "Professeur"

      let conv = await getConversationByParticipants(adminInfo.uid, user.uid)

      if (!conv) {
        // Créer une nouvelle conversation
        const conversationId = await createConversation(
          adminInfo.uid,
          adminInfo.displayName,
          user.uid,
          teacherDisplayName
        )
        conv = await getConversation(conversationId)
      }

      if (conv) {
        setConversation(conv)
      } else {
        toast.error("Impossible de créer la conversation")
      }
    } catch (error) {
      console.error("Error initializing conversation:", error)
      toast.error("Erreur lors de l'initialisation du chat")
    } finally {
      setLoading(false)
    }
  }

  // Éviter les problèmes d'hydration
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communiquez avec l'administration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation avec l'administration
          </CardTitle>
          <CardDescription>
            Posez vos questions ou partagez vos préoccupations avec le super administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement du chat...</span>
            </div>
          ) : conversation && user && userData && superAdmin ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {superAdmin.displayName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{superAdmin.displayName}</div>
                  <div className="text-sm text-muted-foreground">Administrateur principal</div>
                </div>
              </div>
              
              <ChatInterface
                conversation={conversation}
                currentUserId={user.uid}
                currentUserName={userData.displayName || user.email?.split("@")[0] || "Professeur"}
                currentUserRole="teacher"
              />
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Impossible de charger le chat. Veuillez réessayer plus tard.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conseils pour la communication</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Soyez clair et précis dans vos messages</li>
            <li>• Incluez tous les détails pertinents (dates, noms d'élèves, etc.)</li>
            <li>• Les messages urgents reçoivent une réponse prioritaire</li>
            <li>• Respectez la confidentialité des informations des élèves</li>
            <li>• Le temps de réponse habituel est de 24h en jours ouvrés</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
