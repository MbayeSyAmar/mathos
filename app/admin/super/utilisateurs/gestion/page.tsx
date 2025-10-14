"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Search, UserPlus, Loader2, Mail, User as UserIcon, Shield, Calendar } from "lucide-react"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

interface User {
  id: string
  displayName: string
  email: string
  role: string
  createdAt?: any
  photoURL?: string
}

export default function GestionUtilisateursPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  
  // Form state pour ajouter un utilisateur
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "student",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersCollection = collection(db, "users")
      const userSnapshot = await getDocs(usersCollection)
      const usersList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as User))
      
      console.log("✅ Utilisateurs chargés:", usersList.length)
      setUsers(usersList)
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des utilisateurs:", error)
      toast.error("Impossible de charger les utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, { role: newRole })

      // Mettre à jour l'état local
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      toast.success("Le rôle de l'utilisateur a été mis à jour")
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error)
      toast.error("Impossible de mettre à jour le rôle de l'utilisateur")
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.displayName) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    if (newUser.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    try {
      setCreating(true)

      // Créer l'utilisateur dans Firebase Auth
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      )

      // Créer le document utilisateur dans Firestore
      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        photoURL: null,
        createdAt: serverTimestamp(),
      })

      toast.success(`Utilisateur ${newUser.displayName} créé avec succès`)
      
      // Réinitialiser le formulaire
      setNewUser({
        email: "",
        password: "",
        displayName: "",
        role: "student",
      })
      
      setAddDialogOpen(false)
      
      // Recharger la liste
      fetchUsers()
    } catch (error: any) {
      console.error("Erreur lors de la création de l'utilisateur:", error)
      
      if (error.code === "auth/email-already-in-use") {
        toast.error("Cette adresse email est déjà utilisée")
      } else if (error.code === "auth/invalid-email") {
        toast.error("Adresse email invalide")
      } else if (error.code === "auth/weak-password") {
        toast.error("Le mot de passe est trop faible")
      } else {
        toast.error("Impossible de créer l'utilisateur")
      }
    } finally {
      setCreating(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      super_admin: { label: "Super Admin", variant: "destructive" },
      teacher: { label: "Professeur", variant: "default" },
      tutor: { label: "Tuteur", variant: "secondary" },
      editor: { label: "Rédacteur", variant: "outline" },
      student: { label: "Étudiant", variant: "secondary" },
    }
    return config[role] || { label: role, variant: "outline" }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Date inconnue"
    
    let date: Date
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      date = timestamp.toDate()
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000)
    } else {
      date = new Date(timestamp)
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les rôles des utilisateurs de la plateforme</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Utilisateurs ({users.length})</CardTitle>
              <CardDescription>Liste de tous les utilisateurs enregistrés sur la plateforme</CardDescription>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom, email ou rôle..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Chargement des utilisateurs...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Aucun utilisateur trouvé</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par ajouter un utilisateur"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{user.displayName || "Sans nom"}</p>
                        <Badge variant={getRoleBadge(user.role).variant}>
                          {getRoleBadge(user.role).label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        {user.createdAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Inscrit le {formatDate(user.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <Shield className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Étudiant</SelectItem>
                        <SelectItem value="teacher">Professeur</SelectItem>
                        <SelectItem value="tutor">Tuteur</SelectItem>
                        <SelectItem value="editor">Rédacteur</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour ajouter un utilisateur */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte utilisateur avec un rôle spécifique
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nom complet *</Label>
              <Input
                id="displayName"
                placeholder="Ex: Jean Dupont"
                value={newUser.displayName}
                onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: jean.dupont@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Au moins 6 caractères"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="teacher">Professeur</SelectItem>
                  <SelectItem value="tutor">Tuteur</SelectItem>
                  <SelectItem value="editor">Rédacteur</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={creating}
            >
              Annuler
            </Button>
            <Button onClick={handleCreateUser} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer l'utilisateur
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
