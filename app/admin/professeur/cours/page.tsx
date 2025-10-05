"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"

// Données de démonstration
const courses = [
  {
    id: "COURS-001",
    title: "Introduction à l'algèbre linéaire",
    level: "Terminale",
    duration: "2h30",
    students: 450,
    rating: "4.8/5",
    status: "Publié",
  },
  {
    id: "COURS-002",
    title: "Les fonctions dérivées",
    level: "Première",
    duration: "1h45",
    students: 380,
    rating: "4.6/5",
    status: "Publié",
  },
  {
    id: "COURS-003",
    title: "Probabilités et statistiques",
    level: "Terminale",
    duration: "3h00",
    students: 420,
    rating: "4.7/5",
    status: "Publié",
  },
  {
    id: "COURS-004",
    title: "Les intégrales",
    level: "Terminale",
    duration: "2h15",
    students: 390,
    rating: "4.9/5",
    status: "Publié",
  },
  {
    id: "COURS-005",
    title: "Les suites numériques",
    level: "Première",
    duration: "2h00",
    students: 350,
    rating: "4.5/5",
    status: "Brouillon",
  },
  {
    id: "COURS-006",
    title: "Géométrie dans l'espace",
    level: "Terminale",
    duration: "2h45",
    students: 0,
    rating: "-",
    status: "Brouillon",
  },
  {
    id: "COURS-007",
    title: "Nombres complexes",
    level: "Terminale",
    duration: "2h30",
    students: 320,
    rating: "4.7/5",
    status: "Publié",
  },
]

// Colonnes pour les tableaux
const courseColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "level",
    header: "Niveau",
  },
  {
    accessorKey: "duration",
    header: "Durée",
  },
  {
    accessorKey: "students",
    header: "Étudiants",
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
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
            Supprimer
          </Button>
        </div>
      )
    },
  },
]

export default function CoursesPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des cours</h1>
          <p className="text-muted-foreground">Créez et gérez vos cours sur la plateforme Mathosphère</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer un cours
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau cours</DialogTitle>
              <DialogDescription>Remplissez le formulaire ci-dessous pour créer un nouveau cours</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Titre
                </Label>
                <Input id="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">
                  Niveau
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconde">Seconde</SelectItem>
                    <SelectItem value="premiere">Première</SelectItem>
                    <SelectItem value="terminale">Terminale</SelectItem>
                    <SelectItem value="superieur">Supérieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Durée estimée
                </Label>
                <Input id="duration" placeholder="Ex: 2h30" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea id="description" placeholder="Description du cours" className="col-span-3" rows={5} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Statut
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setOpen(false)}>Créer le cours</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous les cours</TabsTrigger>
          <TabsTrigger value="published">Publiés</TabsTrigger>
          <TabsTrigger value="draft">Brouillons</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des cours</CardTitle>
              <CardDescription>Tous vos cours sur la plateforme Mathosphère</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={courseColumns}
                data={courses}
                searchKey="title"
                searchPlaceholder="Rechercher un cours..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cours publiés</CardTitle>
              <CardDescription>Vos cours publiés sur la plateforme Mathosphère</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={courseColumns}
                data={courses.filter((course) => course.status === "Publié")}
                searchKey="title"
                searchPlaceholder="Rechercher un cours..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cours en brouillon</CardTitle>
              <CardDescription>Vos cours en cours de rédaction</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={courseColumns}
                data={courses.filter((course) => course.status === "Brouillon")}
                searchKey="title"
                searchPlaceholder="Rechercher un cours..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
