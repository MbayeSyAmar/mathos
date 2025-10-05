"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/admin/stat-card"
import { TrendChart } from "@/components/admin/trend-chart"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MessageSquare, Users } from "lucide-react"

// Données de démonstration pour les graphiques
const sessionsData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai"],
  values: [12, 18, 22, 25, 30],
}

const ratingsData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai"],
  values: [4.2, 4.4, 4.5, 4.7, 4.8],
}

// Données de démonstration pour les tableaux
const upcomingSessionsData = [
  {
    id: "SES-001",
    student: "Jean Dupont",
    date: "2023-05-20",
    time: "14:00 - 15:30",
    subject: "Algèbre linéaire",
    status: "Confirmé",
  },
  {
    id: "SES-002",
    student: "Marie Martin",
    date: "2023-05-21",
    time: "10:00 - 11:30",
    subject: "Calcul intégral",
    status: "Confirmé",
  },
  {
    id: "SES-003",
    student: "Pierre Durand",
    date: "2023-05-22",
    time: "16:00 - 17:30",
    subject: "Probabilités",
    status: "En attente",
  },
  {
    id: "SES-004",
    student: "Sophie Lefebvre",
    date: "2023-05-23",
    time: "14:00 - 15:30",
    subject: "Géométrie",
    status: "Confirmé",
  },
  {
    id: "SES-005",
    student: "Lucas Bernard",
    date: "2023-05-24",
    time: "11:00 - 12:30",
    subject: "Statistiques",
    status: "En attente",
  },
]

const messagesData = [
  {
    id: "MSG-001",
    student: "Jean Dupont",
    subject: "Question sur les matrices",
    date: "2023-05-16",
    time: "14:32",
    status: "Non lu",
  },
  {
    id: "MSG-002",
    student: "Marie Martin",
    subject: "Préparation séance du 21/05",
    date: "2023-05-15",
    time: "09:45",
    status: "Lu",
  },
  {
    id: "MSG-003",
    student: "Pierre Durand",
    subject: "Demande de report de séance",
    date: "2023-05-15",
    time: "18:20",
    status: "Non lu",
  },
  {
    id: "MSG-004",
    student: "Sophie Lefebvre",
    subject: "Remerciements",
    date: "2023-05-14",
    time: "11:05",
    status: "Lu",
  },
  {
    id: "MSG-005",
    student: "Lucas Bernard",
    subject: "Exercices supplémentaires",
    date: "2023-05-13",
    time: "16:48",
    status: "Lu",
  },
]

// Colonnes pour les tableaux
const sessionColumns = [
  {
    accessorKey: "student",
    header: "Étudiant",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Heure",
  },
  {
    accessorKey: "subject",
    header: "Sujet",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <div className="flex items-center">
          <div className={`mr-2 h-2 w-2 rounded-full ${status === "Confirmé" ? "bg-green-500" : "bg-yellow-500"}`} />
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
            Détails
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
            Annuler
          </Button>
        </div>
      )
    },
  },
]

const messageColumns = [
  {
    accessorKey: "student",
    header: "Étudiant",
  },
  {
    accessorKey: "subject",
    header: "Sujet",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Heure",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <div className="flex items-center">
          <div className={`mr-2 h-2 w-2 rounded-full ${status === "Lu" ? "bg-green-500" : "bg-red-500"}`} />
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
            Lire
          </Button>
          <Button variant="outline" size="sm" className="text-blue-500 hover:text-blue-700">
            Répondre
          </Button>
        </div>
      )
    },
  },
]

export default function TutorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord tuteur</h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord de tuteur Mathosphère</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Séances réalisées"
          value="48"
          description="+8 ce mois-ci"
          trend="up"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Heures d'encadrement"
          value="72"
          description="+12h ce mois-ci"
          trend="up"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Étudiants encadrés"
          value="15"
          description="+3 ce mois-ci"
          trend="up"
          icon={Users}
          color="green"
        />
        <StatCard
          title="Note moyenne"
          value="4.8/5"
          description="+0.2 vs mois dernier"
          trend="up"
          icon={MessageSquare}
          color="purple"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TrendChart
          title="Séances"
          description="Évolution du nombre de séances"
          data={sessionsData}
          tabs={["Jour", "Semaine", "Mois", "Année"]}
        />
        <TrendChart
          title="Évaluations"
          description="Évolution de la note moyenne"
          data={ratingsData}
          tabs={["Jour", "Semaine", "Mois", "Année"]}
        />
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Séances à venir</TabsTrigger>
          <TabsTrigger value="messages">Messages récents</TabsTrigger>
        </TabsList>
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Séances à venir</CardTitle>
              <CardDescription>Vos prochaines séances d'encadrement</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={sessionColumns}
                data={upcomingSessionsData}
                searchKey="student"
                searchPlaceholder="Rechercher un étudiant..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages récents</CardTitle>
              <CardDescription>Messages reçus de vos étudiants</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={messageColumns}
                data={messagesData}
                searchKey="subject"
                searchPlaceholder="Rechercher un message..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
