"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SafeImage } from "@/components/ui/safe-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Search, Star, ArrowRight, Target, Zap, Award, TrendingUp, Package, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/components/cart-provider"
import { getPublishedProduits, type Produit } from "@/lib/services/produit-service"
import { Skeleton } from "@/components/ui/skeleton"
import { getCourseImage } from "@/lib/utils/course-images"

// Catégories de produits
const categories = [
  { id: "tous", name: "Tous", icon: "🛍️", color: "from-blue-500 to-cyan-500" },
  { id: "livres", name: "Livres", icon: "📚", color: "from-purple-500 to-pink-500" },
  { id: "informatique", name: "Informatique", icon: "💻", color: "from-green-500 to-emerald-500" },
  { id: "fournitures", name: "Fournitures", icon: "✏️", color: "from-orange-500 to-red-500" },
  { id: "calculatrices", name: "Calculatrices", icon: "🔢", color: "from-indigo-500 to-blue-500" },
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  // Composant de chargement pour les produits
  const ProductSkeleton = () => (
    <Card className="overflow-hidden h-full flex flex-col border-2">
      <div className="relative h-64">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="flex-grow p-6">
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
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  )

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category)
    if (cat) {
      return `bg-gradient-to-r ${cat.color} text-white border-0`
    }
    return "bg-primary/10 text-primary border-primary/20"
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10">
          <motion.div
            className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-purple-600 p-4 rounded-2xl">
                <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Boutique Mathosphère
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Livres, calculatrices, matériel informatique et fournitures scolaires pour tous vos besoins mathématiques. Qualité garantie, prix compétitifs.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{products.length}+ produits</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Award className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Qualité garantie</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barre de recherche */}
      <div className="container -mt-8 relative z-20 mb-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="container pb-10 space-y-8">
        {/* Tabs pour les catégories */}
        <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-2 bg-muted/50">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-semibold text-xs md:text-sm">{category.name}</span>
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
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.map((product) => {
                  const productImage = product.imageUrl || getCourseImage("mathématiques")

                  return (
                    <motion.div key={product.id} variants={fadeIn}>
                      <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                        <div className="relative h-64 overflow-hidden">
                          <Link href={`/boutique/${product.id}`}>
                            <SafeImage
                              src={productImage}
                              alt={product.nom}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </Link>
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {product.bestseller && (
                            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                              <TrendingUp className="h-3 w-3 mr-1" /> Bestseller
                            </Badge>
                          )}
                          {product.oldPrice && (
                            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                              -{Math.round(((product.oldPrice - product.prix) / product.oldPrice) * 100)}%
                            </Badge>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>

                        <CardContent className="pt-6 flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getCategoryColor(product.categorie)}>{product.categorie}</Badge>
                            <div className="flex items-center gap-1">
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
                          </div>
                          <Link href={`/boutique/${product.id}`} className="block group-hover:underline">
                            <h3 className="font-bold text-foreground text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.nom}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              {product.prix.toFixed(0)} FCFA
                            </span>
                            {product.oldPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.oldPrice.toFixed(0)} FCFA
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Package className="h-3 w-3 text-muted-foreground" />
                            <span className={`font-medium ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-orange-600" : "text-red-600"}`}>
                              {product.stock > 10
                                ? "En stock"
                                : product.stock > 0
                                  ? `Plus que ${product.stock} en stock`
                                  : "Rupture de stock"}
                            </span>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-4 pb-6 flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md group-hover:shadow-lg transition-all duration-300"
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
                          <Button
                            variant="outline"
                            className="px-4 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                            asChild
                          >
                            <Link href={`/boutique/${product.id}`}>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `Aucun produit ne correspond à votre recherche "${searchQuery}".`
                      : "Aucun produit n'est disponible dans cette catégorie pour le moment."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
