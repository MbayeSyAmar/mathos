"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { DataTable } from "@/components/admin/data-table"
import { Search } from "lucide-react"

export default function GestionUtilisateursPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "utilisateurs")
        const userSnapshot = await getDocs(usersCollection)
        const usersList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersList)
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, "utilisateurs", userId)
      await updateDoc(userRef, { role: newRole })

      // Mettre à jour l'état local
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      toast({
        title: "Succès",
        description: "Le rôle de l'utilisateur a été mis à jour",
        variant: "default",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    {
      accessorKey: "displayName",
      header: "Nom",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Rôle actuel",
      cell: ({ row }) => {
        const role = row.getValue("role") || "étudiant"
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              role === "super_admin"
                ? "bg-red-100 text-red-800"
                : role === "teacher"
                  ? "bg-blue-100 text-blue-800"
                  : role === "tutor"
                    ? "bg-green-100 text-green-800"
                    : role === "editor"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
            }`}
          >
            {role === "super_admin"
              ? "Super Admin"
              : role === "teacher"
                ? "Professeur"
                : role === "tutor"
                  ? "Tuteur"
                  : role === "editor"
                    ? "Rédacteur"
                    : "Étudiant"}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Changer le rôle",
      cell: ({ row }) => {
        const userId = row.original.id
        return (
          <Select
            onValueChange={(value) => updateUserRole(userId, value)}
            defaultValue={row.getValue("role") || "étudiant"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="étudiant">Étudiant</SelectItem>
              <SelectItem value="teacher">Professeur</SelectItem>
              <SelectItem value="tutor">Tuteur</SelectItem>
              <SelectItem value="editor">Rédacteur</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Gérez les rôles des utilisateurs de la plateforme</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>Liste de tous les utilisateurs enregistrés sur la plateforme</CardDescription>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Chargement des utilisateurs...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredUsers} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
