"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/admin/data-table"
import { PlusCircle, UserCog } from "lucide-react"

// Données de démonstration pour les tableaux
const recentUsers = [
  {
    id: "USR-001",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    date: "2023-07-15",
    role: "Étudiant",
  },
  {
    id: "USR-002",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    date: "2023-07-14",
    role: "Étudiant",
  },
  {
    id: "USR-003",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    date: "2023-07-13",
    role: "Professeur",
  },
  {
    id: "USR-004",
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@example.com",
    date: "2023-07-12",
    role: "Étudiant",
  },
  {
    id: "USR-005",
    name: "Lucas Bernard",
    email: "lucas.bernard@example.com",
    date: "2023-07-11",
    role: "Tuteur",
  },
]

const activeUsers = [
  {
    id: "USR-001",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    lastActive: "Il y a 5 minutes",
    sessions: 28,
    role: "Étudiant",
  },
  {
    id: "USR-003",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    lastActive: "Il y a 15 minutes",
    sessions: 42,
    role: "Professeur",
  },
  {
    id: "USR-006",
    name: "Camille Roux",
    email: "camille.roux@example.com",
    lastActive: "Il y a 22 minutes",
    sessions: 17,
    role: "Étudiant",
  },
  {
    id: "USR-008",
    name: "Thomas Petit",
    email: "thomas.petit@example.com",
    lastActive: "Il y a 30 minutes",
    sessions: 31,
    role: "Étudiant",
  },
  {
    id: "USR-005",
    name: "Lucas Bernard",
    email: "lucas.bernard@example.com",
    lastActive: "Il y a 45 minutes",
    sessions: 24,
    role: "Tuteur",
  },
]

// Colonnes pour les tableaux
const recentColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "date",
    header: "Date d'inscription",
  },
  {
    accessorKey: "role",
    header: "Rôle",
  },
]

const activeColumns = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "lastActive",
    header: "Dernière activité",
  },
  {
    accessorKey: "sessions",
    header: "Sessions",
  },
  {
    accessorKey: "role",
    header: "Rôle",
  },
]

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("recent")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les utilisateurs de la plateforme</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/super/utilisateurs/gestion">
              <UserCog className="mr-2 h-4 w-4" />
              Gérer les rôles
            </Link>
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">624</div>
            <p className="text-xs text-muted-foreground">+5% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux utilisateurs</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+19% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">+2% par rapport au mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recent">Utilisateurs récents</TabsTrigger>
          <TabsTrigger value="active">Utilisateurs actifs</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs récemment inscrits</CardTitle>
              <CardDescription>Liste des derniers utilisateurs inscrits sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={recentColumns}
                data={recentUsers}
                searchKey="name"
                searchPlaceholder="Rechercher un utilisateur..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs actifs</CardTitle>
              <CardDescription>Liste des utilisateurs actuellement actifs sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={activeColumns}
                data={activeUsers}
                searchKey="name"
                searchPlaceholder="Rechercher un utilisateur..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
