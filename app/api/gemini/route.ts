import { NextResponse } from "next/server"

// Modèle compatible avec l'API REST v1
// Modèles disponibles : gemini-2.5-flash, gemini-2.5-pro, gemini-3-pro
const MODEL_NAME = "gemini-2.5-flash"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const prompt = body?.prompt?.trim()
    const history = Array.isArray(body?.history) ? body.history : []

    if (!prompt) {
      return NextResponse.json({ error: "Veuillez fournir un message." }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("GEMINI_API_KEY n'est pas définie dans les variables d'environnement")
      return NextResponse.json(
        { 
          error: "API Gemini non configurée. Veuillez ajouter GEMINI_API_KEY dans votre fichier .env.local" 
        }, 
        { status: 500 }
      )
    }

    // Préparer l'historique de conversation
    // Filtrer et formater l'historique pour s'assurer qu'il commence par un message "user"
    let formattedHistory = history
      .slice(-10) // Limiter à 10 derniers messages
      .map((message: { role: string; content: string }) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      }))
      .filter((msg) => msg.parts[0]?.text?.trim()) // Filtrer les messages vides

    // S'assurer que l'historique commence par un message "user"
    while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory = formattedHistory.slice(1)
    }

    // Construire les messages pour l'API REST
    const contents: any[] = []

    // Ajouter un message système au début si c'est la première interaction
    const isFirstInteraction = formattedHistory.length === 0
    if (isFirstInteraction) {
      contents.push({
        role: "user",
        parts: [{ 
          text: `Tu es MathBot, un assistant mathématique expert et précis. 

Règles importantes :
- Réponds toujours avec la réponse mathématique CORRECTE et PRÉCISE
- Pour les calculs simples (ex: 1+1), donne directement le résultat (ex: 2)
- Explique les étapes pour les calculs complexes
- Sois concis mais précis
- Vérifie toujours tes calculs avant de répondre

Exemples :
- Question: "1+1" → Réponse: "2"
- Question: "2×3" → Réponse: "6"
- Question: "Résoudre x²-4=0" → Réponse: "x = 2 ou x = -2" avec explication

Maintenant, réponds à cette question mathématique : ${prompt}` 
        }],
      })
    } else {
      // Ajouter l'historique
      formattedHistory.forEach((msg) => {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.parts[0].text }],
        })
      })

      // Ajouter le message actuel de l'utilisateur avec contexte mathématique
      contents.push({
        role: "user",
        parts: [{ 
          text: `Rappel : Tu es MathBot, un assistant mathématique. Réponds avec précision et exactitude.

${prompt}` 
        }],
      })
    }

    // Appel à l'API REST Gemini v1
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${apiKey}`
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.2, // Température très basse pour plus de précision mathématique
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Gemini API error:", response.status, errorData)
      throw new Error(`API Gemini error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!text) {
      console.error("Réponse vide de Gemini:", data)
      return NextResponse.json(
        { error: "Réponse vide de l'API Gemini." }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ reply: text })
  } catch (error: any) {
    console.error("Gemini API error:", error)
    
    // Messages d'erreur plus détaillés
    let errorMessage = "Impossible de générer une réponse pour le moment."
    
    if (error?.message?.includes("API_KEY") || error?.message?.includes("401")) {
      errorMessage = "Clé API invalide. Vérifiez votre GEMINI_API_KEY."
    } else if (error?.message?.includes("404") || error?.message?.includes("MODEL_NOT_FOUND")) {
      errorMessage = `Modèle ${MODEL_NAME} non trouvé. Vérifiez le nom du modèle.`
    } else if (error?.message?.includes("429")) {
      errorMessage = "Quota dépassé. Veuillez réessayer plus tard."
    } else if (error?.message) {
      errorMessage = `Erreur: ${error.message}`
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      }, 
      { status: 500 }
    )
  }
}
