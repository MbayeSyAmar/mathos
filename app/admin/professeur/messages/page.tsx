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
  getConversationsByUserId,
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
    if (!user || !userData) {
      console.error("❌ Utilisateur ou données utilisateur manquantes")
      console.error("User:", user)
      console.error("UserData:", userData)
      return
    }

    try {
      setLoading(true)
      console.log("🔍 Début de l'initialisation de la conversation...")
      console.log("User UID:", user.uid)
      console.log("User Email:", user.email)

      // Trouver le super admin
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", "super_admin"))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.error("❌ Aucun administrateur trouvé dans la base de données")
        toast.error("Aucun administrateur trouvé")
        setLoading(false)
        return
      }

      console.log("✅ Super admin trouvé:", querySnapshot.docs.length, "admin(s)")

      const adminDoc = querySnapshot.docs[0]
      const adminData = adminDoc.data()
      const adminInfo = {
        uid: adminDoc.id,
        displayName: adminData.displayName || adminData.name || "Super Admin",
      }
      setSuperAdmin(adminInfo)

      const teacherDisplayName = userData.displayName || user.email?.split("@")[0] || "Professeur"

      // Chercher une conversation existante de plusieurs façons
      // Méthode 1: Chercher directement avec getConversationByParticipants
      let conv = await getConversationByParticipants(adminInfo.uid, user.uid)
      
      // Méthode 2: Si pas trouvée, chercher dans toutes les conversations du professeur
      if (!conv) {
        console.log("Recherche dans toutes les conversations du professeur...")
        const allConversations = await getConversationsByUserId(user.uid)
        conv = allConversations.find(
          (c) => 
            (c.studentId === adminInfo.uid && c.teacherId === user.uid) ||
            (c.studentId === user.uid && c.teacherId === adminInfo.uid)
        ) || null
      }

      // Méthode 3: Si toujours pas trouvée, chercher dans l'autre sens
      if (!conv) {
        console.log("Recherche dans l'autre sens...")
        conv = await getConversationByParticipants(user.uid, adminInfo.uid)
      }

      if (!conv) {
        console.log("Aucune conversation trouvée, création d'une nouvelle conversation...")
        try {
          // Créer une nouvelle conversation
          // createConversation(studentId, studentName, teacherId, teacherName)
          const conversationId = await createConversation(
            adminInfo.uid,        // studentId (super admin)
            adminInfo.displayName, // studentName
            user.uid,             // teacherId (professeur)
            teacherDisplayName    // teacherName
          )
          
          if (!conversationId) {
            console.error("Échec de la création de la conversation - conversationId est null")
            toast.error("Impossible de créer la conversation")
            setLoading(false)
            return
          }

          console.log("Conversation créée avec l'ID:", conversationId)
          
          // Attendre un peu pour que Firestore s'indexe
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Essayer de récupérer la conversation par ID
          conv = await getConversation(conversationId)
          
          // Si toujours pas trouvée, réessayer avec getConversationByParticipants
          if (!conv) {
            console.log("Réessai de récupération de la conversation...")
            await new Promise(resolve => setTimeout(resolve, 500))
            conv = await getConversationByParticipants(adminInfo.uid, user.uid)
          }
          
          // Dernière tentative : chercher dans toutes les conversations
          if (!conv) {
            console.log("Dernière tentative : recherche dans toutes les conversations...")
            const allConversations = await getConversationsByUserId(user.uid)
            conv = allConversations.find(
              (c) => 
                (c.studentId === adminInfo.uid && c.teacherId === user.uid) ||
                (c.studentId === user.uid && c.teacherId === adminInfo.uid)
            ) || null
          }
        } catch (createError) {
          console.error("Erreur lors de la création de la conversation:", createError)
          toast.error("Erreur lors de la création de la conversation. Veuillez réessayer.")
          setLoading(false)
          return
        }
      }

      if (conv) {
        console.log("✅ Conversation trouvée/créée avec succès:", conv.id)
        console.log("Détails de la conversation:", {
          id: conv.id,
          studentId: conv.studentId,
          teacherId: conv.teacherId,
          studentName: conv.studentName,
          teacherName: conv.teacherName
        })
        setConversation(conv)
      } else {
        console.error("❌ Impossible de récupérer la conversation après toutes les tentatives")
        console.error("Admin UID:", adminInfo.uid)
        console.error("Teacher UID:", user.uid)
        toast.error("Impossible de charger la conversation. Veuillez réessayer ou contacter le support.")
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la conversation:", error)
      toast.error("Erreur lors de l'initialisation du chat. Veuillez réessayer plus tard.")
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
          ) : conversation && user && userData ? (
            <div className="space-y-4">
              {superAdmin && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {superAdmin.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{superAdmin.displayName}</div>
                    <div className="text-sm text-muted-foreground">Administrateur principal</div>
                  </div>
                </div>
              )}
              
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
              <AlertDescription className="space-y-3">
                <div>
                  <p className="mb-2">Impossible de charger le chat. Veuillez réessayer plus tard.</p>
                  <p className="text-xs text-muted-foreground">
                    Si le problème persiste, ouvrez la console du navigateur (F12) pour voir les détails de l'erreur.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("🔄 Tentative de rechargement manuel...")
                    setLoading(true)
                    initializeConversation()
                  }}
                  className="w-full sm:w-auto"
                >
                  Réessayer
                </Button>
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
