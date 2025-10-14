"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  BookOpen, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Activity,
  Loader2 
} from "lucide-react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Stats {
  totalUsers: number
  newUsersThisMonth: number
  newUsersLastMonth: number
  totalCourses: number
  publishedCourses: number
  totalOrders: number
  ordersThisMonth: number
  ordersLastMonth: number
  totalRevenue: number
  revenueThisMonth: number
  revenueLastMonth: number
}

export default function StatistiquesPage() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsersThisMonth: 0,
    newUsersLastMonth: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalOrders: 0,
    ordersThisMonth: 0,
    ordersLastMonth: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
  })

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)

      // Dates pour les comparaisons
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Utilisateurs
      const usersRef = collection(db, "users")
      const usersSnapshot = await getDocs(usersRef)
      const allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as any))

      const convertTimestamp = (timestamp: any) => {
        if (!timestamp) return new Date(0)
        if (timestamp?.toDate) return timestamp.toDate()
        if (timestamp?.seconds) return new Date(timestamp.seconds * 1000)
        if (timestamp instanceof Date) return timestamp
        return new Date(0)
      }

      const newUsersThisMonth = allUsers.filter(u => {
        const date = convertTimestamp(u.createdAt)
        return date >= startOfMonth
      }).length

      const newUsersLastMonth = allUsers.filter(u => {
        const date = convertTimestamp(u.createdAt)
        return date >= startOfLastMonth && date <= endOfLastMonth
      }).length

      // Cours
      const coursesRef = collection(db, "courses")
      const coursesSnapshot = await getDocs(coursesRef)
      const publishedCourses = coursesSnapshot.docs.filter(
        doc => doc.data().status === "published"
      ).length

      // Commandes
      const ordersRef = collection(db, "orders")
      const ordersSnapshot = await getDocs(ordersRef)
      const allOrders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as any))

      let totalRevenue = 0
      let revenueThisMonth = 0
      let revenueLastMonth = 0
      let ordersThisMonth = 0
      let ordersLastMonth = 0

      allOrders.forEach(order => {
        const orderDate = convertTimestamp(order.createdAt)
        const amount = order.total || 0

        totalRevenue += amount

        if (orderDate >= startOfMonth) {
          revenueThisMonth += amount
          ordersThisMonth++
        }

        if (orderDate >= startOfLastMonth && orderDate <= endOfLastMonth) {
          revenueLastMonth += amount
          ordersLastMonth++
        }
      })

      setStats({
        totalUsers: allUsers.length,
        newUsersThisMonth,
        newUsersLastMonth,
        totalCourses: coursesSnapshot.size,
        publishedCourses,
        totalOrders: allOrders.length,
        ordersThisMonth,
        ordersLastMonth,
        totalRevenue,
        revenueThisMonth,
        revenueLastMonth,
      })

    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
      toast.error("Erreur lors du chargement des statistiques")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const renderGrowthIndicator = (current: number, previous: number) => {
    const growth = calculateGrowth(current, previous)
    const isPositive = growth >= 0

    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{Math.abs(growth)}%</span>
        <span className="text-muted-foreground text-xs">vs mois dernier</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des statistiques...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
          <p className="text-muted-foreground">Analyse détaillée de la plateforme</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner la période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois-ci</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
            <SelectItem value="all">Tout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mb-2">Total inscrits</p>
            {renderGrowthIndicator(stats.newUsersThisMonth, stats.newUsersLastMonth)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground mb-2">Inscriptions</p>
            <p className="text-xs text-muted-foreground">
              {stats.newUsersLastMonth} le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes ce mois</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersThisMonth}</div>
            <p className="text-xs text-muted-foreground mb-2">Commandes</p>
            {renderGrowthIndicator(stats.ordersThisMonth, stats.ordersLastMonth)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenueThisMonth)}</div>
            <p className="text-xs text-muted-foreground mb-2">FCFA</p>
            {renderGrowthIndicator(stats.revenueThisMonth, stats.revenueLastMonth)}
          </CardContent>
        </Card>
      </div>

      {/* Onglets de statistiques détaillées */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performances globales</CardTitle>
                <CardDescription>Résumé des métriques clés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total utilisateurs</span>
                  <span className="text-sm font-medium">{stats.totalUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total commandes</span>
                  <span className="text-sm font-medium">{stats.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total revenus</span>
                  <span className="text-sm font-medium">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cours publiés</span>
                  <span className="text-sm font-medium">{stats.publishedCourses}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances ce mois</CardTitle>
                <CardDescription>Évolution par rapport au mois dernier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nouveaux utilisateurs</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.newUsersThisMonth}</span>
                    {renderGrowthIndicator(stats.newUsersThisMonth, stats.newUsersLastMonth)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Commandes</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.ordersThisMonth}</span>
                    {renderGrowthIndicator(stats.ordersThisMonth, stats.ordersLastMonth)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenus</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatCurrency(stats.revenueThisMonth)}</span>
                    {renderGrowthIndicator(stats.revenueThisMonth, stats.revenueLastMonth)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques utilisateurs</CardTitle>
              <CardDescription>Analyse détaillée des inscriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ce mois</p>
                  <p className="text-2xl font-bold">{stats.newUsersThisMonth}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Mois dernier</p>
                  <p className="text-2xl font-bold">{stats.newUsersLastMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques revenus</CardTitle>
              <CardDescription>Analyse des ventes et revenus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ce mois</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.revenueThisMonth)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Mois dernier</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.revenueLastMonth)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques contenu</CardTitle>
              <CardDescription>Analyse du contenu publié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total cours</span>
                <span className="text-sm font-medium">{stats.totalCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cours publiés</span>
                <span className="text-sm font-medium">{stats.publishedCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Taux de publication</span>
                <span className="text-sm font-medium">
                  {stats.totalCourses > 0 
                    ? Math.round((stats.publishedCourses / stats.totalCourses) * 100) 
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
