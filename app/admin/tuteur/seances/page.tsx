"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/admin/data-table"
import { Plus, Calendar, CheckCircle, Clock, Users } from "lucide-react"

export default function TuteurSeancesPage() {
  const [activeTab, setActiveTab] = useState("avenir")

  // Colonnes pour les tableaux
  const seancesColumns = [
    { header: "Élève", accessorKey: "student" },
    { header: "Sujet", accessorKey: "subject" },
    { header: "Date", accessorKey: "date" },
    { header: "Heure", accessorKey: "time" },
    { header: "Durée", accessorKey: "duration" },
    { header: "Statut", accessorKey: "status" },
  ]

  // Données pour les séances à venir
  const upcomingSessionsData = [
    {
      id: "1",
      student: "Lucas Martin",
      subject: "Préparation examen d'analyse",
      date: "15/05/2023",
      time: "14:00",
      duration: "1h30",
      status: "Confirmé",
    },
    {
      id: "2",
      student: "Emma Dubois",
      subject: "Aide aux devoirs - Algèbre",
      date: "16/05/2023",
      time: "16:30",
      duration: "1h00",
      status: "Confirmé",
    },
    {
      id: "3",
      student: "Thomas Bernard",
      subject: "Préparation concours",
      date: "18/05/2023",
      time: "10:00",
      duration: "2h00",
      status: "En attente",
    },
  ]

  // Données pour les séances passées
  const pastSessionsData = [
    {
      id: "4",
      student: "Julie Lefebvre",
      subject: "Révision probabilités",
      date: "10/05/2023",
      time: "15:00",
      duration: "1h30",
      status: "Terminé",
    },
    {
      id: "5",
      student: "Lucas Martin",
      subject: "Préparation examen d'analyse",
      date: "08/05/2023",
      time: "14:00",
      duration: "1h30",
      status: "Terminé",
    },
    {
      id: "6",
      student: "Sophie Moreau",
      subject: "Aide aux devoirs - Géométrie",
      date: "05/05/2023",
      time: "17:00",
      duration: "1h00",
      status: "Terminé",
    },
    {
      id: "7",
      student: "Thomas Bernard",
      subject: "Préparation concours",
      date: "03/05/2023",
      time: "10:00",
      duration: "2h00",
      status: "Terminé",
    },
    {
      id: "8",
      student: "Emma Dubois",
      subject: "Aide aux devoirs - Algèbre",
      date: "28/04/2023",
      time: "16:30",
      duration: "1h00",
      status: "Terminé",
    },
  ]

  // Données pour les demandes de séances
  const requestsData = [
    {
      id: "9",
      student: "Maxime Petit",
      subject: "Aide en trigonométrie",
      date: "20/05/2023",
      time: "14:00",
      duration: "1h00",
      status: "En attente",
    },
    {
      id: "10",
      student: "Camille Leroy",
      subject: "Préparation baccalauréat",
      date: "22/05/2023",
      time: "16:00",
      duration: "2h00",
      status: "En attente",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Séances</h1>
          <p className="text-muted-foreground">Planifiez et gérez vos séances de tutorat avec les élèves.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle séance
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Séances à venir</p>
            <p className="text-2xl font-bold">{upcomingSessionsData.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Séances terminées</p>
            <p className="text-2xl font-bold">{pastSessionsData.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Heures ce mois</p>
            <p className="text-2xl font-bold">18h30</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Élèves actifs</p>
            <p className="text-2xl font-bold">5</p>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="avenir">À venir</TabsTrigger>
          <TabsTrigger value="passees">Passées</TabsTrigger>
          <TabsTrigger value="demandes">Demandes</TabsTrigger>
        </TabsList>

        <TabsContent value="avenir" className="space-y-4">
          <Card>
            <DataTable
              title="Séances à venir"
              description="Vos prochaines séances de tutorat"
              columns={seancesColumns}
              data={upcomingSessionsData}
              searchKey="student"
            />
          </Card>
        </TabsContent>

        <TabsContent value="passees" className="space-y-4">
          <Card>
            <DataTable
              title="Séances passées"
              description="Historique de vos séances terminées"
              columns={seancesColumns}
              data={pastSessionsData}
              searchKey="student"
            />
          </Card>
        </TabsContent>

        <TabsContent value="demandes" className="space-y-4">
          <Card>
            <DataTable
              title="Demandes de séances"
              description="Demandes en attente de confirmation"
              columns={seancesColumns}
              data={requestsData}
              searchKey="student"
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
