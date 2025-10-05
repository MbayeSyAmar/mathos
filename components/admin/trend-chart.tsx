"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TrendChart({
  title,
  description,
  data = { labels: [], values: [] },
  tabs = ["Jour", "Semaine", "Mois", "Année"],
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    const canvas = canvasRef.current

    // Ajuster la taille du canvas pour qu'il s'adapte à son conteneur
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()

    // Créer un dégradé pour le remplissage sous la courbe
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.2)")
    gradient.addColorStop(1, "rgba(34, 197, 94, 0)")

    // Dessiner le graphique
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configuration
    const padding = 20
    const width = canvas.width - padding * 2
    const height = canvas.height - padding * 2

    // Adapter les données au format attendu
    let dataPoints = []
    let labels = []

    // Vérifier le format des données et les adapter si nécessaire
    if (Array.isArray(data)) {
      // Si data est un tableau d'objets avec name et value
      dataPoints = data.map((item) => item.value || 0)
      labels = data.map((item) => item.name || "")
    } else if (data && Array.isArray(data.values)) {
      // Si data est un objet avec values et labels
      dataPoints = data.values
      labels =
        data.labels ||
        Array(dataPoints.length)
          .fill("")
          .map((_, i) => `Point ${i + 1}`)
    } else {
      // Données par défaut si aucun format valide n'est fourni
      dataPoints = [10, 25, 30, 45, 60]
      labels = ["Jan", "Fév", "Mar", "Avr", "Mai"]
    }

    const maxValue = Math.max(...dataPoints) * 1.1 || 100

    // Dessiner l'axe X
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Dessiner les étiquettes de l'axe X
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    const xStep = width / (labels.length - 1 || 1) // Éviter la division par zéro
    labels.forEach((label, i) => {
      const x = padding + i * xStep
      ctx.fillText(label, x, canvas.height - padding + 15)
    })

    // Dessiner la ligne de données seulement s'il y a des points
    if (dataPoints.length > 0) {
      ctx.beginPath()
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 2
      dataPoints.forEach((point, i) => {
        const x = padding + i * xStep
        const y = canvas.height - padding - (point / maxValue) * height
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Remplir la zone sous la ligne
      ctx.lineTo(padding + (dataPoints.length - 1) * xStep, canvas.height - padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.fillStyle = gradient
      ctx.fill()

      // Dessiner les points de données
      dataPoints.forEach((point, i) => {
        const x = padding + i * xStep
        const y = canvas.height - padding - (point / maxValue) * height
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.strokeStyle = "#22c55e"
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()
      })
    }

    // Ajouter un écouteur de redimensionnement pour rendre le graphique responsive
    const handleResize = () => {
      resizeCanvas()
      // Redessiner le graphique après le redimensionnement
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Répéter le code de dessin ici...
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [data])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tabs[0].toLowerCase()}>
          <TabsList className="mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab.toLowerCase()}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab} value={tab.toLowerCase()} className="space-y-4">
              <div className="h-[300px] w-full relative">
                <canvas
                  ref={canvasRef}
                  style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
