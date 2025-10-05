"use client"

import { Button } from "@/components/ui/button"

import { BookOpen, FileText, Users, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/admin/stat-card"
import { TrendChart } from "@/components/admin/trend-chart"
import { DataTable } from "@/components/admin/data-table"

// Données de démonstration pour les graphiques
const viewsData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
  values: [1200, 1500, 1800, 2200, 2500, 2800, 3200],
}

const completionsData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
  values: [800, 950, 1100, 1300, 1450, 1600, 1800],
}

// Données de démonstration pour les tableaux
const recentContent = [
  {
    id: "COURS-001",
    title: "Introduction à l'algèbre linéaire",
    type: "Cours",
    views: 1250,
    completions: 850,
    rating: "4.8/5",
    status: "Publié",
  },
  {
    id: "EXER-002",
    title: "Exercices sur les dérivées",
    type: "Exercice",
    views: 980,
    completions: 720,
    rating: "4.6/5",
    status: "Publié",
  },
  {
    id: "QUIZ-003",
    title: "Quiz sur les probabilités",
    type: "Quiz",
    views: 1100,
    completions: 950,
    rating: "4.7/5",
    status: "Publié",
  },
  {
    id: "VIDEO-004",
    title: "Vidéo explicative sur les intégrales",
    type: "Vidéo",
    views: 1500,
    completions: 1100,
    rating: "4.9/5",
    status: "Publié",
  },
  {
    id: "COURS-005",
    title: "Les suites numériques",
    type: "Cours",
    views: 850,
    completions: 650,
    rating: "4.5/5",
    status: "Brouillon",
  },
]

const studentFeedback = [
  {
    id: "FB-001",
    student: "Jean Dupont",
    content: "Excellent cours, très clair et bien expliqué !",
    course: "Introduction à l'algèbre linéaire",
    date: "2023-07-15",
    rating: "5/5",
  },
  {
    id: "FB-002",
    student: "Marie Martin",
    content: "Les exercices sont bien adaptés au niveau.",
    course: "Exercices sur les dérivées",
    date: "2023-07-14",
    rating: "4/5",
  },
  {
    id: "FB-003",
    student: "Pierre Durand",
    content: "J'ai beaucoup appris grâce à ce quiz.",
    course: "Quiz sur les probabilités",
    date: "2023-07-13",
    rating: "5/5",
  },
  {
    id: "FB-004",
    student: "Sophie Lefebvre",
    content: "La vidéo m'a permis de comprendre les intégrales.",
    course: "Vidéo explicative sur les intégrales",
    date: "2023-07-12",
    rating: "5/5",
  },
  {
    id: "FB-005",
    student: "Lucas Bernard",
    content: "Cours intéressant mais un peu trop rapide.",
    course: "Les suites numériques",
    date: "2023-07-11",
    rating: "4/5",
  },
]

// Colonnes pour les tableaux
const contentColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "views",
    header: "Vues",
  },
  {
    accessorKey: "completions",
    header: "Complétions",
  },
  {
    accessorKey: "rating",
    header: "Note",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <div className="flex items-center">
          <div className={`mr-2 h-2 w-2 rounded-full ${status === "Publié" ? "bg-green-500" : "bg-yellow-500"}`} />
          <span>{status}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Éditer
          </Button>
        </div>
      )
    },
  },
]

const feedbackColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "student",
    header: "Étudiant",
  },
  {
    accessorKey: "content",
    header: "Commentaire",
  },
  {
    accessorKey: "course",
    header: "Cours",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "rating",
    header: "Note",
  },
]

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Professeur</h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord de professeur Mathosphère</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Cours publiés"
          value="24"
          icon={BookOpen}
          description="Total des cours"
          trend="up"
          trendValue="2 nouveaux cours ce mois-ci"
        />
        <StatCard
          title="Exercices"
          value="156"
          icon={FileText}
          description="Total des exercices"
          trend="up"
          trendValue="15 nouveaux exercices ce mois-ci"
        />
        <StatCard
          title="Étudiants"
          value="1 254"
          icon={Users}
          description="Étudiants inscrits"
          trend="up"
          trendValue="8% par rapport au mois dernier"
        />
        <StatCard
          title="Vidéos"
          value="42"
          icon={Video}
          description="Total des vidéos"
          trend="up"
          trendValue="3 nouvelles vidéos ce mois-ci"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <TrendChart
          title="Vues du contenu"
          description="Évolution des vues sur la période"
          data={viewsData}
          className="lg:col-span-4"
        />
        <TrendChart
          title="Complétions"
          description="Évolution des complétions de cours"
          data={completionsData}
          className="lg:col-span-3"
        />
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Contenu récent</TabsTrigger>
            <TabsTrigger value="feedback">Retours des étudiants</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contenu récent</CardTitle>
                <CardDescription>Liste de votre contenu récemment publié ou modifié</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={contentColumns}
                  data={recentContent}
                  searchKey="title"
                  searchPlaceholder="Rechercher un contenu..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Retours des étudiants</CardTitle>
                <CardDescription>Commentaires et évaluations des étudiants sur votre contenu</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={feedbackColumns}
                  data={studentFeedback}
                  searchKey="student"
                  searchPlaceholder="Rechercher un étudiant..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
