"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/admin/product-form"
import { getProduitById, type Produit } from "@/lib/services/produit-service"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ModifierProduitPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Produit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProduitById(params.id)
        if (productData) {
          setProduct(productData)
        } else {
          setError("Produit non trouvé")
        }
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err)
        setError("Erreur lors du chargement du produit")
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleSuccess = () => {
    router.push("/admin/super/boutique")
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/super/boutique")}>
            Retour à la liste des produits
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Modifier le produit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du produit</CardTitle>
        </CardHeader>
        <CardContent>
          {product && <ProductForm product={product} onSuccess={handleSuccess} onCancel={handleCancel} />}
        </CardContent>
      </Card>
    </div>
  )
}
