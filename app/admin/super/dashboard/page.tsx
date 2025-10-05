"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/admin/stat-card"
import { TrendChart } from "@/components/admin/trend-chart"
import { Users, BookOpen, ShoppingBag, DollarSign, MessageSquare, FileText } from "lucide-react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState({
    utilisateurs: 0,
    cours: 0,
    ventes: 0,
    revenus: 0,
    articles: 0,
    discussions: 0,
  })

  const [recentUsers, setRecentUsers] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Récupérer le nombre d'utilisateurs
        const usersRef = collection(db, "users")
        const usersSnapshot = await getDocs(usersRef)
        const usersCount = usersSnapshot.size

        // Récupérer le nombre de cours
        const coursRef = collection(db, "cours")
        const coursSnapshot = await getDocs(coursRef)
        const coursCount = coursSnapshot.size

        // Récupérer le nombre de ventes et le total des revenus
        const commandesRef = collection(db, "commandes")
        const commandesSnapshot = await getDocs(commandesRef)
        const ventesCount = commandesSnapshot.size

        let totalRevenus = 0
        commandesSnapshot.forEach((doc) => {
          const data = doc.data()
          totalRevenus += data.montantTotal || 0
        })

        // Récupérer le nombre d'articles
        const articlesRef = collection(db, "articles")
        const articlesSnapshot = await getDocs(articlesRef)
        const articlesCount = articlesSnapshot.size

        // Récupérer le nombre de discussions
        const discussionsRef = collection(db, "forum_discussions")
        const discussionsSnapshot = await getDocs(discussionsRef)
        const discussionsCount = discussionsSnapshot.size

        // Récupérer les utilisateurs récents
        const recentUsersQuery = query(usersRef, orderBy("createdAt", "desc"), limit(5))
        const recentUsersSnapshot = await getDocs(recentUsersQuery)
        const recentUsersData = recentUsersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }))

        // Récupérer les commandes récentes
        const recentOrdersQuery = query(commandesRef, orderBy("dateCommande", "desc"), limit(5))
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
        const recentOrdersData = recentOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          dateCommande: doc.data().dateCommande?.toDate?.() || new Date(),
        }))

        setStats({
          utilisateurs: usersCount,
          cours: coursCount,
          ventes: ventesCount,
          revenus: totalRevenus,
          articles: articlesCount,
          discussions: discussionsCount,
        })

        setRecentUsers(recentUsersData)
        setRecentOrders(recentOrdersData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données du tableau de bord:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Formater le montant en FCFA
  const formatCurrency = (amount) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " FCFA"
    )
  }

  // Formater la date relative
  const formatRelativeTime = (date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Aujourd'hui"
    if (diffInDays === 1) return "Hier"
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
    return `Il y a ${Math.floor(diffInDays / 30)} mois`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur le tableau de bord administrateur de Mathosphère.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Utilisateurs"
          value={loading ? "Chargement..." : stats.utilisateurs.toString()}
          icon={Users}
          description="Total des utilisateurs"
          trend="up"
          trendValue="12% par rapport au mois dernier"
        />
        <StatCard
          title="Cours"
          value={loading ? "Chargement..." : stats.cours.toString()}
          icon={BookOpen}
          description="Cours disponibles"
          trend="up"
          trendValue="4 nouveaux ce mois-ci"
        />
        <StatCard
          title="Ventes"
          value={loading ? "Chargement..." : stats.ventes.toString()}
          icon={ShoppingBag}
          description="Commandes totales"
          trend="down"
          trendValue="3% par rapport au mois dernier"
        />
        <StatCard
          title="Revenus totaux"
          value={loading ? "Chargement..." : formatCurrency(stats.revenus)}
          icon={DollarSign}
          description="Mois en cours"
          trend="up"
          trendValue="12% par rapport au mois dernier"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Articles"
          value={loading ? "Chargement..." : stats.articles.toString()}
          icon={FileText}
          description="Articles publiés"
          trend="up"
          trendValue="8 nouveaux ce mois-ci"
        />
        <StatCard
          title="Discussions"
          value={loading ? "Chargement..." : stats.discussions.toString()}
          icon={MessageSquare}
          description="Discussions du forum"
          trend="up"
          trendValue="15 nouvelles cette semaine"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aperçu des revenus</CardTitle>
            <CardDescription>Revenus mensuels pour l'année en cours</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TrendChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Nouveaux utilisateurs</h4>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : recentUsers.length > 0 ? (
                  <div className="space-y-2">
                    {recentUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{user.nom || "Utilisateur"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(user.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun utilisateur récent</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Commandes récentes</h4>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-2">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Commande #{order.id.slice(-6)}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(order.montantTotal || 0)}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(order.dateCommande)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune commande récente</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques d'engagement</CardTitle>
            <CardDescription>Activité des utilisateurs sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Taux de connexion quotidien</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Temps moyen par session</span>
                <span className="text-sm font-medium">24 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Exercices complétés</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Taux de réussite moyen</span>
                <span className="text-sm font-medium">76%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance du contenu</CardTitle>
            <CardDescription>Popularité des différents types de contenu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cours les plus consultés</span>
                <span className="text-sm font-medium">Algèbre</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quiz les plus populaires</span>
                <span className="text-sm font-medium">Géométrie</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vidéos les plus vues</span>
                <span className="text-sm font-medium">Calcul différentiel</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Articles les plus lus</span>
                <span className="text-sm font-medium">Méthodes d'étude</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
