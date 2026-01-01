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

// Fonction pour nettoyer le LaTeX et le convertir en texte lisible
function cleanLatex(text: string): string {
  let cleaned = text

  // Supprimer les délimiteurs LaTeX inline ($...$)
  cleaned = cleaned.replace(/\$([^$]+)\$/g, "$1")

  // Supprimer les délimiteurs LaTeX display ($$...$$)
  cleaned = cleaned.replace(/\$\$([^$]+)\$\$/g, "$1")

  // Convertir \frac{a}{b} en a/b
  cleaned = cleaned.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")

  // Convertir \sqrt{x} en √x
  cleaned = cleaned.replace(/\\sqrt\{([^}]+)\}/g, "√$1")
  cleaned = cleaned.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, "√[$1]($2)")

  // Convertir \times en ×
  cleaned = cleaned.replace(/\\times/g, "×")

  // Convertir \cdot en ·
  cleaned = cleaned.replace(/\\cdot/g, "·")

  // Convertir \div en ÷
  cleaned = cleaned.replace(/\\div/g, "÷")

  // Convertir \pm en ±
  cleaned = cleaned.replace(/\\pm/g, "±")

  // Convertir \leq en ≤
  cleaned = cleaned.replace(/\\leq/g, "≤")

  // Convertir \geq en ≥
  cleaned = cleaned.replace(/\\geq/g, "≥")

  // Convertir \neq en ≠
  cleaned = cleaned.replace(/\\neq/g, "≠")

  // Convertir \approx en ≈
  cleaned = cleaned.replace(/\\approx/g, "≈")

  // Convertir \sum en Σ
  cleaned = cleaned.replace(/\\sum/g, "Σ")

  // Convertir \prod en Π
  cleaned = cleaned.replace(/\\prod/g, "Π")

  // Convertir \int en ∫
  cleaned = cleaned.replace(/\\int/g, "∫")

  // Convertir \infty en ∞
  cleaned = cleaned.replace(/\\infty/g, "∞")

  // Convertir \pi en π
  cleaned = cleaned.replace(/\\pi/g, "π")

  // Convertir \alpha en α
  cleaned = cleaned.replace(/\\alpha/g, "α")

  // Convertir \beta en β
  cleaned = cleaned.replace(/\\beta/g, "β")

  // Convertir \theta en θ
  cleaned = cleaned.replace(/\\theta/g, "θ")

  // Convertir \lambda en λ
  cleaned = cleaned.replace(/\\lambda/g, "λ")

  // Convertir les puissances ^{x} en ^x
  cleaned = cleaned.replace(/\^\{([^}]+)\}/g, "^$1")

  // Convertir les indices _{x} en _x
  cleaned = cleaned.replace(/_\{([^}]+)\}/g, "_$1")

  // Nettoyer les accolades restantes simples
  cleaned = cleaned.replace(/\{([^}]+)\}/g, "$1")

  // Nettoyer les espaces multiples
  cleaned = cleaned.replace(/\s+/g, " ")

  return cleaned.trim()
}

// Types pour les messages
type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Fonction pour convertir le LaTeX en texte lisible
function convertLatexToReadable(text: string): string {
  let result = text

  // Nettoyer le formatage Markdown (astérisques pour gras/italique/listes)
  // D'abord, supprimer les astérisques dans les listes numérotées (ex: "1. **texte**" → "1. texte")
  result = result.replace(/^(\s*\d+\.\s+)\*\*([^*]+)\*\*/gm, "$1$2") // "1. **texte**" → "1. texte"
  result = result.replace(/^(\s*\d+\.\s+)\*([^*]+)\*/gm, "$1$2") // "1. *texte*" → "1. texte"
  
  // Ensuite, supprimer les astérisques pour le gras/italique dans le texte
  result = result.replace(/\*\*\*([^*]+)\*\*\*/g, "$1") // ***texte*** → texte
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1") // **texte** → texte (gras)
  result = result.replace(/\*([^*]+)\*/g, "$1") // *texte* → texte (italique)
  
  // Convertir les listes à puces avec astérisques
  result = result.replace(/^\s*\*\s+/gm, "• ") // Liste avec * → • (puce)

  // Supprimer les délimiteurs LaTeX inline et de bloc
  result = result.replace(/\$\$([^$]+)\$\$/g, "$1") // $$...$$
  result = result.replace(/\$([^$]+)\$/g, "$1") // $...$

  // Fonction helper pour convertir les chiffres en exposants/indices
  const toSuperscript = (num: string) => {
    const superscripts: { [key: string]: string } = {
      "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
      "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
      "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾"
    }
    return num.split("").map(c => superscripts[c] || c).join("")
  }

  const toSubscript = (num: string) => {
    const subscripts: { [key: string]: string } = {
      "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
      "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
      "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎"
    }
    return num.split("").map(c => subscripts[c] || c).join("")
  }

  // Remplacer les commandes LaTeX courantes (ordre important)
  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)") // \frac{a}{b} → (a)/(b)
  result = result.replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, "racine $1-ième de ($2)") // \sqrt[n]{x}
  result = result.replace(/\\sqrt\{([^}]+)\}/g, "√($1)") // \sqrt{x} → √(x)
  
  // Exposants avec accolades
  result = result.replace(/\^\{([^}]+)\}/g, (match, content) => {
    if (/^\d+$/.test(content)) {
      return toSuperscript(content)
    }
    return "^(" + content + ")"
  })
  
  // Exposants simples
  result = result.replace(/\^(\d+)/g, (match, num) => toSuperscript(num))
  
  // Indices avec accolades
  result = result.replace(/_\{([^}]+)\}/g, (match, content) => {
    if (/^\d+$/.test(content)) {
      return toSubscript(content)
    }
    return "_(" + content + ")"
  })
  
  // Indices simples
  result = result.replace(/_(\d+)/g, (match, num) => toSubscript(num))

  // Symboles mathématiques courants
  result = result.replace(/\\times/g, "×")
  result = result.replace(/\\cdot/g, "·")
  result = result.replace(/\\div/g, "÷")
  result = result.replace(/\\pm/g, "±")
  result = result.replace(/\\mp/g, "∓")
  result = result.replace(/\\leq/g, "≤")
  result = result.replace(/\\geq/g, "≥")
  result = result.replace(/\\neq/g, "≠")
  result = result.replace(/\\approx/g, "≈")
  result = result.replace(/\\equiv/g, "≡")
  result = result.replace(/\\sim/g, "∼")
  result = result.replace(/\\propto/g, "∝")
  result = result.replace(/\\infty/g, "∞")
  result = result.replace(/\\sum/g, "∑")
  result = result.replace(/\\prod/g, "∏")
  result = result.replace(/\\int/g, "∫")
  result = result.replace(/\\partial/g, "∂")
  result = result.replace(/\\nabla/g, "∇")
  result = result.replace(/\\in/g, "∈")
  result = result.replace(/\\notin/g, "∉")
  result = result.replace(/\\subset/g, "⊂")
  result = result.replace(/\\subseteq/g, "⊆")
  result = result.replace(/\\cup/g, "∪")
  result = result.replace(/\\cap/g, "∩")
  result = result.replace(/\\emptyset/g, "∅")
  result = result.replace(/\\forall/g, "∀")
  result = result.replace(/\\exists/g, "∃")
  
  // Lettres grecques
  result = result.replace(/\\alpha/g, "α")
  result = result.replace(/\\beta/g, "β")
  result = result.replace(/\\gamma/g, "γ")
  result = result.replace(/\\delta/g, "δ")
  result = result.replace(/\\epsilon/g, "ε")
  result = result.replace(/\\varepsilon/g, "ε")
  result = result.replace(/\\pi/g, "π")
  result = result.replace(/\\theta/g, "θ")
  result = result.replace(/\\lambda/g, "λ")
  result = result.replace(/\\mu/g, "μ")
  result = result.replace(/\\sigma/g, "σ")
  result = result.replace(/\\phi/g, "φ")
  result = result.replace(/\\varphi/g, "φ")
  result = result.replace(/\\omega/g, "ω")
  result = result.replace(/\\Omega/g, "Ω")
  result = result.replace(/\\Delta/g, "Δ")
  result = result.replace(/\\Gamma/g, "Γ")
  result = result.replace(/\\Lambda/g, "Λ")
  result = result.replace(/\\Sigma/g, "Σ")
  result = result.replace(/\\Phi/g, "Φ")
  result = result.replace(/\\Theta/g, "Θ")

  // Nettoyer les accolades restantes (mais pas celles dans les parenthèses)
  result = result.replace(/\{([^}]+)\}/g, "$1") // {x} → x

  // Nettoyer les backslashes restants
  result = result.replace(/\\([a-zA-Z]+)/g, "$1") // \command → command

  // Nettoyer les espaces multiples
  result = result.replace(/\s+/g, " ")

  return result.trim()
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
      // Exclure le message de bienvenue et ne garder que les vrais échanges
      const conversationHistory = [...messages, userMessage]
        .filter((msg) => msg.id !== "welcome") // Exclure le message de bienvenue
        .slice(-6) // Garder les 6 derniers messages
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          history: conversationHistory,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data?.error || "Erreur lors de la communication avec l'API"
        throw new Error(errorMsg)
      }

      let reply =
        typeof data.reply === "string" && data.reply.trim().length > 0
          ? data.reply.trim()
          : "Désolé, je n'ai pas pu formuler de réponse précise cette fois-ci."

      // Nettoyer le LaTeX restant si présent
      reply = cleanLatex(reply)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Erreur lors de la génération de la réponse:", error)

      // Message d'erreur avec détails
      const errorDetails = error?.message || "Erreur inconnue"
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Désolé, j'ai rencontré une erreur : ${errorDetails}. ${
          errorDetails.includes("API Gemini non configurée") 
            ? "Veuillez configurer GEMINI_API_KEY dans le fichier .env.local" 
            : "Pourriez-vous reformuler ou essayer plus tard ?"
        }`,
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
                        <p className="text-sm whitespace-pre-wrap">{convertLatexToReadable(message.content)}</p>
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
