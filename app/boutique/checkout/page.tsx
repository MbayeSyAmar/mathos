"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/components/cart-provider"
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc as firestoreDoc,
  getDoc
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { BackButton } from "@/components/back-button"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { items: cart, totalPrice: total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [deliveryMode, setDeliveryMode] = useState("standard")
  
  // Informations de livraison
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Sénégal")
  const [paymentMethod, setPaymentMethod] = useState("card")

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
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour passer une commande",
        variant: "destructive",
      })
      router.push(`/connexion?redirect=/boutique/checkout`)
    }
  }, [user, router, toast])

  // Vérifier si le panier est vide
  if (!cart || cart.length === 0) {
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

      // Calculer les frais de livraison
      const deliveryCost = deliveryMode === "express" ? 5000 : 2000

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
        total: total + deliveryCost,
        subtotal: total,
        deliveryMode,
        deliveryCost,
        status: "pending", // En attente de validation
        paymentMethod: paymentMethod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Sauvegarder la commande dans Firestore
      await addDoc(collection(db, "orders"), orderData)

      toast({
        title: "Commande enregistrée",
        description: `Votre commande ${orderNumber} a été enregistrée avec succès`,
      })

      // Vider le panier et rediriger
      setTimeout(() => {
        clearCart()
        router.push(`/boutique/confirmation?orderNumber=${orderNumber}`)
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre commande",
        variant: "destructive",
      })
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

  return (
    <div className="container py-10">
      <div className="mb-6">
        <BackButton href="/boutique" label="Retour à la boutique" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
              <CardDescription>Entrez vos coordonnées pour la livraison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Votre prénom" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Votre nom" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre.email@exemple.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="Votre numéro de téléphone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="Votre adresse" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input id="postalCode" placeholder="Code postal" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" placeholder="Ville" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input id="country" placeholder="Pays" defaultValue="France" required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mode de livraison</CardTitle>
              <CardDescription>Choisissez votre mode de livraison préféré</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="standard" className="space-y-4">
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Livraison standard</div>
                        <div className="text-sm text-muted-foreground">3-5 jours ouvrés</div>
                      </div>
                    </Label>
                  </div>
                  <div className="font-medium">{total >= 30000 ? "Gratuit" : "3000 FCFA"}</div>
                </div>
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Livraison express</div>
                        <div className="text-sm text-muted-foreground">1-2 jours ouvrés</div>
                      </div>
                    </Label>
                  </div>
                  <div className="font-medium">6500 FCFA</div>
                </div>
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Retrait en magasin</div>
                        <div className="text-sm text-muted-foreground">Disponible sous 24h</div>
                      </div>
                    </Label>
                  </div>
                  <div className="font-medium">Gratuit</div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mode de paiement</CardTitle>
              <CardDescription>Choisissez votre mode de paiement préféré</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Carte bancaire</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="other">Autres</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nom sur la carte</Label>
                    <Input id="cardName" placeholder="Nom complet" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <div className="relative">
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Date d'expiration</Label>
                      <Input id="expiryDate" placeholder="MM/AA" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox id="saveCard" />
                    <Label htmlFor="saveCard">Sauvegarder cette carte pour mes prochains achats</Label>
                  </div>
                </TabsContent>
                <TabsContent value="paypal" className="mt-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Vous serez redirigé vers PayPal pour finaliser votre paiement.
                    </p>
                    <Button className="bg-[#0070ba] hover:bg-[#005ea6]">Payer avec PayPal</Button>
                  </div>
                </TabsContent>
                <TabsContent value="other" className="mt-4">
                  <div className="space-y-4">
                    <RadioGroup defaultValue="transfer" className="space-y-4">
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer">Virement bancaire</Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="check" id="check" />
                        <Label htmlFor="check">Chèque</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>
              </Tabs>
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
                  <span>{total ? total.toFixed(2) : "0.00"} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{total && total >= 30000 ? "Gratuite" : "3000 FCFA"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TVA (18%)</span>
                  <span>{total ? (total * 0.18).toFixed(0) : "0"} FCFA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">
                    {total ? (total >= 30000 ? total : total + 3000).toFixed(0) : "0"} FCFA
                  </span>
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
                <Checkbox id="terms" required />
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
                className="w-full bg-gray-900 hover:bg-gray-800"
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
