"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/admin/stat-card"
import { TrendChart } from "@/components/admin/trend-chart"
import { Users, BookOpen, ShoppingBag, DollarSign, MessageSquare, FileText, GraduationCap, UserCheck } from "lucide-react"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  orderNumber: string
  total: number
  createdAt: any
  userEmail?: string
  userName?: string
  items: any[]
  status: string
}

interface User {
  id: string
  displayName?: string
  email: string
  createdAt: any
  role?: string
}

interface EncadrementRequest {
  id: string
  studentName: string
  teacherName: string
  formule: string
  status: string
  createdAt: any
}

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState({
    utilisateurs: 0,
    cours: 0,
    exercices: 0,
    ventes: 0,
    revenus: 0,
    articles: 0,
    discussions: 0,
    demandes: 0,
    produits: 0,
  })

  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [recentRequests, setRecentRequests] = useState<EncadrementRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Récupérer le nombre d'utilisateurs
        const usersRef = collection(db, "users")
        const usersSnapshot = await getDocs(usersRef)
        const usersCount = usersSnapshot.size

        // Récupérer le nombre de cours publiés
        const coursesRef = collection(db, "courses")
        const coursesQuery = query(coursesRef, where("status", "==", "published"))
        const coursesSnapshot = await getDocs(coursesQuery)
        const coursCount = coursesSnapshot.size

        // Récupérer le nombre d'exercices publiés
        const exercisesRef = collection(db, "exercises")
        const exercisesQuery = query(exercisesRef, where("status", "==", "published"))
        const exercisesSnapshot = await getDocs(exercisesQuery)
        const exercisesCount = exercisesSnapshot.size

        // Récupérer le nombre de ventes et le total des revenus (collection orders)
        const ordersRef = collection(db, "orders")
        const ordersSnapshot = await getDocs(ordersRef)
        const ventesCount = ordersSnapshot.size

        let totalRevenus = 0
        ordersSnapshot.forEach((doc) => {
          const data = doc.data()
          // Le prix total est dans le champ 'total'
          totalRevenus += data.total || 0
        })

        // Récupérer le nombre de produits dans la boutique
        const productsRef = collection(db, "products")
        const productsSnapshot = await getDocs(productsRef)
        const productsCount = productsSnapshot.size

        // Récupérer le nombre d'articles du blog
        const blogRef = collection(db, "blog_posts")
        const blogSnapshot = await getDocs(blogRef)
        const articlesCount = blogSnapshot.size

        // Récupérer le nombre de discussions du forum
        const discussionsRef = collection(db, "forum_discussions")
        const discussionsSnapshot = await getDocs(discussionsRef)
        const discussionsCount = discussionsSnapshot.size

        // Récupérer le nombre de demandes d'encadrement
        const requestsRef = collection(db, "encadrement_requests")
        const requestsSnapshot = await getDocs(requestsRef)
        const demandesCount = requestsSnapshot.size

        // Récupérer les utilisateurs récents
        const recentUsersQuery = query(usersRef, orderBy("createdAt", "desc"), limit(5))
        const recentUsersSnapshot = await getDocs(recentUsersQuery)
        const recentUsersData = recentUsersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt,
        } as User))

        // Récupérer les commandes récentes
        const recentOrdersQuery = query(ordersRef, orderBy("createdAt", "desc"), limit(5))
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
        const recentOrdersData = recentOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Order))

        // Récupérer les demandes d'encadrement récentes
        const recentRequestsQuery = query(requestsRef, orderBy("createdAt", "desc"), limit(5))
        const recentRequestsSnapshot = await getDocs(recentRequestsQuery)
        const recentRequestsData = recentRequestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as EncadrementRequest))

        setStats({
          utilisateurs: usersCount,
          cours: coursCount,
          exercices: exercisesCount,
          ventes: ventesCount,
          revenus: totalRevenus,
          articles: articlesCount,
          discussions: discussionsCount,
          demandes: demandesCount,
          produits: productsCount,
        })

        setRecentUsers(recentUsersData)
        setRecentOrders(recentOrdersData)
        setRecentRequests(recentRequestsData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données du tableau de bord:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Formater le montant en FCFA
  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " FCFA"
    )
  }

  // Formater la date relative
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

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "En attente", variant: "secondary" },
      approved: { label: "Approuvée", variant: "default" },
      rejected: { label: "Refusée", variant: "destructive" },
      delivered: { label: "Livrée", variant: "default" },
      shipped: { label: "Expédiée", variant: "secondary" },
    }
    return config[status] || { label: status, variant: "outline" }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Super Admin</h1>
        <p className="text-muted-foreground">Vue d'ensemble complète de la plateforme Mathosphère.</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.utilisateurs}</div>
            <p className="text-xs text-muted-foreground">Total inscrits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.cours}</div>
            <p className="text-xs text-muted-foreground">Publiés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.ventes}</div>
            <p className="text-xs text-muted-foreground">Commandes totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(stats.revenus)}</div>
            <p className="text-xs text-muted-foreground">Total des ventes</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques secondaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.exercices}</div>
            <p className="text-xs text-muted-foreground">Publiés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.produits}</div>
            <p className="text-xs text-muted-foreground">En boutique</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.articles}</div>
            <p className="text-xs text-muted-foreground">Blog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discussions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.discussions}</div>
            <p className="text-xs text-muted-foreground">Forum actif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.demandes}</div>
            <p className="text-xs text-muted-foreground">Encadrement</p>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nouveaux utilisateurs</CardTitle>
            <CardDescription>Les 5 dernières inscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.displayName || "Utilisateur"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {user.role && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {user.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(user.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun utilisateur récent</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Les 5 dernières ventes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {order.orderNumber || `Commande #${order.id.slice(-6)}`}
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        {formatCurrency(order.total)}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={getStatusBadge(order.status).variant} className="text-xs">
                          {getStatusBadge(order.status).label}
                        </Badge>
                        {order.items && order.items.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(order.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune commande récente</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demandes d'encadrement récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'encadrement récentes</CardTitle>
          <CardDescription>Les 5 dernières demandes de formation personnalisée</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{request.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      Professeur : {request.teacherName} • {request.formule}
                    </p>
                    <Badge 
                      variant={getStatusBadge(request.status).variant}
                      className="text-xs mt-1"
                    >
                      {getStatusBadge(request.status).label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(request.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune demande récente</p>
          )}
        </CardContent>
      </Card>

      {/* Statistiques d'engagement et performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des revenus</CardTitle>
            <CardDescription>Sources de revenus par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Boutique</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(stats.revenus)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Encadrements</span>
                </div>
                <span className="text-sm font-medium">À venir</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Cours premium</span>
                </div>
                <span className="text-sm font-medium">À venir</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble du contenu</CardTitle>
            <CardDescription>Statistiques globales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cours publiés</span>
                <span className="text-sm font-medium">{stats.cours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Exercices disponibles</span>
                <span className="text-sm font-medium">{stats.exercices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Produits en boutique</span>
                <span className="text-sm font-medium">{stats.produits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Articles de blog</span>
                <span className="text-sm font-medium">{stats.articles}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Discussions forum</span>
                <span className="text-sm font-medium">{stats.discussions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
