"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/data-table"
import { getAllProduits, deleteProduit, type Produit } from "@/lib/services/produit-service"
import { ProductForm } from "@/components/admin/product-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const columns = [
    {
      accessorKey: "nom",
      header: "Nom",
    },
    {
      accessorKey: "categorie",
      header: "Catégorie",
    },
    {
      accessorKey: "prix",
      header: "Prix",
      cell: ({ row }) => `${row.original.prix.toFixed(0)} FCFA`,
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "estPublie",
      header: "Publié",
      cell: ({ row }) => (row.original.estPublie ? "Oui" : "Non"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedProduct(row.original)
              setIsDialogOpen(true)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Le produit sera définitivement supprimé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteProduct(row.original.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting === row.original.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  const loadProduits = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllProduits()
      setProduits(data)
    } catch (err: any) {
      console.error("Erreur lors du chargement des produits:", err)
      setError(err.message || "Erreur lors du chargement des produits")
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProduits()
  }, [])

  const handleDeleteProduct = async (id: string) => {
    setIsDeleting(id)
    try {
      const success = await deleteProduit(id)
      if (success) {
        setProduits((prev) => prev.filter((p) => p.id !== id))
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès.",
        })
      } else {
        throw new Error("Erreur lors de la suppression du produit")
      }
    } catch (err: any) {
      console.error("Erreur lors de la suppression du produit:", err)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleFormSuccess = () => {
    setIsDialogOpen(false)
    setSelectedProduct(null)
    loadProduits()
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des produits</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
              <DialogDescription>
                {selectedProduct
                  ? "Modifiez les informations du produit ci-dessous."
                  : "Remplissez le formulaire pour ajouter un nouveau produit."}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              product={selectedProduct || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-md">{error}</div>}

      <DataTable
        columns={columns}
        data={produits}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un produit..."
        searchColumn="nom"
      />
    </div>
  )
}
