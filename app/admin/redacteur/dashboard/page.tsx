"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/admin/stat-card"
import { TrendChart } from "@/components/admin/trend-chart"
import { DataTable } from "@/components/admin/data-table"

export default function RedacteurDashboardPage() {
  const [activeTab, setActiveTab] = useState("apercu")

  // Données pour les statistiques
  const statsData = [
    {
      title: "Articles publiés",
      value: "24",
      change: "+4",
      changeType: "increase" as const,
      description: "Total des articles publiés",
    },
    {
      title: "Vues totales",
      value: "12,845",
      change: "+16%",
      changeType: "increase" as const,
      description: "Vues sur tous les articles",
    },
    {
      title: "Taux de complétion",
      value: "68%",
      change: "+5%",
      changeType: "increase" as const,
      description: "Articles lus jusqu'à la fin",
    },
    {
      title: "Temps moyen de lecture",
      value: "4:32",
      change: "-0:15",
      changeType: "decrease" as const,
      description: "Durée moyenne de lecture",
    },
  ]

  // Données pour les graphiques
  const viewsChartData = {
    title: "Vues des articles",
    description: "Évolution des vues sur la période",
    data: [
      { name: "Jan", value: 2400 },
      { name: "Fév", value: 3600 },
      { name: "Mar", value: 4200 },
      { name: "Avr", value: 5400 },
      { name: "Mai", value: 6800 },
    ],
  }

  const engagementChartData = {
    title: "Engagement des lecteurs",
    description: "Taux d'engagement sur la période",
    data: [
      { name: "Jan", value: 45 },
      { name: "Fév", value: 52 },
      { name: "Mar", value: 61 },
      { name: "Avr", value: 67 },
      { name: "Mai", value: 72 },
    ],
  }

  // Données pour les tableaux
  const recentArticlesColumns = [
    { header: "Titre", accessorKey: "title" },
    { header: "Date", accessorKey: "date" },
    { header: "Vues", accessorKey: "views" },
    { header: "Statut", accessorKey: "status" },
  ]

  const recentArticlesData = [
    {
      id: "1",
      title: "Introduction aux équations différentielles",
      date: "12/04/2023",
      views: "1,245",
      status: "Publié",
    },
    {
      id: "2",
      title: "Les séries de Fourier expliquées",
      date: "28/03/2023",
      views: "987",
      status: "Publié",
    },
    {
      id: "3",
      title: "Comprendre les intégrales multiples",
      date: "15/03/2023",
      views: "1,567",
      status: "Publié",
    },
    {
      id: "4",
      title: "Algèbre linéaire avancée",
      date: "02/03/2023",
      views: "2,134",
      status: "Publié",
    },
    {
      id: "5",
      title: "Théorie des groupes pour débutants",
      date: "18/02/2023",
      views: "876",
      status: "Publié",
    },
  ]

  const feedbackColumns = [
    { header: "Article", accessorKey: "article" },
    { header: "Utilisateur", accessorKey: "user" },
    { header: "Commentaire", accessorKey: "comment" },
    { header: "Date", accessorKey: "date" },
  ]

  const feedbackData = [
    {
      id: "1",
      article: "Introduction aux équations différentielles",
      user: "Sophie Martin",
      comment: "Très clair et bien expliqué !",
      date: "14/04/2023",
    },
    {
      id: "2",
      article: "Les séries de Fourier expliquées",
      user: "Thomas Dubois",
      comment: "J'aurais aimé plus d'exemples pratiques.",
      date: "30/03/2023",
    },
    {
      id: "3",
      article: "Comprendre les intégrales multiples",
      user: "Julie Lefebvre",
      comment: "Les illustrations sont très utiles.",
      date: "17/03/2023",
    },
    {
      id: "4",
      article: "Algèbre linéaire avancée",
      user: "Marc Dupont",
      comment: "Excellent contenu, merci !",
      date: "05/03/2023",
    },
    {
      id: "5",
      article: "Théorie des groupes pour débutants",
      user: "Camille Bernard",
      comment: "Un peu difficile à suivre par moments.",
      date: "20/02/2023",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Rédacteur</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de gestion du contenu éditorial de Mathosphère.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="articles">Articles récents</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                description={stat.description}
              />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden">
              <TrendChart
                title={viewsChartData.title}
                description={viewsChartData.description}
                data={{
                  labels: viewsChartData.data.map((item) => item.name),
                  values: viewsChartData.data.map((item) => item.value),
                }}
                tabs={["Jour", "Semaine", "Mois", "Année"]}
              />
            </Card>

            <Card className="overflow-hidden">
              <TrendChart
                title={engagementChartData.title}
                description={engagementChartData.description}
                data={{
                  labels: engagementChartData.data.map((item) => item.name),
                  values: engagementChartData.data.map((item) => item.value),
                }}
                tabs={["Jour", "Semaine", "Mois", "Année"]}
              />
            </Card>
          </div>

          <Card>
            <DataTable
              title="Articles récents"
              description="Vos derniers articles publiés"
              columns={recentArticlesColumns}
              data={recentArticlesData}
            />
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <DataTable
              title="Tous les articles"
              description="Liste complète de vos articles"
              columns={recentArticlesColumns}
              data={recentArticlesData}
              searchKey="title"
            />
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <DataTable
              title="Commentaires des lecteurs"
              description="Feedback reçu sur vos articles"
              columns={feedbackColumns}
              data={feedbackData}
              searchKey="comment"
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
