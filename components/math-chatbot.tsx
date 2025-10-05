"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Send, X, Bot, Sparkles, ArrowDown, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Types pour les messages
type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function MathChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Bonjour ! Je suis MathBot, votre assistant mathématique. Comment puis-je vous aider aujourd'hui ?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Faire défiler vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Construire le contexte avec l'historique des messages
      const context = messages
        .map((msg) => `${msg.role === "user" ? "Question" : "Réponse"}: ${msg.content}`)
        .join("\n\n")

      // Générer une réponse avec l'AI SDK
      const prompt = `
        Tu es MathBot, un assistant spécialisé en mathématiques pour aider les élèves.
        Voici l'historique de la conversation:
        ${context}
        
        Question de l'élève: ${input}
        
        Réponds de manière claire, pédagogique et précise. Si la question implique des formules mathématiques, 
        explique-les étape par étape. Utilise un ton amical et encourageant.
      `

      // Simuler une réponse (dans un environnement réel, nous utiliserions l'AI SDK)
      let response

      // Simuler un délai pour l'effet de réponse
      await new Promise((resolve) => setTimeout(resolve, 1500))

      response =
        "Je comprends votre question sur les mathématiques. Pour vous aider plus précisément, pourriez-vous me donner plus de détails ou me poser une question plus spécifique ? Je peux vous aider avec des concepts mathématiques, des équations, ou vous parler des grands mathématiciens de l'histoire. N'hésitez pas à être précis dans votre demande."

      // Ajouter la réponse de l'assistant
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error)

      // Message d'erreur
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Désolé, j'ai rencontré une erreur en essayant de répondre à votre question. Pourriez-vous reformuler ou essayer plus tard ?",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Bouton flottant pour ouvrir le chatbot */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg",
            isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90",
          )}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Fenêtre du chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-full sm:w-96 md:w-[450px]"
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  <CardTitle className="text-lg">MathBot</CardTitle>
                </div>
                <div className="flex items-center gap-1 bg-primary-foreground/20 px-2 py-1 rounded-full text-xs">
                  <Sparkles className="h-3 w-3" />
                  <span>Assistant IA</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        message.role === "user" ? "ml-auto flex-row-reverse" : "",
                      )}
                    >
                      <Avatar className={cn("h-8 w-8", message.role === "user" ? "bg-primary" : "bg-gray-200")}>
                        <AvatarFallback>{message.role === "user" ? "U" : "M"}</AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "rounded-lg p-3",
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 bg-gray-200">
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <p className="text-sm">MathBot réfléchit...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    placeholder="Posez votre question mathématique..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>

            {messages.length > 3 && (
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-[calc(100%+8px)] right-0 bg-background shadow-md"
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Derniers messages
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
