"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PlusCircle, UserCog, Users, Activity, UserPlus, TrendingUp, Loader2, Search, Mail, Calendar } from "lucide-react"
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

interface User {
  id: string
  displayName: string
  email: string
  role: string
  createdAt: any
  photoURL?: string
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("recent")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    studentCount: 0,
    teacherCount: 0,
  })
  
  // Listes d'utilisateurs
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsersData()
  }, [])

  const fetchUsersData = async () => {
    try {
      setLoading(true)
      
      // Récupérer tous les utilisateurs
      const usersRef = collection(db, "users")
      const usersSnapshot = await getDocs(usersRef)
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as User))
      
      setAllUsers(usersList)
      
      // Calculer les stats
      const totalUsers = usersList.length
      
      // Compter les nouveaux utilisateurs ce mois
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      const newUsersThisMonth = usersList.filter((user) => {
        if (!user.createdAt) return false
        let date: Date
        if (user.createdAt.toDate && typeof user.createdAt.toDate === "function") {
          date = user.createdAt.toDate()
        } else if (user.createdAt.seconds) {
          date = new Date(user.createdAt.seconds * 1000)
        } else {
          date = new Date(user.createdAt)
        }
        return date >= startOfMonth
      }).length
      
      // Compter par rôle
      const studentCount = usersList.filter((u) => u.role === "student" || !u.role).length
      const teacherCount = usersList.filter((u) => u.role === "teacher").length
      
      setStats({
        totalUsers,
        newUsersThisMonth,
        studentCount,
        teacherCount,
      })
      
      // Récupérer les 10 utilisateurs les plus récents
      const recentUsersQuery = query(
        usersRef,
        orderBy("createdAt", "desc"),
        limit(10)
      )
      const recentSnapshot = await getDocs(recentUsersQuery)
      const recentList = recentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as User))
      
      setRecentUsers(recentList)
      
      console.log("✅ Données utilisateurs chargées:", {
        total: totalUsers,
        nouveaux: newUsersThisMonth,
        étudiants: studentCount,
        professeurs: teacherCount,
      })
    } catch (error) {
      console.error("❌ Erreur lors du chargement des utilisateurs:", error)
      toast.error("Impossible de charger les données des utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      super_admin: { label: "Super Admin", variant: "destructive" },
      teacher: { label: "Professeur", variant: "default" },
      tutor: { label: "Tuteur", variant: "secondary" },
      editor: { label: "Rédacteur", variant: "outline" },
      student: { label: "Étudiant", variant: "secondary" },
    }
    return config[role] || { label: "Étudiant", variant: "secondary" }
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

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return "Date inconnue"
    
    let date: Date
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      date = timestamp.toDate()
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000)
    } else {
      date = new Date(timestamp)
    }

    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Aujourd'hui"
    if (diffInDays === 1) return "Hier"
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
    return `Il y a ${Math.floor(diffInDays / 30)} mois`
  }

  // Filtrer les utilisateurs par recherche
  const filteredUsers = allUsers.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <Button asChild>
            <Link href="/admin/super/utilisateurs/gestion">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Inscrits sur la plateforme</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">Inscriptions ce mois-ci</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.studentCount}</div>
            <p className="text-xs text-muted-foreground">Comptes étudiants</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professeurs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.teacherCount}</div>
            <p className="text-xs text-muted-foreground">Enseignants actifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recent">Utilisateurs récents</TabsTrigger>
          <TabsTrigger value="all">Tous les utilisateurs</TabsTrigger>
        </TabsList>
        
        {/* Utilisateurs récents */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Derniers inscrits</CardTitle>
              <CardDescription>Les 10 derniers utilisateurs inscrits sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Aucun utilisateur</p>
                  <p className="text-sm text-muted-foreground">Commencez par ajouter des utilisateurs</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
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
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatRelativeTime(user.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tous les utilisateurs */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tous les utilisateurs ({allUsers.length})</CardTitle>
              <CardDescription>Liste complète de tous les utilisateurs inscrits</CardDescription>
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
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Aucun utilisateur trouvé</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par ajouter des utilisateurs"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
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
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Inscrit le {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
