"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Article {
  id: string
  titre: string
  contenu: string
  image: string
  datePublication: string
  auteur: string
  categorie: string
  status: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
    categorie: "",
    status: "brouillon",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const columns = [
    {
      accessorKey: "titre",
      header: "Titre",
    },
    {
      accessorKey: "categorie",
      header: "Catégorie",
    },
    {
      accessorKey: "datePublication",
      header: "Date de publication",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status")
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "publié"
                ? "bg-green-100 text-green-800"
                : status === "brouillon"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const article = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDelete(article.id, article.image)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const articlesRef = collection(db, "articles")
      const articlesQuery = query(articlesRef, orderBy("datePublication", "desc"))
      const snapshot = await getDocs(articlesQuery)

      const articlesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Article[]

      setArticles(articlesData)
    } catch (error) {
      console.error("Erreur lors de la récupération des articles:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (article: Article) => {
    setCurrentArticle(article)
    setFormData({
      titre: article.titre,
      contenu: article.contenu,
      categorie: article.categorie,
      status: article.status,
      image: null,
    })
    setImagePreview(article.image)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await deleteDoc(doc(db, "articles", id))

        // Supprimer l'image du stockage si elle existe
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl)
          await deleteObject(imageRef)
        }

        setArticles(articles.filter((article) => article.id !== id))
        toast({
          title: "Succès",
          description: "Article supprimé avec succès",
        })
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'article",
          variant: "destructive",
        })
      }
    }
  }

  const handleAddNew = () => {
    setCurrentArticle(null)
    setFormData({
      titre: "",
      contenu: "",
      categorie: "",
      status: "brouillon",
      image: null,
    })
    setImagePreview(null)
    setIsDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, image: file })

      // Créer un aperçu de l'image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let imageUrl = currentArticle?.image || ""

      // Si une nouvelle image a été sélectionnée, la télécharger
      if (formData.image) {
        const storageRef = ref(storage, `articles/${formData.image.name}-${Date.now()}`)
        const uploadResult = await uploadBytes(storageRef, formData.image)
        imageUrl = await getDownloadURL(uploadResult.ref)
      }

      const articleData = {
        titre: formData.titre,
        contenu: formData.contenu,
        categorie: formData.categorie,
        status: formData.status,
        image: imageUrl,
        datePublication: currentArticle?.datePublication || new Date().toISOString(),
        auteur: currentArticle?.auteur || "Rédacteur", // À remplacer par l'utilisateur connecté
      }

      if (currentArticle) {
        // Mise à jour d'un article existant
        await updateDoc(doc(db, "articles", currentArticle.id), articleData)
        setArticles(
          articles.map((article) =>
            article.id === currentArticle.id ? ({ ...articleData, id: currentArticle.id } as Article) : article,
          ),
        )
        toast({
          title: "Succès",
          description: "Article mis à jour avec succès",
        })
      } else {
        // Création d'un nouvel article
        const docRef = await addDoc(collection(db, "articles"), articleData)
        setArticles([{ ...articleData, id: docRef.id } as Article, ...articles])
        toast({
          title: "Succès",
          description: "Article créé avec succès",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'article",
        variant: "destructive",
      })
    }
  }

  const filteredArticles = articles.filter(
    (article) =>
      article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Articles</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvel Article
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-500" />
        <Input
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredArticles} loading={loading} />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentArticle ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="titre">Titre</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Input
                  id="categorie"
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contenu">Contenu</Label>
                <Textarea
                  id="contenu"
                  rows={10}
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="brouillon">Brouillon</option>
                  <option value="publié">Publié</option>
                  <option value="archivé">Archivé</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview || "/placeholder.svg"} alt="Aperçu" className="max-h-40 rounded-md" />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">{currentArticle ? "Mettre à jour" : "Créer"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
