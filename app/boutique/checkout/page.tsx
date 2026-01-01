"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/components/cart-provider"
import {
  collection,
  addDoc,
  serverTimestamp,
  doc as firestoreDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { BackButton } from "@/components/back-button"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const { items: cart, totalPrice: total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderNumber: string
    trackingUrl: string
  } | null>(null)
  const [lastOrderSnapshot, setLastOrderSnapshot] = useState<any>(null)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminStatus, setAdminStatus] = useState("pending")
  const [adminUpdateLoading, setAdminUpdateLoading] = useState(false)
  
  // Informations de livraison
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Sénégal")
  const paymentPlaceholder = "Paiement confirmé par l'équipe"

  const formatPrice = (amount: number) => (amount <= 0 ? "Gratuit" : `${amount.toLocaleString("fr-FR")} FCFA`)
  const subtotal = total || 0
  const vatAmount = subtotal * 0.18
  const estimatedTotal = subtotal

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  }

  // Charger les informations de l'utilisateur connecté
  useEffect(() => {
    const loadUserInfo = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(firestoreDoc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setEmail(user.email || userData.email || "")
            setFirstName(userData.prenom || "")
            setLastName(userData.nom || "")
            setPhone(userData.telephone || "")
            setAddress(userData.adresse || "")
            setCity(userData.ville || "")
            setPostalCode(userData.codePostal || "")
            setIsAdmin(Boolean(userData.role === "admin" || userData.isAdmin))
          } else {
            setEmail(user.email || "")
          }
        } catch (error) {
          console.error("Erreur lors du chargement des infos utilisateur:", error)
          setEmail(user.email || "")
        }
      }
    }

    loadUserInfo()
  }, [user])

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (loading) return
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour passer une commande",
        variant: "destructive",
      })
      router.push(`/connexion?redirect=/boutique/checkout`)
    }
  }, [user, loading, router, toast])

  const handleAdminStatusChange = async (nextStatus: string) => {
    if (!currentOrderId) return
    setAdminUpdateLoading(true)
    try {
      await updateDoc(firestoreDoc(db, "orders", currentOrderId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      })
      setAdminStatus(nextStatus)
      setLastOrderSnapshot((prev: any) => (prev ? { ...prev, status: nextStatus } : prev))
      toast({
        title: "Statut mis à jour",
        description: `La commande ${lastOrderSnapshot?.orderNumber || ""} est maintenant ${statusLabels[nextStatus] || nextStatus}`,
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut pour le moment.",
        variant: "destructive",
      })
    } finally {
      setAdminUpdateLoading(false)
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

  if (orderConfirmation && lastOrderSnapshot) {
    return (
      <div className="container py-10 space-y-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader>
              <CardTitle className="text-3xl">Commande enregistrée 🎉</CardTitle>
              <CardDescription>Merci pour votre confiance. Nous avons transmis toutes vos informations à notre équipe logistique.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-primary/20 p-4">
                  <p className="text-sm text-muted-foreground">Numéro de commande</p>
                  <p className="text-xl font-semibold tracking-tight">{orderConfirmation.orderNumber}</p>
                </div>
                <div className="rounded-2xl border border-primary/20 p-4">
                  <p className="text-sm text-muted-foreground">Statut actuel</p>
                  <p className="text-xl font-semibold tracking-tight">{statusLabels[adminStatus] || statusLabels.pending}</p>
                </div>
                <div className="rounded-2xl border border-muted p-4">
                  <p className="text-sm text-muted-foreground">Livraison</p>
                  <p className="font-semibold">À discuter avec l'administrateur</p>
                  <p className="text-xs text-muted-foreground">Les détails de livraison seront convenus selon votre localisation</p>
                </div>
                <div className="rounded-2xl border border-muted p-4">
                  <p className="text-sm text-muted-foreground">Paiement</p>
                  <p className="font-semibold">{paymentPlaceholder}</p>
                  <p className="text-xs text-muted-foreground">Confirmation envoyée à l&apos;administrateur</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2 border-dashed border-primary/40 text-primary hover:bg-primary/10" asChild>
                  <Link href="/boutique">Continuer mes achats</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Un email récapitulatif vient de vous être envoyé. L&apos;administrateur vous contactera prochainement pour discuter des détails de livraison selon votre localisation ({lastOrderSnapshot.userInfo.city}, {lastOrderSnapshot.userInfo.country}).
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de livraison</CardTitle>
                <CardDescription>Rappel des informations adressées à notre équipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Client :</span> {lastOrderSnapshot.userInfo.firstName} {lastOrderSnapshot.userInfo.lastName}
                </p>
                <p>
                  <span className="font-medium">Adresse :</span> {lastOrderSnapshot.userInfo.address}, {lastOrderSnapshot.userInfo.city}{" "}
                  {lastOrderSnapshot.userInfo.postalCode}, {lastOrderSnapshot.userInfo.country}
                </p>
                <p>
                  <span className="font-medium">Contact :</span> {lastOrderSnapshot.userInfo.email} · {lastOrderSnapshot.userInfo.phone}
                </p>
              </CardContent>
            </Card>

            {isAdmin && currentOrderId && (
              <Card>
                <CardHeader>
                  <CardTitle>Gestion administrative</CardTitle>
                  <CardDescription>Mettez à jour le statut de la commande</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Label htmlFor="adminStatus">Statut</Label>
                  <select
                    id="adminStatus"
                    value={adminStatus}
                    onChange={(event) => handleAdminStatusChange(event.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={adminUpdateLoading}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">Le client sera notifié automatiquement de chaque changement.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Détails de la commande</CardTitle>
                <CardDescription>{lastOrderSnapshot.items.length} article(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lastOrderSnapshot.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground">Quantité : {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatPrice(lastOrderSnapshot.subtotal)}</span>
                  </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-muted-foreground">À discuter</span>
                </div>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total payé</span>
                  <span>{formatPrice(lastOrderSnapshot.total)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Vérifier si le panier est vide
  if ((!cart || cart.length === 0) && !orderConfirmation) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Ajoutez des produits à votre panier avant de passer commande.</p>
        <Button asChild>
          <Link href="/boutique">Voir la boutique</Link>
        </Button>
      </div>
    )
  }

  const handleSubmitOrder = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour passer une commande",
        variant: "destructive",
      })
      return
    }

    // Vérification des champs requis
    if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Conditions non acceptées",
        description: "Veuillez accepter les conditions générales de vente",
        variant: "destructive",
      })
      return
    }

    try {
      // Générer un numéro de commande unique
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const orderNumber = `CMD-${timestamp}-${random}`

      // Préparer les données de la commande
      const orderData = {
        orderNumber,
        userId: user.uid,
        userInfo: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          postalCode,
          country,
        },
        items: cart.map((item: any) => ({
          id: item.id,
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
          category: item.category || "",
        })),
        total: subtotal,
        subtotal,
        status: "pending", // En attente de validation
        paymentMethod: paymentPlaceholder,
        deliveryNote: "Les détails de livraison seront discutés avec l'administrateur selon la localisation du client.",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Sauvegarder la commande dans Firestore
      const orderRef = await addDoc(collection(db, "orders"), orderData)

      // Alerter l'admin avec tous les détails de la commande
      await addDoc(collection(db, "admin_notifications"), {
        type: "new_order",
        orderNumber,
        orderId: orderRef.id,
        userId: user.uid,
        userInfo: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          postalCode,
          country,
        },
        message: `Nouvelle commande ${orderNumber}. Contactez le client pour discuter des détails de livraison selon sa localisation (${city}, ${country}).`,
        createdAt: serverTimestamp(),
      })

      toast({
        title: "Commande enregistrée",
        description: `Votre commande ${orderNumber} a été enregistrée avec succès`,
      })

      setOrderConfirmation({
        orderNumber,
        trackingUrl: `/boutique/suivi?orderNumber=${orderNumber}`,
      })
      setLastOrderSnapshot(orderData)
      setCurrentOrderId(orderRef.id)
      setAdminStatus(orderData.status)
      clearCart()
      setTermsAccepted(false)
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre commande",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <BackButton href="/boutique" label="Retour à la boutique" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>Entrez vos coordonnées. L'administrateur vous contactera pour discuter de la livraison selon votre localisation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="Votre prénom"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Votre nom"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  placeholder="Votre numéro de téléphone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  placeholder="Votre adresse"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    placeholder="Code postal"
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    placeholder="Ville"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  placeholder="Pays"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paiement</CardTitle>
              <CardDescription>Validation sécurisée après contrôle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-primary">
                Aucun paiement en ligne n&apos;est demandé. L&apos;administrateur confirme le règlement une fois la commande vérifiée.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de commande</CardTitle>
              <CardDescription>{cart ? cart.length : 0} article(s) dans votre panier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {cart &&
                  cart.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                        <div className="text-xs text-muted-foreground">Quantité: {item.quantity}</div>
                      </div>
                      <div className="text-right font-medium">{(item.price * item.quantity).toFixed(2)} FCFA</div>
                    </div>
                  ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-muted-foreground">À discuter avec l'administrateur</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TVA (18%)</span>
                  <span>{formatPrice(Math.round(vatAmount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paiement</span>
                  <span>{paymentPlaceholder}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(estimatedTotal)}</span>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md text-sm flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Paiement sécurisé</p>
                  <p className="text-muted-foreground">Toutes vos données sont protégées et chiffrées</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))}
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les{" "}
                  <Link href="/conditions" className="text-primary hover:underline">
                    conditions générales de vente
                  </Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button
                className="w-full gap-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white hover:opacity-90"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Traitement en cours..." : "Confirmer la commande"}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/boutique">Continuer mes achats</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Besoin d'aide ?</p>
            <ul className="space-y-1">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contacter le service client
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  Questions fréquentes
                </Link>
              </li>
              <li>
                <Link href="/retours" className="hover:underline">
                  Politique de retour
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
