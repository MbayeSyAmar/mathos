"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ShoppingBag, Star, Truck, Shield, RefreshCw, Heart, Share, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/components/cart-provider"
import { getProduitById, getProduitsByCategorie, type Produit } from "@/lib/services/produit-service"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  collection, 
  doc as firestoreDoc, 
  addDoc, 
  getDocs,
  updateDoc, 
  query,
  where,
  serverTimestamp
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const resolvedParams = use(params)
  const productId = resolvedParams.id
  const [product, setProduct] = useState<Produit | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Produit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      try {
        const productData = await getProduitById(productId)
        if (productData) {
          setProduct(productData)
          // Charger des produits similaires
          if (productData.categorie) {
            const similar = await getProduitsByCategorie(productData.categorie, 3)
            setSimilarProducts(similar.filter((p) => p.id !== productId))
          }
        }

        // Vérifier si le produit est dans les favoris
        if (user) {
          const favoritesQuery = query(
            collection(db, "boutique_favorites"),
            where("userId", "==", user.uid),
            where("productId", "==", productId)
          )
          const favoritesSnap = await getDocs(favoritesQuery)
          setIsFavorite(favoritesSnap.docs.some(doc => !doc.data().deleted))
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId, user])

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({ 
        ...product, 
        name: product.nom,
        price: product.prix,
        image: product.imageUrl,
        quantity 
      })
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter aux favoris",
        variant: "destructive",
      })
      return
    }

    try {
      if (isFavorite) {
        // Retirer des favoris
        const favoritesQuery = query(
          collection(db, "boutique_favorites"),
          where("userId", "==", user.uid),
          where("productId", "==", productId)
        )
        const favoritesSnap = await getDocs(favoritesQuery)
        
        const deletePromises = favoritesSnap.docs.map(doc => 
          updateDoc(firestoreDoc(db, "boutique_favorites", doc.id), { deleted: true })
        )
        await Promise.all(deletePromises)
        
        setIsFavorite(false)
        toast({ title: "Retiré des favoris", description: "Produit retiré de vos favoris" })
      } else {
        // Ajouter aux favoris
        await addDoc(collection(db, "boutique_favorites"), {
          userId: user.uid,
          productId: productId,
          productName: product?.nom || "",
          date: serverTimestamp(),
        })
        
        setIsFavorite(true)
        toast({ title: "Ajouté aux favoris", description: "Produit ajouté à vos favoris" })
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({ 
        title: "Lien copié", 
        description: "Le lien du produit a été copié dans le presse-papiers" 
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      })
    }
  }

  const handleOpenReviewDialog = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour écrire un avis",
        variant: "destructive",
      })
      router.push(`/connexion?redirect=/boutique/${productId}`)
      return
    }
    setShowReviewDialog(true)
  }

  const handleSubmitReview = async () => {
    if (!user) return

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingReview(true)
    try {
      await addDoc(collection(db, "boutique_reviews"), {
        productId: productId,
        userId: user.uid,
        userName: user.displayName || "Utilisateur anonyme",
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        date: serverTimestamp(),
      })

      toast({
        title: "Avis publié",
        description: "Votre avis a été ajouté avec succès",
      })

      // Réinitialiser le formulaire
      setReviewRating(5)
      setReviewTitle("")
      setReviewComment("")
      setShowReviewDialog(false)
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error)
      toast({
        title: "Erreur",
        description: "Impossible de publier l'avis",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/boutique")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-muted-foreground">
            <Link href="/boutique" className="hover:underline">
              Boutique
            </Link>{" "}
            / Chargement...
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="relative">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <div className="pt-4 border-t">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <p className="text-muted-foreground mb-6">Le produit que vous recherchez n'existe pas ou a été retiré.</p>
        <Button asChild>
          <Link href="/boutique">Retour à la boutique</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/boutique")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          <Link href="/boutique" className="hover:underline">
            Boutique
          </Link>{" "}
          / {product.nom}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="relative">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={product.nom}
              fill
              className="object-contain bg-muted/30"
            />
          </div>
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
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{product.nom}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating || 4)
                    ? "text-yellow-500 fill-yellow-500"
                    : i < (product.rating || 4)
                      ? "text-yellow-500 fill-yellow-500 opacity-50"
                      : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({product.rating || 4})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{product.prix.toFixed(0)} FCFA</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">{product.oldPrice.toFixed(0)} FCFA</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
            {product.stock > 10
              ? "En stock"
              : product.stock > 0
                ? `Plus que ${product.stock} en stock`
                : "Rupture de stock"}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 text-center">{quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1 bg-gray-900 hover:bg-gray-800 h-10"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-4 w-4 mr-2" /> Ajouter au panier
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`h-10 w-10 ${isFavorite ? "text-red-500 border-red-500" : ""}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Livraison gratuite</p>
                <p className="text-muted-foreground">À partir de 50€</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Garantie 2 ans</p>
                <p className="text-muted-foreground">Sur tous nos produits</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Retours gratuits</p>
                <p className="text-muted-foreground">Sous 30 jours</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="description" className="w-full mb-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Caractéristiques</TabsTrigger>
          <TabsTrigger value="reviews">Avis clients</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {product.longDescription ? (
                  product.longDescription.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>{product.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.details &&
                  Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{product.rating || 4}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 4)
                              ? "text-yellow-500 fill-yellow-500"
                              : i < (product.rating || 4)
                                ? "text-yellow-500 fill-yellow-500 opacity-50"
                                : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Basé sur 24 avis</p>
                  </div>
                  <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleOpenReviewDialog}>
                    Écrire un avis
                  </Button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      author: "Sophie L.",
                      date: "15/03/2023",
                      rating: 5,
                      title: "Excellent produit !",
                      comment:
                        "Très satisfaite de mon achat. Le produit correspond parfaitement à la description et est arrivé rapidement. Je recommande vivement !",
                    },
                    {
                      author: "Thomas M.",
                      date: "02/02/2023",
                      rating: 4,
                      title: "Bon rapport qualité-prix",
                      comment:
                        "Produit de bonne qualité pour un prix raisonnable. La livraison a été un peu longue mais le service client a été très réactif.",
                    },
                    {
                      author: "Julie D.",
                      date: "18/01/2023",
                      rating: 5,
                      title: "Parfait pour mes études",
                      comment:
                        "Ce produit m'aide beaucoup dans mes études de mathématiques. Je l'utilise quotidiennement et il répond parfaitement à mes besoins.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{review.title}</div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.author} - {review.date}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {similarProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group h-full flex flex-col">
                <div className="relative h-48">
                  <Link href={`/boutique/${product.id}`}>
                    <Image
                      src={product.imageUrl || "/placeholder.svg?height=200&width=400"}
                      alt={product.nom}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>
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
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{product.prix.toFixed(0)} FCFA</span>
                    {product.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.oldPrice.toFixed(0)} FCFA
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialogue pour écrire un avis */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Écrire un avis</DialogTitle>
            <DialogDescription>
              Partagez votre expérience avec ce produit
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Note</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewRating(rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= reviewRating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-title">Titre</Label>
              <input
                id="review-title"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Résumez votre avis"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment">Commentaire</Label>
              <Textarea
                id="review-comment"
                placeholder="Décrivez votre expérience..."
                rows={5}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSubmittingReview}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !reviewTitle.trim() || !reviewComment.trim()}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isSubmittingReview ? "Publication..." : "Publier l'avis"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
