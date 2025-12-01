import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const MODEL_NAME = "gemini-1.5-flash"

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
      return NextResponse.json({ error: "API Gemini non configurée." }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const chat = model.startChat({
      history: history.map((message: { role: string; content: string }) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      })),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    })

    const result = await chat.sendMessage(prompt)
    const text = result.response?.text()?.trim()

    if (!text) {
      return NextResponse.json({ error: "Réponse vide de l'API Gemini." }, { status: 500 })
    }

    return NextResponse.json({ reply: text })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ error: "Impossible de générer une réponse pour le moment." }, { status: 500 })
  }
}
