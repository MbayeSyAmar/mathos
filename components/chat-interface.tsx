"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, MessageSquare, User } from "lucide-react"
import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
  type Message,
  type Conversation,
} from "@/lib/services/messaging-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

interface ChatInterfaceProps {
  conversation: Conversation
  currentUserId: string
  currentUserName: string
  currentUserRole: "student" | "teacher" | "super_admin"
}

export function ChatInterface({
  conversation,
  currentUserId,
  currentUserName,
  currentUserRole,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    
    // S'abonner aux nouveaux messages en temps réel
    const unsubscribe = subscribeToMessages(conversation.id, (updatedMessages) => {
      setMessages(updatedMessages)
      scrollToBottom()
    })

    // Marquer les messages comme lus
    markMessagesAsRead(conversation.id, currentUserId, currentUserRole)

    return () => unsubscribe()
  }, [conversation.id, currentUserId, currentUserRole])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const msgs = await getMessages(conversation.id, 100)
      setMessages(msgs)
      scrollToBottom()
    } catch (error) {
      console.error("Error loading messages:", error)
      toast.error("Erreur lors du chargement des messages")
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    try {
      setSending(true)
      await sendMessage(
        conversation.id,
        currentUserId,
        currentUserName,
        currentUserRole,
        newMessage.trim()
      )
      setNewMessage("")
      scrollToBottom()
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Erreur lors de l'envoi du message")
    } finally {
      setSending(false)
    }
  }

  const formatMessageDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return format(date, "HH:mm", { locale: fr })
    } else if (diffInHours < 48) {
      return `Hier ${format(date, "HH:mm", { locale: fr })}`
    } else {
      return format(date, "dd MMM HH:mm", { locale: fr })
    }
  }

  const otherParticipant = currentUserRole === "student" ? conversation.teacherName : conversation.studentName

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {otherParticipant.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{otherParticipant}</CardTitle>
            <CardDescription>
              {currentUserRole === "student" ? "Votre professeur" : "Votre élève"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun message pour le moment</p>
                <p className="text-sm">Commencez la conversation !</p>
              </div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={isCurrentUser ? "bg-primary text-primary-foreground" : ""}>
                        {message.senderName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col gap-1 max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground px-2">
                        {formatMessageDate(message.createdAt)}
                        {message.read && isCurrentUser && " • Lu"}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
