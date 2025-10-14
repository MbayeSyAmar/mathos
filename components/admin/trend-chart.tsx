"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TrendChartProps {
  title: string
  description: string
  data?: any
  tabs?: string[]
  className?: string
}

export function TrendChart({
  title,
  description,
  data = { labels: [], values: [] },
  tabs = ["Jour", "Semaine", "Mois", "Année"],
  className = "",
}: TrendChartProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].toLowerCase())
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Générer des données différentes selon la période
  const getDataForPeriod = (period: string) => {
    const baseValues = Array.isArray(data) ? data.map((d: any) => d.value || 0) : (data.values || [])
    
    switch (period) {
      case 'jour':
        return {
          labels: ['0h', '4h', '8h', '12h', '16h', '20h', '24h'],
          values: baseValues.length > 0 ? baseValues.slice(0, 7) : [10, 15, 20, 35, 45, 40, 50]
        }
      case 'semaine':
        return {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          values: baseValues.length > 0 ? baseValues.slice(0, 7) : [100, 150, 200, 250, 300, 280, 320]
        }
      case 'mois':
        return {
          labels: ['S1', 'S2', 'S3', 'S4'],
          values: baseValues.length > 0 ? baseValues.slice(0, 4) : [500, 750, 900, 1100]
        }
      case 'année':
        return {
          labels: Array.isArray(data) ? data.map((d: any) => d.name || '') : (data.labels || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']),
          values: baseValues.length > 0 ? baseValues : [1200, 1500, 1800, 2200, 2500, 2800, 3200, 3500, 3800, 4000, 4200, 4500]
        }
      default:
        return {
          labels: Array.isArray(data) ? data.map((d: any) => d.name || '') : (data.labels || []),
          values: baseValues
        }
    }
  }

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajuster la taille du canvas
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()

    // Créer un dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.2)")
    gradient.addColorStop(1, "rgba(34, 197, 94, 0)")

    // Dessiner le graphique
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configuration
    const padding = 20
    const width = canvas.width - padding * 2
    const height = canvas.height - padding * 2

    // Récupérer les données pour la période active
    const periodData = getDataForPeriod(activeTab)
    const dataPoints = periodData.values
    const labels = periodData.labels

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
    const xStep = width / (labels.length - 1 || 1)
    labels.forEach((label: string, i: number) => {
      const x = padding + i * xStep
      ctx.fillText(label, x, canvas.height - padding + 15)
    })

    // Dessiner la ligne de données
    if (dataPoints.length > 0) {
      ctx.beginPath()
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 2
      dataPoints.forEach((point: number, i: number) => {
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
      dataPoints.forEach((point: number, i: number) => {
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
  }

  useEffect(() => {
    drawChart()

    const handleResize = () => {
      drawChart()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeTab, data])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab.toLowerCase()}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="h-[300px] w-full relative">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
            />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
