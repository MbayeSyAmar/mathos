"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  FileText, 
  Video, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Loader2 
} from "lucide-react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { toast } from "sonner"

interface Content {
  id: string
  title: string
  status: string
  createdAt: any
  updatedAt?: any
  author?: string
}

export default function ContenuPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Content[]>([])
  const [exercises, setExercises] = useState<Content[]>([])
  const [videos, setVideos] = useState<Content[]>([])
  const [products, setProducts] = useState<Content[]>([])
  const [blogPosts, setBlogPosts] = useState<Content[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalExercises: 0,
    publishedExercises: 0,
    totalVideos: 0,
    totalProducts: 0,
    totalBlogPosts: 0,
  })

  useEffect(() => {
    fetchAllContent()
  }, [])

  const fetchAllContent = async () => {
    try {
      setLoading(true)

      // Récupérer les cours
      const coursesRef = collection(db, "courses")
      const coursesSnapshot = await getDocs(query(coursesRef, orderBy("createdAt", "desc")))
      const coursesList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Content))
      setCourses(coursesList)

      const publishedCourses = coursesList.filter(c => c.status === "published").length

      // Récupérer les exercices
      const exercisesRef = collection(db, "exercises")
      const exercisesSnapshot = await getDocs(query(exercisesRef, orderBy("createdAt", "desc")))
      const exercisesList = exercisesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Content))
      setExercises(exercisesList)

      const publishedExercises = exercisesList.filter(e => e.status === "published").length

      // Récupérer les vidéos
      const videosRef = collection(db, "videos")
      const videosSnapshot = await getDocs(query(videosRef, orderBy("createdAt", "desc")))
      const videosList = videosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Content))
      setVideos(videosList)

      // Récupérer les produits
      const productsRef = collection(db, "products")
      const productsSnapshot = await getDocs(query(productsRef, orderBy("createdAt", "desc")))
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Content))
      setProducts(productsList)

      // Récupérer les articles de blog
      const blogRef = collection(db, "blog_posts")
      const blogSnapshot = await getDocs(query(blogRef, orderBy("createdAt", "desc")))
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Content))
      setBlogPosts(blogList)

      setStats({
        totalCourses: coursesList.length,
        publishedCourses,
        totalExercises: exercisesList.length,
        publishedExercises,
        totalVideos: videosList.length,
        totalProducts: productsList.length,
        totalBlogPosts: blogList.length,
      })

    } catch (error) {
      console.error("Erreur lors du chargement du contenu:", error)
      toast.error("Erreur lors du chargement du contenu")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: "default",
      draft: "secondary",
      archived: "destructive",
    }
    return variants[status] || "outline"
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Date inconnue"
    
    let date: Date
    if (timestamp?.toDate) {
      date = timestamp.toDate()
    } else if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000)
    } else if (timestamp instanceof Date) {
      date = timestamp
    } else {
      return "Date inconnue"
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const renderContentList = (items: Content[], type: string) => {
    const filtered = items.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Aucun contenu trouvé</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par créer du contenu"}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {filtered.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium">{item.title || "Sans titre"}</p>
                <Badge variant={getStatusBadge(item.status)}>
                  {item.status === "published" ? "Publié" : item.status === "draft" ? "Brouillon" : "Archivé"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Créé le {formatDate(item.createdAt)}</span>
                {item.author && <span>Par {item.author}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion du Contenu</h1>
          <p className="text-muted-foreground">Gérez tous les contenus de la plateforme</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">{stats.publishedCourses} publiés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalExercises}</div>
            <p className="text-xs text-muted-foreground">{stats.publishedExercises} publiés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vidéos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalVideos}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">En boutique</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher du contenu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Contenu par catégories */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">
            <BookOpen className="h-4 w-4 mr-2" />
            Cours ({stats.totalCourses})
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <FileText className="h-4 w-4 mr-2" />
            Exercices ({stats.totalExercises})
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Vidéos ({stats.totalVideos})
          </TabsTrigger>
          <TabsTrigger value="products">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Produits ({stats.totalProducts})
          </TabsTrigger>
          <TabsTrigger value="blog">
            <MessageSquare className="h-4 w-4 mr-2" />
            Blog ({stats.totalBlogPosts})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cours</CardTitle>
              <CardDescription>Gérez les cours de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                renderContentList(courses, "cours")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercices</CardTitle>
              <CardDescription>Gérez les exercices de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                renderContentList(exercises, "exercice")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vidéos</CardTitle>
              <CardDescription>Gérez les vidéos de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                renderContentList(videos, "vidéo")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produits</CardTitle>
              <CardDescription>Gérez les produits de la boutique</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                renderContentList(products, "produit")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Articles de Blog</CardTitle>
              <CardDescription>Gérez les articles du blog</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                renderContentList(blogPosts, "article")
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
