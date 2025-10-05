"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { getAllProduits, deleteProduit, type Produit } from "@/lib/services/produit-service"
import { Loader2, Search, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AdminBoutiquePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Produit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Produit | null>(null)

  // Charger les produits
  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const data = await getAllProduits()
      setProducts(data)
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Filtrer les produits par recherche
  const filteredProducts = products.filter(
    (product) =>
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categorie.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Gérer la suppression d'un produit
  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      const success = await deleteProduit(productToDelete.id)
      if (success) {
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès.",
        })
        // Recharger la liste des produits
        loadProducts()
      } else {
        throw new Error("Échec de la suppression du produit")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      })
    } finally {
      setProductToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Naviguer vers la page d'ajout de produit
  const handleAddProduct = () => {
    router.push("/admin/super/boutique/ajouter")
  }

  // Naviguer vers la page de modification de produit
  const handleEditProduct = (productId: string) => {
    router.push(`/admin/super/boutique/modifier/${productId}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des produits</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={product.imageUrl || "/placeholder.svg?height=200&width=400"}
                    alt={product.nom}
                    className="w-full h-full object-cover"
                  />
                  {product.bestseller && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded">
                      Bestseller
                    </div>
                  )}
                  {!product.estPublie && (
                    <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 text-xs font-bold rounded">
                      Non publié
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.nom}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-500 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{product.prix.toLocaleString()} FCFA</p>
                        {product.oldPrice && (
                          <p className="text-sm text-gray-500 line-through">{product.oldPrice.toLocaleString()} FCFA</p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditProduct(product.id)}>
                        <Pencil className="h-4 w-4 mr-1" /> Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setProductToDelete(product)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le produit sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
