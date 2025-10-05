"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Search, Filter, Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/components/cart-provider"
import { getPublishedProduits, type Produit } from "@/lib/services/produit-service"
import { Skeleton } from "@/components/ui/skeleton"

// Catégories de produits
const categories = [
  { id: "tous", name: "Tous les produits" },
  { id: "livres", name: "Livres" },
  { id: "informatique", name: "Informatique" },
  { id: "fournitures", name: "Fournitures scolaires" },
  { id: "calculatrices", name: "Calculatrices" },
]

export default function BoutiquePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Produit[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Produit[]>([])
  const [activeCategory, setActiveCategory] = useState("tous")
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()

  // Charger les produits depuis Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getPublishedProduits(100)
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtrer les produits en fonction de la recherche et de la catégorie
  useEffect(() => {
    let result = products

    // Filtre par catégorie
    if (activeCategory !== "tous") {
      result = result.filter((product) => product.categorie === activeCategory)
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.nom.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    setFilteredProducts(result)
  }, [searchQuery, activeCategory, products])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Composant de chargement pour les produits
  const ProductSkeleton = () => (
    <Card className="overflow-hidden h-full flex flex-col border-gray-200">
      <div className="relative h-48">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="flex-grow p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-6 w-1/2 mb-1" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  )

  return (
    <div className="container py-10">
      <motion.div className="space-y-4 text-center mb-10" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Boutique Mathosphère</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Livres, calculatrices, matériel informatique et fournitures scolaires pour tous vos besoins mathématiques.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 flex justify-end">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtrer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tous" className="w-full" onValueChange={handleCategoryChange}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div key={product.id} initial="hidden" animate="visible" variants={fadeIn}>
                  <Card className="overflow-hidden group h-full flex flex-col border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="relative h-48">
                      <Link href={`/boutique/${product.id}`}>
                        <Image
                          src={product.imageUrl || "/placeholder.svg?height=200&width=400"}
                          alt={product.nom}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </Link>
                      {product.bestseller && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-red-500 hover:bg-red-600 text-white">Bestseller</Badge>
                        </div>
                      )}
                      {product.oldPrice && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500 hover:bg-green-600 text-white">
                            -{Math.round(((product.oldPrice - product.prix) / product.oldPrice) * 100)}%
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="flex-grow p-4">
                      <Link href={`/boutique/${product.id}`} className="block group-hover:underline">
                        <h3 className="font-bold text-foreground text-lg mb-1">{product.nom}</h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 4)
                                ? "text-yellow-500 fill-yellow-500"
                                : i < (product.rating || 4)
                                  ? "text-yellow-500 fill-yellow-500 opacity-50"
                                  : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({product.rating || 4})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{product.prix.toFixed(0)} FCFA</span>
                        {product.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.oldPrice.toFixed(0)} FCFA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.stock > 10
                          ? "En stock"
                          : product.stock > 0
                            ? `Plus que ${product.stock} en stock`
                            : "Rupture de stock"}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button
                        className="flex-1 bg-gray-900 hover:bg-gray-800"
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.nom,
                            price: product.prix,
                            quantity: 1,
                            image: product.imageUrl,
                            description: product.description,
                          })
                        }
                        disabled={product.stock === 0}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" /> Ajouter au panier
                      </Button>
                      <Button variant="outline" asChild className="px-3">
                        <Link href={`/boutique/${product.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou de consulter une autre catégorie.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
